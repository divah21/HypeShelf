import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  recommendations: defineTable({
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
    createdBy: v.string(),
    createdByName: v.string(),
    createdAt: v.number(),
    isStaffPick: v.boolean(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_genre", ["genre"])
    .index("by_createdBy", ["createdBy"]),

  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
  }).index("by_clerkId", ["clerkId"]),
});
