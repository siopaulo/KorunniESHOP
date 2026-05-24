"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
  className?: string;
}

export function StarRating({ value, onChange, size = "md", className }: StarRatingProps) {
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div
      className={cn("flex gap-0.5", className)}
      role={onChange ? "radiogroup" : undefined}
      aria-label={onChange ? "Hodnocení" : `Hodnocení ${value} z 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < value;
        const star = (
          <Star
            className={cn(
              sizeClass,
              filled ? "fill-sage text-sage" : "text-muted-foreground/30",
              onChange && "cursor-pointer hover:text-sage",
            )}
            aria-hidden={onChange ? true : undefined}
          />
        );

        if (onChange) {
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={filled}
              aria-label={`${i + 1} hvězdiček`}
              onClick={() => onChange(i + 1)}
              className="rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {star}
            </button>
          );
        }

        return <span key={i}>{star}</span>;
      })}
    </div>
  );
}
