"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { AdminSidebar } from "@/components/admin-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Flame, ArrowRight, ShieldAlert } from "lucide-react";
import Link from "next/link";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const currentUser = useQuery(api.users.getCurrentUser);

  if (currentUser === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Flame className="h-10 w-10 text-accent animate-pulse" />
          <Skeleton className="h-6 w-48" />
        </div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6 text-center px-6">
          <ShieldAlert className="h-12 w-12 text-destructive-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="max-w-sm text-muted-foreground">
            You don&apos;t have permission to access the admin panel. Only
            admins can view this area.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AdminLayout({
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
              Admin sign-in required
            </h1>
            <p className="max-w-sm text-muted-foreground">
              You need to be signed in as an admin to access this area.
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
        <AdminGuard>
          <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
              <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/50 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <span className="text-sm font-medium text-destructive-foreground">
                  Admin Panel
                </span>
              </header>
              <main className="flex-1 p-6">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </AdminGuard>
      </Authenticated>
    </>
  );
}
