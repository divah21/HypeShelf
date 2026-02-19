"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { RecommendationCard } from "@/components/recommendation-card";
import { AddRecommendationForm } from "@/components/add-recommendation-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Film } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";

export default function MyRecommendationsPage() {
  const myRecs = useQuery(api.recommendations.listMyRecommendations);
  const deleteRecommendation = useMutation(
    api.recommendations.deleteRecommendation
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Recommendations
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage the movies you&apos;ve recommended to the shelf.
          </p>
        </div>
        <AddRecommendationForm />
      </div>

      {myRecs === undefined ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : myRecs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-16 text-center">
          <Film className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground mb-1">
            You haven&apos;t added any recommendations yet.
          </p>
          <p className="text-sm text-muted-foreground/70">
            Click &quot;Add Recommendation&quot; to share your first pick!
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {myRecs.length} recommendation{myRecs.length !== 1 ? "s" : ""}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {myRecs.map((rec) => (
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
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
