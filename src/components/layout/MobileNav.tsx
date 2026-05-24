"use client";

import Link from "next/link";

import { navLinks } from "@/config/site";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileNavProps {
  trigger: React.ReactNode;
}

export function MobileNav({ trigger }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xs">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-1" aria-label="Mobilní navigace">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/kosik"
            className="mt-4 rounded-lg bg-primary px-3 py-3 text-center text-base font-medium text-primary-foreground"
          >
            Košík
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
