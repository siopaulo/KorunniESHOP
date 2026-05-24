import { z } from "zod";

import { addressSchema } from "@/lib/validations/schemas";

export const checkoutItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
});

export const checkoutSchema = z.object({
  email: z.string().email("Neplatný e-mail"),
  phone: z.string().min(9, "Telefon je povinný").max(20),
  shippingAddress: addressSchema,
  billingSameAsShipping: z.boolean().default(true),
  billingAddress: addressSchema.optional(),
  customerNote: z.string().max(500).optional(),
  termsConsent: z.literal(true, {
    errorMap: () => ({ message: "Musíte souhlasit s obchodními podmínkami" }),
  }),
  gdprConsent: z.literal(true, {
    errorMap: () => ({ message: "Musíte souhlasit se zpracováním údajů" }),
  }),
  items: z.array(checkoutItemSchema).min(1, "Košík je prázdný"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export interface ShippingConfig {
  flatRate: number;
  freeShippingThreshold: number;
}

export function calculateShipping(
  subtotal: number,
  config: ShippingConfig,
): number {
  if (subtotal >= config.freeShippingThreshold) return 0;
  return config.flatRate;
}
