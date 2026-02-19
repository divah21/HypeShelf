"use client";

import { ReactNode, useMemo } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

let clientSingleton: ConvexReactClient | null = null;

function getConvexClient(): ConvexReactClient | null {
  if (!CONVEX_URL) return null;
  if (!clientSingleton) {
    clientSingleton = new ConvexReactClient(CONVEX_URL);
  }
  return clientSingleton;
}

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const convex = useMemo(() => getConvexClient(), []);

  if (!convex) {
    return <>{children}</>;
  }

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
