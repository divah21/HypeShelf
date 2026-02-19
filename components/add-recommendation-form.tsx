"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const GENRES = ["horror", "action", "comedy", "drama", "sci-fi", "other"] as const;

export function AddRecommendationForm() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState<(typeof GENRES)[number] | "">("");
  const [link, setLink] = useState("");
  const [blurb, setBlurb] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createRecommendation = useMutation(api.recommendations.createRecommendation);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !genre) return;

    setIsSubmitting(true);
    try {
      await createRecommendation({
        title: title.trim(),
        genre: genre as (typeof GENRES)[number],
        link: link.trim() || undefined,
        blurb: blurb.trim() || undefined,
      });
      setTitle("");
      setGenre("");
      setLink("");
      setBlurb("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to create recommendation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Recommendation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a Recommendation</DialogTitle>
          <DialogDescription>
            Share something you think everyone should watch.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Inception"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="genre">Genre *</Label>
            <Select
              value={genre}
              onValueChange={(val) => setGenre(val as (typeof GENRES)[number])}
            >
              <SelectTrigger id="genre">
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((g) => (
                  <SelectItem key={g} value={g} className="capitalize">
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="link">
              Link <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="link"
              type="url"
              placeholder="https://..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="blurb">
              Short blurb <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="blurb"
              placeholder="Why should everyone watch this?"
              rows={3}
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={!title.trim() || !genre || isSubmitting}
            className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isSubmitting ? "Adding..." : "Add Recommendation"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
