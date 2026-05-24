"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";

export function CartBadge() {
  const totalItems = useCart((s) => s.totalItems());
  if (totalItems === 0) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-sage px-1 text-[10px] font-medium text-white">
      {totalItems > 99 ? "99+" : totalItems}
    </span>
  );
}

export function CartLink({ children }: { children: React.ReactNode }) {
  return (
    <Link href="/kosik" className="relative inline-flex">
      {children}
    </Link>
  );
}
