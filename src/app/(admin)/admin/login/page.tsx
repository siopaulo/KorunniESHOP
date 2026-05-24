import type { Metadata } from "next";

import { LoginBranding, LoginForm } from "@/components/admin/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Přihlášení",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <LoginBranding />
        {!configured ? (
          <div className="rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm text-earth">
            Supabase není nakonfigurováno. Doplňte proměnné v{" "}
            <code className="rounded bg-muted px-1">.env.local</code> podle{" "}
            <code className="rounded bg-muted px-1">docs/SUPABASE.md</code>.
          </div>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}
