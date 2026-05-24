"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { submitContactAction, type ContactActionResult } from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: ContactActionResult = {};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactAction, initialState);

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) toast.success(state.success);
  }, [state]);

  return (
    <form action={formAction} className="mt-8 max-w-lg space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Jméno</Label>
        <Input id="name" name="name" required autoComplete="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Předmět (volitelné)</Label>
        <Input id="subject" name="subject" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Zpráva</Label>
        <Textarea id="message" name="message" rows={5} required />
      </div>
      <div className="flex items-start gap-2">
        <Checkbox id="gdprConsent" name="gdprConsent" required />
        <Label htmlFor="gdprConsent" className="text-sm leading-relaxed">
          Souhlasím se{" "}
          <Link href="/ochrana-osobnich-udaju" className="text-sage underline">
            zpracováním osobních údajů
          </Link>{" "}
          pro vyřízení dotazu.
        </Label>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Odesílám…" : "Odeslat zprávu"}
      </Button>
    </form>
  );
}
