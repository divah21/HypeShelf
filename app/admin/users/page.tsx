"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, ShieldCheck, User, Trash2 } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";
import { useState } from "react";

export default function AdminUsersPage() {
  const users = useQuery(api.users.listAllUsers);
  const updateUserRole = useMutation(api.users.updateUserRole);
  const deleteUser = useMutation(api.users.deleteUser);
  const currentUser = useQuery(api.users.getCurrentUser);

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleRoleChange = async (
    userId: Id<"users">,
    role: "admin" | "user"
  ) => {
    try {
      await updateUserRole({ userId, role });
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const handleDelete = async (userId: Id<"users">) => {
    try {
      await deleteUser({ userId });
      setConfirmDelete(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Users
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage user accounts and roles.
        </p>
      </div>

      {users === undefined ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {users.length} user{users.length !== 1 ? "s" : ""} total
          </div>

          <div className="space-y-3">
            {users.map((user) => {
              const isSelf = user.clerkId === currentUser?.clerkId;

              return (
                <Card key={user._id} className="transition-all hover:shadow-sm">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground truncate">
                          {user.name}
                        </span>
                        {isSelf && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0"
                          >
                            You
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>

                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className={
                        user.role === "admin"
                          ? "bg-accent text-accent-foreground gap-1"
                          : "gap-1"
                      }
                    >
                      {user.role === "admin" ? (
                        <ShieldCheck className="h-3 w-3" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      {user.role}
                    </Badge>

                    <Select
                      value={user.role}
                      onValueChange={(val) =>
                        handleRoleChange(
                          user._id as Id<"users">,
                          val as "admin" | "user"
                        )
                      }
                      disabled={isSelf}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>

                    {!isSelf &&
                      (confirmDelete === user._id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleDelete(user._id as Id<"users">)
                            }
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setConfirmDelete(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setConfirmDelete(user._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
