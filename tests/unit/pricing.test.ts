import { describe, expect, it } from "vitest";

import { calculateDiscount } from "@/lib/pricing";

describe("calculateDiscount", () => {
  it("returns no discount when compare price missing", () => {
    expect(calculateDiscount(199, null)).toEqual({
      hasDiscount: false,
      discountAmount: 0,
      discountPercent: 0,
    });
  });

  it("returns no discount when compare price is lower or equal", () => {
    expect(calculateDiscount(199, 199).hasDiscount).toBe(false);
    expect(calculateDiscount(199, 150).hasDiscount).toBe(false);
  });

  it("calculates discount amount and percent", () => {
    expect(calculateDiscount(199, 229)).toEqual({
      hasDiscount: true,
      discountAmount: 30,
      discountPercent: 13,
    });
  });
});
