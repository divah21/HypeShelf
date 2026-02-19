"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Film, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdminOverviewPage() {
  const stats = useQuery(api.recommendations.getStats);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Admin Overview
        </h1>
        <p className="mt-1 text-muted-foreground">
          A snapshot of HypeShelf activity and content.
        </p>
      </div>

      {stats === undefined ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            href="/admin/users"
            accentClass="bg-blue-500/10 text-blue-600"
          />
          <StatCard
            title="Total Recommendations"
            value={stats.totalRecommendations}
            icon={Film}
            href="/admin/recommendations"
            accentClass="bg-accent/10 text-accent"
          />
          <StatCard
            title="Staff Picks"
            value={stats.staffPickCount}
            icon={Star}
            accentClass="bg-yellow-500/10 text-yellow-600"
          />
          <StatCard
            title="This Week"
            value={stats.recentCount}
            icon={TrendingUp}
            href="/admin/analytics"
            accentClass="bg-green-500/10 text-green-600"
          />
        </div>
      )}

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations by Genre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(stats.genreCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([genre, count]) => (
                  <div
                    key={genre}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3"
                  >
                    <span className="text-sm font-medium capitalize text-foreground">
                      {genre}
                    </span>
                    <span className="text-sm font-bold text-accent">
                      {count}
                    </span>
                  </div>
                ))}
              {Object.keys(stats.genreCounts).length === 0 && (
                <p className="col-span-full text-sm text-muted-foreground">
                  No recommendations yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  href,
  accentClass,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  href?: string;
  accentClass: string;
}) {
  const content = (
    <Card className="transition-all hover:shadow-md hover:border-accent/20">
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`rounded-lg p-3 ${accentClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
