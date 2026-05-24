import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminContentWidth = "narrow" | "form" | "wide" | "full";

const widthClass: Record<AdminContentWidth, string> = {
  narrow: "max-w-xl",
  form: "max-w-3xl",
  wide: "max-w-5xl",
  full: "max-w-none",
};

interface AdminContentContainerProps {
  children: ReactNode;
  width?: AdminContentWidth;
  className?: string;
}

/** Centrovaný wrapper pro admin formuláře a editory (pattern z EsterkyGalerie). */
export function AdminContentContainer({
  children,
  width = "form",
  className,
}: AdminContentContainerProps) {
  return (
    <div className={cn("mx-auto w-full", widthClass[width], className)}>{children}</div>
  );
}
