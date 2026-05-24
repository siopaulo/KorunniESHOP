export interface CartLineInput {
  price: number;
  quantity: number;
  stockQuantity?: number;
}

export function cartSubtotal(items: Pick<CartLineInput, "price" | "quantity">[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function cartTotalItems(items: Pick<CartLineInput, "quantity">[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/** Omezení množství na sklad při přidání do košíku. */
export function clampCartQuantity(
  currentQuantity: number,
  addQuantity: number,
  stockQuantity: number,
): number {
  return Math.min(currentQuantity + addQuantity, stockQuantity);
}

/** Aktualizace množství — 0 nebo méně znamená odebrání řádku. */
export function resolveCartQuantityUpdate(
  quantity: number,
  stockQuantity: number,
): number | null {
  if (quantity <= 0) return null;
  return Math.min(quantity, stockQuantity);
}
