"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { RecommendationCard } from "@/components/recommendation-card";
import { AddRecommendationForm } from "@/components/add-recommendation-form";
import { GenreFilter } from "@/components/genre-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { Film } from "lucide-react";
import type { Id } from "../../convex/_generated/dataModel";

export default function DashboardPage() {
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(
    undefined
  );
  const { user: clerkUser } = useUser();

  const recommendations = useQuery(api.recommendations.listAllWithFilters, {
    genre: selectedGenre as
      | "horror"
      | "action"
      | "comedy"
      | "drama"
      | "sci-fi"
      | "other"
      | undefined,
  });

  const currentUser = useQuery(api.users.getCurrentUser);
  const deleteRecommendation = useMutation(
    api.recommendations.deleteRecommendation
  );
  const toggleStaffPick = useMutation(api.recommendations.toggleStaffPick);

  const isAdmin = currentUser?.role === "admin";
  const userId = clerkUser?.id;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          All Recommendations
        </h1>
        <p className="mt-1 text-muted-foreground">
          Browse, filter, and manage movie recommendations from the community.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AddRecommendationForm />
        <GenreFilter selected={selectedGenre} onSelect={setSelectedGenre} />
      </div>

      {isAdmin && (
        <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">
          <span className="inline-flex h-2 w-2 rounded-full bg-accent" />
          You have admin privileges — you can delete any recommendation and
          toggle staff picks.
        </div>
      )}

      {recommendations === undefined ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-16 text-center">
          <Film className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">
            {selectedGenre
              ? `No recommendations in "${selectedGenre}" yet.`
              : "No recommendations yet. Be the first to add one!"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {recommendations.map((rec) => {
            const isOwner = rec.createdBy === userId;
            const canDelete = isOwner || isAdmin;

            return (
              <RecommendationCard
                key={rec._id}
                title={rec.title}
                genre={rec.genre}
                blurb={rec.blurb}
                link={rec.link}
                createdByName={rec.createdByName}
                isStaffPick={rec.isStaffPick}
                createdAt={rec.createdAt}
                canDelete={canDelete}
                onDelete={() =>
                  deleteRecommendation({
                    id: rec._id as Id<"recommendations">,
                  })
                }
                canToggleStaffPick={isAdmin}
                onToggleStaffPick={() =>
                  toggleStaffPick({
                    id: rec._id as Id<"recommendations">,
                  })
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
