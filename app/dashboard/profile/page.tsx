"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, Film, Star, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { user: clerkUser } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser);
  const myRecs = useQuery(api.recommendations.listMyRecommendations);
  const updateProfile = useMutation(api.users.updateProfile);

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await updateProfile({ name: newName.trim() });
      setEditingName(false);
    } catch (err) {
      console.error("Failed to update name:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser || !clerkUser) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  const staffPickCount =
    myRecs?.filter((r) => r.isStaffPick).length ?? 0;
  const joinDate = clerkUser.createdAt
    ? new Date(clerkUser.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Profile
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account details and view your activity.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-accent" />
            Account Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            {clerkUser.imageUrl ? (
              <img
                src={clerkUser.imageUrl}
                alt={currentUser.name}
                className="h-16 w-16 rounded-full border-2 border-border object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent text-xl font-bold">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 space-y-1">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter your name"
                    className="max-w-xs"
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveName}
                    disabled={saving || !newName.trim()}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingName(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-foreground">
                    {currentUser.name}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground"
                    onClick={() => {
                      setNewName(currentUser.name);
                      setEditingName(true);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    currentUser.role === "admin" ? "default" : "secondary"
                  }
                  className={
                    currentUser.role === "admin"
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }
                >
                  {currentUser.role === "admin" ? "Admin" : "Member"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="h-3.5 w-3.5" /> Email
              </Label>
              <p className="text-sm font-medium text-foreground">
                {currentUser.email}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="flex items-center gap-1.5 text-muted-foreground">
                <Shield className="h-3.5 w-3.5" /> Role
              </Label>
              <p className="text-sm font-medium text-foreground capitalize">
                {currentUser.role}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" /> Joined
              </Label>
              <p className="text-sm font-medium text-foreground">{joinDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Film className="h-5 w-5 text-accent" />
            Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
              <p className="text-3xl font-bold text-foreground">
                {myRecs?.length ?? "—"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Recommendations
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
              <p className="text-3xl font-bold text-accent">{staffPickCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                <Star className="inline h-3.5 w-3.5 mr-1" />
                Staff Picks
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
              <p className="text-3xl font-bold text-foreground">
                {myRecs
                  ? [...new Set(myRecs.map((r) => r.genre))].length
                  : "—"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Genres Covered
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
