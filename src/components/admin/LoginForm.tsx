"use client";

import { useActionState } from "react";
import { Leaf } from "lucide-react";

import { loginAction, type AuthActionState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="admin@korunni-byliny.cz"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Heslo</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
        />
      </div>
      {state.error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Přihlašování…" : "Přihlásit se"}
      </Button>
    </form>
  );
}

export function LoginBranding() {
  return (
    <div className="mb-8 text-center">
      <Leaf className="mx-auto h-10 w-10 text-sage" aria-hidden="true" />
      <h1 className="mt-4 font-display text-2xl font-semibold">Administrace</h1>
      <p className="mt-2 text-sm text-muted-foreground">Korunní Byliny — přihlášení</p>
    </div>
  );
}
