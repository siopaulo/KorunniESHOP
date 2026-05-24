"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu } from "lucide-react";

import { AdminNavLinks } from "@/components/admin/AdminNavLinks";
import { logoutAction } from "@/lib/auth/actions";
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
  sessionEmail?: string | null;
  sessionName?: string | null;
}

export function AdminMobileNav({ role, sessionEmail, sessionName }: AdminMobileNavProps) {
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
      <SheetContent side="left" className="flex w-full max-w-xs flex-col p-0">
        <SheetHeader className="border-b border-border px-4 py-4">
          <SheetTitle>Administrace</SheetTitle>
        </SheetHeader>
        <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobilní admin navigace">
          <AdminNavLinks role={role} variant="mobile" onNavigate={() => setOpen(false)} />
        </nav>
        <div className="border-t border-border p-4">
          <Link
            href="/"
            className="mb-3 block rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            ← Náhled webu
          </Link>
          {sessionEmail ? (
            <p className="mb-2 truncate px-3 text-xs text-muted-foreground">
              {sessionName || sessionEmail}
            </p>
          ) : null}
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Odhlásit
            </button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
