import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  FileText,
  Star,
  Settings,
  Users,
  Mail,
  type LucideIcon,
} from "lucide-react";

export type AdminNavRole = "catalog" | "orders" | "settings" | "users" | "all";

export const adminNavItems: {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: AdminNavRole;
  exact?: boolean;
}[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: "all", exact: true },
  { href: "/admin/produkty", label: "Produkty", icon: Package, roles: "catalog" },
  { href: "/admin/kategorie", label: "Kategorie", icon: FolderTree, roles: "catalog" },
  { href: "/admin/objednavky", label: "Objednávky", icon: ShoppingCart, roles: "orders" },
  { href: "/admin/zpravy", label: "Zprávy", icon: Mail, roles: "orders" },
  { href: "/admin/novinky", label: "Novinky", icon: FileText, roles: "catalog" },
  { href: "/admin/reference", label: "Reference", icon: Star, roles: "catalog" },
  { href: "/admin/pravni-texty", label: "Právní texty", icon: FileText, roles: "settings" },
  { href: "/admin/nastaveni", label: "Nastavení", icon: Settings, roles: "settings" },
  { href: "/admin/uzivatele", label: "Uživatelé", icon: Users, roles: "users" },
];
