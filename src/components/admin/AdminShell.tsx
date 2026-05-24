import Link from "next/link";
import { Leaf } from "lucide-react";

import { siteConfig } from "@/config/site";
import { getSession } from "@/lib/auth/session";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { AdminNavLinks } from "@/components/admin/AdminNavLinks";

export async function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  const role = session?.role ?? "admin";

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Leaf className="h-5 w-5 text-sage" aria-hidden="true" />
          <span className="font-display font-semibold">Admin</span>
        </div>
        <nav className="space-y-1 p-4" aria-label="Admin navigace">
          <AdminNavLinks role={role} variant="sidebar" />
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-3 border-b border-border bg-card px-4 sm:h-16 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <AdminMobileNav role={role} />
            <div className="min-w-0">
              <p className="truncate text-sm text-muted-foreground">
                {siteConfig.name} — administrace
              </p>
              {session && (
                <p className="truncate text-xs text-muted-foreground">
                  {session.fullName || session.email} · {session.role}
                </p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <Link href="/" className="hidden text-sm text-sage hover:text-moss sm:inline">
              ← Zpět na web
            </Link>
            <AdminLogoutButton />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
