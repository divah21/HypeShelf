"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GenreBadge } from "@/components/genre-badge";
import { Star, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  title: string;
  genre: string;
  blurb?: string;
  link?: string;
  createdByName: string;
  isStaffPick: boolean;
  createdAt: number;
  canDelete?: boolean;
  onDelete?: () => void;
  canToggleStaffPick?: boolean;
  onToggleStaffPick?: () => void;
}

export function RecommendationCard({
  title,
  genre,
  blurb,
  link,
  createdByName,
  isStaffPick,
  createdAt,
  canDelete,
  onDelete,
  canToggleStaffPick,
  onToggleStaffPick,
}: RecommendationCardProps) {
  const timeAgo = formatTimeAgo(createdAt);

  return (
    <Card
      className={cn(
        "group relative transition-all duration-200 hover:shadow-md",
        isStaffPick && "ring-1 ring-staff-pick/40"
      )}
    >
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-2">
              {isStaffPick && (
                <Star className="h-4 w-4 shrink-0 fill-staff-pick text-staff-pick" />
              )}
              <h3 className="font-semibold text-foreground leading-tight text-balance">
                {title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <GenreBadge genre={genre} />
              {isStaffPick && (
                <span className="text-[11px] font-medium text-staff-pick">
                  Staff Pick
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Open link</span>
                </Button>
              </a>
            )}
            {canToggleStaffPick && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  isStaffPick
                    ? "text-staff-pick hover:text-staff-pick/70"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={onToggleStaffPick}
              >
                <Star className={cn("h-4 w-4", isStaffPick && "fill-current")} />
                <span className="sr-only">Toggle staff pick</span>
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            )}
          </div>
        </div>

        {blurb && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {blurb}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
          <span>Added by {createdByName}</span>
          <time>{timeAgo}</time>
        </div>
      </CardContent>
    </Card>
  );
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
