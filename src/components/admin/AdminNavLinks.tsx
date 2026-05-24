"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminNavItems, type AdminNavRole } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

interface AdminNavLinksProps {
  role: string;
  variant: "sidebar" | "mobile";
  onNavigate?: () => void;
}

function canSeeItem(itemRole: AdminNavRole, userRole: string): boolean {
  if (itemRole === "all") return true;
  if (itemRole === "catalog") return ["admin", "editor"].includes(userRole);
  if (itemRole === "orders") return ["admin", "orders_only"].includes(userRole);
  if (itemRole === "settings") return userRole === "admin";
  if (itemRole === "users") return userRole === "admin";
  return false;
}

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNavLinks({ role, variant, onNavigate }: AdminNavLinksProps) {
  const pathname = usePathname();
  const items = adminNavItems.filter((item) => canSeeItem(item.roles, role));

  return (
    <>
      {items.map((item) => {
        const active = isActive(pathname, item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg text-sm transition-colors",
              variant === "sidebar" && "px-3 py-2",
              variant === "mobile" && "px-3 py-3 font-medium",
              active
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
