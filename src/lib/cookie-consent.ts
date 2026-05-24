export const COOKIE_CONSENT_KEY = "korunni-cookie-consent";

export interface CookieConsent {
  essential: true;
  analytics: boolean;
  updatedAt: string;
}

export function parseCookieConsent(raw: string | null): CookieConsent | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CookieConsent;
    if (parsed.essential !== true || typeof parsed.analytics !== "boolean") {
      return null;
    }
    return parsed;
  } catch {
    if (raw === "accepted") {
      return { essential: true, analytics: true, updatedAt: new Date().toISOString() };
    }
    return null;
  }
}

export function serializeCookieConsent(consent: CookieConsent): string {
  return JSON.stringify(consent);
}
