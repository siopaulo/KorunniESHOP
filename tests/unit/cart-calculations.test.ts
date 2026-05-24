import { describe, expect, it } from "vitest";

import {
  cartSubtotal,
  cartTotalItems,
  clampCartQuantity,
  resolveCartQuantityUpdate,
} from "@/lib/cart/calculations";

describe("cart calculations", () => {
  it("counts total items", () => {
    expect(cartTotalItems([{ quantity: 2 }, { quantity: 3 }])).toBe(5);
  });

  it("calculates subtotal", () => {
    expect(
      cartSubtotal([
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 },
      ]),
    ).toBe(250);
  });

  it("clamps quantity to stock when adding", () => {
    expect(clampCartQuantity(2, 3, 4)).toBe(4);
    expect(clampCartQuantity(2, 5, 4)).toBe(4);
  });

  it("returns null when quantity update removes line", () => {
    expect(resolveCartQuantityUpdate(0, 10)).toBeNull();
  });

  it("caps quantity update to stock", () => {
    expect(resolveCartQuantityUpdate(99, 5)).toBe(5);
  });
});
