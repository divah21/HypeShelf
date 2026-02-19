import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listLatestPublic = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("recommendations")
      .withIndex("by_createdAt")
      .order("desc")
      .take(10);
  },
});

export const listAllWithFilters = query({
  args: {
    genre: v.optional(
      v.union(
        v.literal("horror"),
        v.literal("action"),
        v.literal("comedy"),
        v.literal("drama"),
        v.literal("sci-fi"),
        v.literal("other")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.genre) {
      return await ctx.db
        .query("recommendations")
        .withIndex("by_genre", (q) => q.eq("genre", args.genre!))
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("recommendations")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});

export const listMyRecommendations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await ctx.db
      .query("recommendations")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", identity.subject))
      .order("desc")
      .collect();
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allRecs = await ctx.db.query("recommendations").collect();
    const allUsers = await ctx.db.query("users").collect();

    const genreCounts: Record<string, number> = {};
    let staffPickCount = 0;
    const recentRecs: typeof allRecs = [];

    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    for (const rec of allRecs) {
      genreCounts[rec.genre] = (genreCounts[rec.genre] || 0) + 1;
      if (rec.isStaffPick) staffPickCount++;
      if (rec.createdAt > oneWeekAgo) recentRecs.push(rec);
    }

    return {
      totalRecommendations: allRecs.length,
      totalUsers: allUsers.length,
      staffPickCount,
      recentCount: recentRecs.length,
      genreCounts,
    };
  },
});

export const createRecommendation = mutation({
  args: {
    title: v.string(),
    genre: v.union(
      v.literal("horror"),
      v.literal("action"),
      v.literal("comedy"),
      v.literal("drama"),
      v.literal("sci-fi"),
      v.literal("other")
    ),
    link: v.optional(v.string()),
    blurb: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const userName =
      identity.name ?? identity.email ?? "Anonymous";

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .unique();

    if (!existingUser) {
      await ctx.db.insert("users", {
        clerkId: userId,
        name: userName,
        email: identity.email ?? "",
        role: "user",
      });
    }

    return await ctx.db.insert("recommendations", {
      title: args.title,
      genre: args.genre,
      link: args.link,
      blurb: args.blurb,
      createdBy: userId,
      createdByName: userName,
      createdAt: Date.now(),
      isStaffPick: false,
    });
  },
});

export const deleteRecommendation = mutation({
  args: { id: v.id("recommendations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const recommendation = await ctx.db.get(args.id);
    if (!recommendation) {
      throw new Error("Recommendation not found");
    }

    const userId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .unique();

    const isAdmin = user?.role === "admin";
    const isOwner = recommendation.createdBy === userId;

    if (!isAdmin && !isOwner) {
      throw new Error("Not authorized to delete this recommendation");
    }

    await ctx.db.delete(args.id);
  },
});

export const toggleStaffPick = mutation({
  args: { id: v.id("recommendations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Only admins can toggle staff picks");
    }

    const recommendation = await ctx.db.get(args.id);
    if (!recommendation) {
      throw new Error("Recommendation not found");
    }

    await ctx.db.patch(args.id, {
      isStaffPick: !recommendation.isStaffPick,
    });
  },
});
