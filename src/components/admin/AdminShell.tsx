import Link from "next/link";
import { Leaf, LogOut } from "lucide-react";

import { siteConfig } from "@/config/site";
import { getSession } from "@/lib/auth/session";
import { logoutAction } from "@/lib/auth/actions";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { AdminNavLinks } from "@/components/admin/AdminNavLinks";

export async function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  const role = session?.role ?? "admin";

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <Leaf className="h-5 w-5 text-sage" aria-hidden="true" />
          <span className="font-display text-lg font-semibold">Administrace</span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin navigace">
          <AdminNavLinks role={role} variant="sidebar" />
        </nav>
        <div className="border-t border-border p-4">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            ← Náhled webu
          </Link>
          {session?.email ? (
            <p className="mb-2 truncate px-3 text-xs text-muted-foreground" title={session.email}>
              {session.fullName || session.email}
            </p>
          ) : null}
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-700 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Odhlásit
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-3 border-b border-border bg-card px-4 sm:h-16 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <AdminMobileNav role={role} sessionEmail={session?.email} sessionName={session?.fullName} />
            <div className="min-w-0 lg:hidden">
              <p className="truncate text-sm text-muted-foreground">
                {siteConfig.name} — administrace
              </p>
            </div>
          </div>
          <Link href="/" className="hidden text-sm text-sage hover:text-moss sm:inline lg:hidden">
            ← Zpět na web
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
