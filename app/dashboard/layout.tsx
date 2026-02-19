"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Flame, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthLoading>
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <Flame className="h-10 w-10 text-accent animate-pulse" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </AuthLoading>

      <Unauthenticated>
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-6 text-center px-6">
            <Flame className="h-12 w-12 text-accent" />
            <h1 className="text-2xl font-bold text-foreground">
              Sign in to access your dashboard
            </h1>
            <p className="max-w-sm text-muted-foreground">
              You need to be signed in to browse, add, and manage your recommendations.
            </p>
            <div className="flex gap-3">
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </SignInButton>
              <Link href="/">
                <Button variant="outline" size="lg">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <SidebarProvider>
          <DashboardSidebar />
          <SidebarInset>
            <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/50 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <span className="text-sm font-medium text-muted-foreground">
                Dashboard
              </span>
            </header>
            <main className="flex-1 p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </Authenticated>
    </>
  );
}
