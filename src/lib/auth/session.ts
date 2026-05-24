import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { AdminRole } from "@/types/database";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Nemáte oprávnění k této akci") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export interface AdminSession {
  userId: string;
  email: string;
  fullName: string;
  role: AdminRole;
}

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("id, email, full_name, role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile?.is_active) {
    return null;
  }

  return {
    userId: user.id,
    email: profile.email,
    fullName: profile.full_name,
    role: profile.role,
  } satisfies AdminSession;
}

export async function requireAuth(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export async function requireRole(allowedRoles: AdminRole[]): Promise<AdminSession> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) {
    throw new ForbiddenError();
  }
  return session;
}

export function canManageCatalog(role: AdminRole): boolean {
  return role === "admin" || role === "editor";
}

export function canManageOrders(role: AdminRole): boolean {
  return role === "admin" || role === "orders_only";
}

export function canManageSettings(role: AdminRole): boolean {
  return role === "admin";
}

export function canManageUsers(role: AdminRole): boolean {
  return role === "admin";
}

/** Route access by admin role */
export function canAccessAdminRoute(pathname: string, role: AdminRole): boolean {
  if (role === "admin") return true;

  if (role === "orders_only") {
    const allowed = ["/admin", "/admin/objednavky"];
    return allowed.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );
  }

  if (role === "editor") {
    const blocked = ["/admin/nastaveni", "/admin/uzivatele", "/admin/objednavky"];
    return !blocked.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );
  }

  return false;
}
