"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { RecommendationCard } from "@/components/recommendation-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Flame,
  ArrowRight,
  Sparkles,
  Users,
  Shield,
  Film,
} from "lucide-react";
import Link from "next/link";

function PublicRecommendations() {
  const recommendations = useQuery(api.recommendations.listLatestPublic);

  if (recommendations === undefined) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-16 text-center">
        <Film className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-muted-foreground">
          No recommendations yet. Be the first to add one!
        </p>
      </div>
    );
  }

  return (
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
        />
      ))}
    </div>
  );
}

const features = [
  {
    icon: Sparkles,
    title: "Curate Your Shelf",
    description:
      "Add movies you love with genres, links, and a short blurb about why they're worth watching.",
  },
  {
    icon: Users,
    title: "Discover Together",
    description:
      "Browse what friends are recommending. Filter by genre and find your next obsession.",
  },
  {
    icon: Shield,
    title: "Staff Picks",
    description:
      "Admins highlight the best-of-the-best with a Staff Pick badge so great recs stand out.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Flame className="h-7 w-7 text-accent" />
            <span className="text-xl font-bold tracking-tight text-foreground">
              HypeShelf
            </span>
          </Link>

          <nav className="flex items-center gap-3">
            <AuthLoading>
              <Skeleton className="h-9 w-24 rounded-md" />
            </AuthLoading>

            <Unauthenticated>
              <SignInButton mode="modal">
                <Button
                  size="sm"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Sign in
                </Button>
              </SignInButton>
            </Unauthenticated>

            <Authenticated>
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Dashboard
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </Authenticated>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-125 w-175 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 md:pt-32">
            <div className="flex flex-col items-center gap-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm text-accent">
                <Flame className="h-4 w-4" />
                <span>Your friends have great taste</span>
              </div>

              <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance leading-[1.1]">
                Collect and share the stuff{" "}
                <span className="text-accent">you&apos;re hyped about.</span>
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
                HypeShelf is the place to drop your favorite movies, see what
                your friends are watching, and never run out of things to binge.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Unauthenticated>
                  <SignInButton mode="modal">
                    <Button
                      size="lg"
                      className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 px-8"
                    >
                      Sign in to add yours
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </SignInButton>
                </Unauthenticated>

                <Authenticated>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 px-8"
                    >
                      Go to your shelf
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </Authenticated>

                <AuthLoading>
                  <Skeleton className="h-12 w-52 rounded-md" />
                </AuthLoading>

                <a href="#latest">
                  <Button variant="outline" size="lg" className="px-8">
                    Browse recommendations
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border/50 bg-muted/30">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-accent/30 hover:shadow-md"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-2.5">
                    <feature.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="latest" className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">
                Latest Recommendations
              </h2>
            </div>
            <div className="h-px flex-1 bg-border" />
          </div>

          <PublicRecommendations />
        </section>
      </main>

      <footer className="border-t border-border/50 bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-accent" />
              <span className="font-semibold text-foreground">HypeShelf</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with Next.js, Convex, and Clerk. &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
