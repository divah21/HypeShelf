"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GENRES = [
  { value: undefined as string | undefined, label: "All" },
  { value: "horror", label: "Horror" },
  { value: "action", label: "Action" },
  { value: "comedy", label: "Comedy" },
  { value: "drama", label: "Drama" },
  { value: "sci-fi", label: "Sci-Fi" },
  { value: "other", label: "Other" },
];

export function GenreFilter({
  selected,
  onSelect,
}: {
  selected: string | undefined;
  onSelect: (genre: string | undefined) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {GENRES.map((g) => (
        <Button
          key={g.label}
          variant="outline"
          size="sm"
          className={cn(
            "text-xs",
            selected === g.value &&
              "bg-accent text-accent-foreground border-accent hover:bg-accent/90 hover:text-accent-foreground"
          )}
          onClick={() => onSelect(g.value)}
        >
          {g.label}
        </Button>
      ))}
    </div>
  );
}
