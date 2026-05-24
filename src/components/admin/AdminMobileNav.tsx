"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { AdminNavLinks } from "@/components/admin/AdminNavLinks";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AdminMobileNavProps {
  role: string;
}

export function AdminMobileNav({ role }: AdminMobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden" aria-label="Admin menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs p-0">
        <SheetHeader className="border-b border-border px-4 py-4">
          <SheetTitle>Administrace</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-4" aria-label="Mobilní admin navigace">
          <AdminNavLinks role={role} variant="mobile" onNavigate={() => setOpen(false)} />
          <Link
            href="/"
            className="mt-4 rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            ← Zpět na web
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
