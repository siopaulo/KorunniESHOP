import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const { supabaseResponse, user, supabase } = await updateSession(request);
  supabaseResponse.headers.set("X-Robots-Tag", "noindex, nofollow");

  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some((p) => pathname === p);

  if (!user && !isPublicAdminPath) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && pathname === "/admin/login") {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    adminUrl.search = "";
    return NextResponse.redirect(adminUrl);
  }

  if (user && supabase && !isPublicAdminPath) {
    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("role, is_active")
      .eq("id", user.id)
      .single();

    if (!profile?.is_active) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }

    const role = profile.role;
    const blockedForEditor = ["/admin/nastaveni", "/admin/uzivatele", "/admin/objednavky"];
    const allowedForOrdersOnly = ["/admin", "/admin/objednavky"];

    if (role === "editor" && blockedForEditor.some((p) => pathname.startsWith(p))) {
      const dashUrl = request.nextUrl.clone();
      dashUrl.pathname = "/admin";
      return NextResponse.redirect(dashUrl);
    }

    if (
      role === "orders_only" &&
      !allowedForOrdersOnly.some((p) => pathname === p || pathname.startsWith(`${p}/`))
    ) {
      const ordersUrl = request.nextUrl.clone();
      ordersUrl.pathname = "/admin/objednavky";
      return NextResponse.redirect(ordersUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
