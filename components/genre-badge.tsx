import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const genreColors: Record<string, string> = {
  horror: "bg-red-100 text-red-800 border-red-200",
  action: "bg-orange-100 text-orange-800 border-orange-200",
  comedy: "bg-yellow-100 text-yellow-800 border-yellow-200",
  drama: "bg-blue-100 text-blue-800 border-blue-200",
  "sci-fi": "bg-cyan-100 text-cyan-800 border-cyan-200",
  other: "bg-secondary text-secondary-foreground border-border",
};

export function GenreBadge({ genre }: { genre: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[11px] font-medium capitalize",
        genreColors[genre] ?? genreColors.other
      )}
    >
      {genre}
    </Badge>
  );
}
