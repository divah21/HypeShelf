"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-accent" />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            HypeShelf
          </span>
        </a>

        <nav className="flex items-center gap-3">
          <AuthLoading>
            <Skeleton className="h-8 w-20 rounded-md" />
          </AuthLoading>

          <Unauthenticated>
            <SignInButton mode="modal">
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Sign in
              </Button>
            </SignInButton>
          </Unauthenticated>

          <Authenticated>
            <a href="/dashboard">
              <Button variant="ghost" size="sm" className="text-foreground">
                Dashboard
              </Button>
            </a>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </Authenticated>
        </nav>
      </div>
    </header>
  );
}
