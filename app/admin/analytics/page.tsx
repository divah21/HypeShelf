"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Film, Star, Users, TrendingUp, Flame } from "lucide-react";

const genreEmojis: Record<string, string> = {
  horror: "🔪",
  action: "💥",
  comedy: "😂",
  drama: "🎭",
  "sci-fi": "🚀",
  other: "🎬",
};

export default function AdminAnalyticsPage() {
  const stats = useQuery(api.recommendations.getStats);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Analytics
        </h1>
        <p className="mt-1 text-muted-foreground">
          Data and insights about HypeShelf usage.
        </p>
      </div>

      {stats === undefined ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-72 rounded-xl" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Total Users"
              value={stats.totalUsers}
              icon={Users}
              color="text-blue-500"
              bgColor="bg-blue-500/10"
            />
            <MetricCard
              label="Total Recs"
              value={stats.totalRecommendations}
              icon={Film}
              color="text-accent"
              bgColor="bg-accent/10"
            />
            <MetricCard
              label="Staff Picks"
              value={stats.staffPickCount}
              icon={Star}
              color="text-yellow-500"
              bgColor="bg-yellow-500/10"
            />
            <MetricCard
              label="This Week"
              value={stats.recentCount}
              icon={TrendingUp}
              color="text-green-500"
              bgColor="bg-green-500/10"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" />
                Genre Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(stats.genreCounts).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No data to display yet.
                </p>
              ) : (
                Object.entries(stats.genreCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([genre, count]) => {
                    const maxCount = Math.max(
                      ...Object.values(stats.genreCounts)
                    );
                    const percentage =
                      maxCount > 0 ? (count / maxCount) * 100 : 0;

                    return (
                      <div key={genre} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 font-medium capitalize text-foreground">
                            <span>{genreEmojis[genre] ?? "🎬"}</span>
                            {genre}
                          </span>
                          <span className="text-muted-foreground">
                            {count} rec{count !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-accent transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-accent" />
                Quick Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <InsightCard
                  label="Avg recs per user"
                  value={
                    stats.totalUsers > 0
                      ? (
                          stats.totalRecommendations / stats.totalUsers
                        ).toFixed(1)
                      : "0"
                  }
                />
                <InsightCard
                  label="Staff pick rate"
                  value={
                    stats.totalRecommendations > 0
                      ? `${((stats.staffPickCount / stats.totalRecommendations) * 100).toFixed(1)}%`
                      : "0%"
                  }
                />
                <InsightCard
                  label="Most popular genre"
                  value={
                    Object.keys(stats.genreCounts).length > 0
                      ? Object.entries(stats.genreCounts).sort(
                          ([, a], [, b]) => b - a
                        )[0][0]
                      : "None yet"
                  }
                  capitalize
                />
                <InsightCard
                  label="Genres covered"
                  value={String(Object.keys(stats.genreCounts).length)}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  color,
  bgColor,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`rounded-lg p-2.5 ${bgColor}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function InsightCard({
  label,
  value,
  capitalize: cap,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`text-lg font-semibold text-foreground mt-1 ${cap ? "capitalize" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
