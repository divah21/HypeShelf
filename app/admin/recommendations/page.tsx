"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { RecommendationCard } from "@/components/recommendation-card";
import { GenreFilter } from "@/components/genre-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { Film } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";

export default function AdminRecommendationsPage() {
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(
    undefined
  );

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

  const deleteRecommendation = useMutation(
    api.recommendations.deleteRecommendation
  );
  const toggleStaffPick = useMutation(api.recommendations.toggleStaffPick);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            All Listings
          </h1>
          <p className="mt-1 text-muted-foreground">
            View, moderate, and manage every recommendation on HypeShelf.
          </p>
        </div>
      </div>

      <GenreFilter selected={selectedGenre} onSelect={setSelectedGenre} />

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
              ? `No recommendations in "${selectedGenre}".`
              : "No recommendations yet."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {recommendations.length} listing
            {recommendations.length !== 1 ? "s" : ""}
            {selectedGenre ? ` in "${selectedGenre}"` : ""}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {recommendations.map((rec) => (
              <RecommendationCard
                key={rec._id}
                title={rec.title}
                genre={rec.genre}
                blurb={rec.blurb}
                link={rec.link}
                createdByName={rec.createdByName}
                isStaffPick={rec.isStaffPick}
                createdAt={rec.createdAt}
                canDelete
                onDelete={() =>
                  deleteRecommendation({
                    id: rec._id as Id<"recommendations">,
                  })
                }
                canToggleStaffPick
                onToggleStaffPick={() =>
                  toggleStaffPick({
                    id: rec._id as Id<"recommendations">,
                  })
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
