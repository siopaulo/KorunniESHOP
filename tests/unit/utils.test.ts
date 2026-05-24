import { describe, expect, it } from "vitest";

import { loginSchema, productSchema } from "@/lib/validations/schemas";
import { formatPrice, slugify } from "@/lib/utils";

describe("formatPrice", () => {
  it("formats CZK without decimals", () => {
    expect(formatPrice(199)).toMatch(/199\s*Kč|199\s*CZK/);
  });
});

describe("slugify", () => {
  it("normalizes Czech diacritics", () => {
    expect(slugify("Mýdlo s levandulí")).toBe("mydlo-s-levanduli");
  });

  it("trims leading and trailing dashes", () => {
    expect(slugify("--Test--")).toBe("test");
  });
});

describe("loginSchema", () => {
  it("requires valid email and min password length", () => {
    expect(loginSchema.safeParse({ email: "bad", password: "123" }).success).toBe(false);
    expect(
      loginSchema.safeParse({ email: "admin@test.cz", password: "12345678" }).success,
    ).toBe(true);
  });
});

describe("productSchema", () => {
  it("rejects invalid slug", () => {
    const result = productSchema.safeParse({
      categoryId: "11111111-1111-1111-1111-111111111111",
      name: "Test",
      slug: "Invalid Slug",
      price: 100,
    });
    expect(result.success).toBe(false);
  });
});
