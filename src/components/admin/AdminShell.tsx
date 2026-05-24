import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  FileText,
  Star,
  Settings,
  Users,
  Leaf,
  type LucideIcon,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { getSession, canManageCatalog, canManageOrders, canManageSettings, canManageUsers } from "@/lib/auth/session";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

const allNavItems: { href: string; label: string; icon: LucideIcon; roles: "catalog" | "orders" | "settings" | "users" | "all" }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: "all" },
  { href: "/admin/produkty", label: "Produkty", icon: Package, roles: "catalog" },
  { href: "/admin/kategorie", label: "Kategorie", icon: FolderTree, roles: "catalog" },
  { href: "/admin/objednavky", label: "Objednávky", icon: ShoppingCart, roles: "orders" },
  { href: "/admin/novinky", label: "Novinky", icon: FileText, roles: "catalog" },
  { href: "/admin/reference", label: "Reference", icon: Star, roles: "catalog" },
  { href: "/admin/pravni-texty", label: "Právní texty", icon: FileText, roles: "settings" },
  { href: "/admin/nastaveni", label: "Nastavení", icon: Settings, roles: "settings" },
  { href: "/admin/uzivatele", label: "Uživatelé", icon: Users, roles: "users" },
];

function filterNav(role: string) {
  return allNavItems.filter((item) => {
    if (item.roles === "all") return true;
    if (item.roles === "catalog" && canManageCatalog(role as "admin" | "editor" | "orders_only")) return true;
    if (item.roles === "orders" && canManageOrders(role as "admin" | "editor" | "orders_only")) return true;
    if (item.roles === "settings" && canManageSettings(role as "admin" | "editor" | "orders_only")) return true;
    if (item.roles === "users" && canManageUsers(role as "admin" | "editor" | "orders_only")) return true;
    return false;
  });
}

export async function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  const navItems = session ? filterNav(session.role) : allNavItems;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Leaf className="h-5 w-5 text-sage" aria-hidden="true" />
          <span className="font-display font-semibold">Admin</span>
        </div>
        <nav className="space-y-1 p-4" aria-label="Admin navigace">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-3 border-b border-border bg-card px-4 sm:h-16 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <AdminMobileNav items={navItems} />
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
