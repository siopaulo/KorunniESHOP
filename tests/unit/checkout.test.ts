import { describe, expect, it } from "vitest";

import { calculateShipping, checkoutSchema } from "@/lib/validations/checkout";

describe("calculateShipping", () => {
  const config = { flatRate: 99, freeShippingThreshold: 1500 };

  it("charges flat rate below threshold", () => {
    expect(calculateShipping(500, config)).toBe(99);
  });

  it("is free at or above threshold", () => {
    expect(calculateShipping(1500, config)).toBe(0);
    expect(calculateShipping(2000, config)).toBe(0);
  });
});

describe("checkoutSchema", () => {
  const validBase = {
    email: "test@example.com",
    phone: "+420123456789",
    shippingAddress: {
      firstName: "Jan",
      lastName: "Novák",
      street: "Korunní 1",
      city: "Praha",
      zip: "12000",
      country: "CZ",
    },
    billingSameAsShipping: true,
    termsConsent: true as const,
    gdprConsent: true as const,
    items: [{ productId: "11111111-1111-1111-1111-111111111111", quantity: 1 }],
  };

  it("accepts valid checkout payload", () => {
    const result = checkoutSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it("rejects missing legal consents", () => {
    const result = checkoutSchema.safeParse({
      ...validBase,
      termsConsent: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty cart", () => {
    const result = checkoutSchema.safeParse({ ...validBase, items: [] });
    expect(result.success).toBe(false);
  });
});
