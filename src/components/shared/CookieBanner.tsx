"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  COOKIE_CONSENT_KEY,
  parseCookieConsent,
  serializeCookieConsent,
  type CookieConsent,
} from "@/lib/cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    try {
      if (!parseCookieConsent(localStorage.getItem(COOKIE_CONSENT_KEY))) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function saveConsent(consent: CookieConsent) {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, serializeCookieConsent(consent));
    } catch {
      // ignore
    }
    setVisible(false);
  }

  function acceptAll() {
    saveConsent({
      essential: true,
      analytics: true,
      updatedAt: new Date().toISOString(),
    });
  }

  function acceptEssentialOnly() {
    saveConsent({
      essential: true,
      analytics: false,
      updatedAt: new Date().toISOString(),
    });
  }

  function saveCustom() {
    saveConsent({
      essential: true,
      analytics,
      updatedAt: new Date().toISOString(),
    });
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Nastavení cookies"
      aria-modal="true"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card p-4 shadow-lg sm:p-5"
    >
      <div className="container-wide space-y-4">
        <p className="text-sm text-muted-foreground">
          Používáme <strong>nezbytné cookies</strong> pro košík a bezpečnost webu.{" "}
          <strong>Analytické cookies</strong> (např. měření návštěvnosti) spouštíme až po
          vašem souhlasu.{" "}
          <Link href="/cookies" className="text-sage underline-offset-2 hover:underline">
            Zásady cookies
          </Link>
        </p>

        {showDetails ? (
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <Checkbox id="cookie-analytics" checked={analytics} onCheckedChange={(v) => setAnalytics(v === true)} />
              <div>
                <Label htmlFor="cookie-analytics" className="font-medium">
                  Analytické cookies
                </Label>
                <p className="text-xs text-muted-foreground">
                  Pomáhají pochopit, jak web používáte (anonymizovaně). Nezbytné cookies nelze
                  vypnout.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <Button size="sm" variant="outline" onClick={() => setShowDetails((v) => !v)}>
            {showDetails ? "Skrýt detail" : "Nastavení"}
          </Button>
          <Button size="sm" variant="outline" onClick={acceptEssentialOnly}>
            Jen nezbytné
          </Button>
          {showDetails ? (
            <Button size="sm" onClick={saveCustom}>
              Uložit volbu
            </Button>
          ) : (
            <Button size="sm" onClick={acceptAll}>
              Přijmout vše
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
