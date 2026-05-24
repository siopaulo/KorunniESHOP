"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/audit/log";
import { checkRateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validations/schemas";

export type AuthActionState = {
  error?: string;
};

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const rateLimit = checkRateLimit(`login:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!rateLimit.success) {
    return { error: "Příliš mnoho pokusů. Zkuste to za minutu." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Neplatné údaje" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Neplatný e-mail nebo heslo" };
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("id, is_active, role")
    .eq("id", data.user.id)
    .single();

  if (!profile?.is_active) {
    await supabase.auth.signOut();
    return { error: "Účet není aktivní. Kontaktujte administrátora." };
  }

  await writeAuditLog({
    userId: data.user.id,
    action: "auth.login",
    entityType: "admin_profiles",
    entityId: data.user.id,
    ipAddress: ip,
  });

  revalidatePath("/admin");
  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await writeAuditLog({
      userId: user.id,
      action: "auth.logout",
      entityType: "admin_profiles",
      entityId: user.id,
    });
  }

  await supabase.auth.signOut();
  revalidatePath("/admin");
  redirect("/admin/login");
}
