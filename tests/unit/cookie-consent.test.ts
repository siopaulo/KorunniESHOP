import { describe, expect, it } from "vitest";

import {
  COOKIE_CONSENT_KEY,
  parseCookieConsent,
  serializeCookieConsent,
} from "@/lib/cookie-consent";

describe("cookie consent", () => {
  it("parses structured consent", () => {
    const raw = serializeCookieConsent({
      essential: true,
      analytics: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    expect(parseCookieConsent(raw)).toEqual({
      essential: true,
      analytics: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
  });

  it("migrates legacy accepted value", () => {
    const parsed = parseCookieConsent("accepted");
    expect(parsed?.essential).toBe(true);
    expect(parsed?.analytics).toBe(true);
  });

  it("returns null for missing consent", () => {
    expect(parseCookieConsent(null)).toBeNull();
  });

  it("uses stable storage key", () => {
    expect(COOKIE_CONSENT_KEY).toBe("korunni-cookie-consent");
  });
});
