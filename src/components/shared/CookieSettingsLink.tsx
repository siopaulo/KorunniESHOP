"use client";

import { COOKIE_CONSENT_KEY } from "@/lib/cookie-consent";

/** Otevře cookie lištu smazáním uloženého souhlasu a obnovením stránky. */
export function CookieSettingsLink({ className }: { className?: string }) {
  function openSettings() {
    try {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
    } catch {
      // ignore
    }
    window.location.reload();
  }

  return (
    <button type="button" onClick={openSettings} className={className}>
      Nastavení cookies
    </button>
  );
}
