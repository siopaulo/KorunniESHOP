"use client";



import Link from "next/link";
import { useActionState } from "react";

import { createCheckoutAction, type CheckoutActionState } from "@/lib/actions/checkout";
import { useCart } from "@/store/cart";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { Checkbox } from "@/components/ui/checkbox";

import { formatPrice } from "@/lib/utils";



const initialState: CheckoutActionState = {};



interface CheckoutFormProps {

  flatRate?: number;

  freeShippingThreshold?: number;

}



export function CheckoutForm({

  flatRate = 99,

  freeShippingThreshold = 1500,

}: CheckoutFormProps) {
  const { items, subtotal } = useCart();

  const [state, formAction, pending] = useActionState(createCheckoutAction, initialState);



  const sub = subtotal();

  const shipping = sub >= freeShippingThreshold ? 0 : flatRate;

  const total = sub + shipping;



  if (items.length === 0) {

    return (

      <div className="rounded-2xl border border-dashed p-8 text-center">

        <p>Košík je prázdný.</p>

        <Button asChild className="mt-4">

          <Link href="/produkty">Nakupovat</Link>

        </Button>

      </div>

    );

  }



  return (

    <form action={formAction} className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">

      <input

        type="hidden"

        name="items"

        value={JSON.stringify(items.map((i) => ({ productId: i.productId, quantity: i.quantity })))}

      />



      <div className="space-y-6 lg:col-span-2">

        <section className="space-y-4 rounded-2xl border border-border bg-card p-6">

          <h2 className="font-display text-lg font-semibold">Kontakt</h2>

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="space-y-2 sm:col-span-2">

              <Label htmlFor="email">E-mail</Label>

              <Input id="email" name="email" type="email" required />

            </div>

            <div className="space-y-2 sm:col-span-2">

              <Label htmlFor="phone">Telefon</Label>

              <Input id="phone" name="phone" type="tel" required />

            </div>

          </div>

        </section>



        <section className="space-y-4 rounded-2xl border border-border bg-card p-6">

          <h2 className="font-display text-lg font-semibold">Dodací adresa</h2>

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="space-y-2">

              <Label htmlFor="shippingFirstName">Jméno</Label>

              <Input id="shippingFirstName" name="shippingFirstName" required />

            </div>

            <div className="space-y-2">

              <Label htmlFor="shippingLastName">Příjmení</Label>

              <Input id="shippingLastName" name="shippingLastName" required />

            </div>

            <div className="space-y-2 sm:col-span-2">

              <Label htmlFor="shippingStreet">Ulice a číslo</Label>

              <Input id="shippingStreet" name="shippingStreet" required />

            </div>

            <div className="space-y-2">

              <Label htmlFor="shippingCity">Město</Label>

              <Input id="shippingCity" name="shippingCity" required />

            </div>

            <div className="space-y-2">

              <Label htmlFor="shippingZip">PSČ</Label>

              <Input id="shippingZip" name="shippingZip" required />

            </div>

          </div>

        </section>



        <section className="space-y-4 rounded-2xl border border-border bg-card p-6">

          <div className="flex items-center gap-2">

            <Checkbox id="billingSameAsShipping" name="billingSameAsShipping" defaultChecked />

            <Label htmlFor="billingSameAsShipping">Fakturační adresa stejná jako dodací</Label>

          </div>

          <div className="space-y-2">

            <Label htmlFor="customerNote">Poznámka k objednávce</Label>

            <Textarea id="customerNote" name="customerNote" rows={3} />

          </div>

        </section>



        <section className="space-y-3 rounded-2xl border border-border bg-card p-6">

          <div className="flex items-start gap-2">

            <Checkbox id="termsConsent" name="termsConsent" required />

            <Label htmlFor="termsConsent" className="leading-relaxed">

              Souhlasím s{" "}

              <Link href="/obchodni-podminky" className="text-sage underline" target="_blank">

                obchodními podmínkami

              </Link>{" "}

              včetně informací o{" "}

              <Link href="/odstoupeni-od-smlouvy" className="text-sage underline" target="_blank">

                odstoupení od smlouvy

              </Link>{" "}

              a{" "}

              <Link href="/reklamacni-rad" className="text-sage underline" target="_blank">

                reklamačním řádu

              </Link>

              .

            </Label>

          </div>

          <div className="flex items-start gap-2">

            <Checkbox id="gdprConsent" name="gdprConsent" required />

            <Label htmlFor="gdprConsent" className="leading-relaxed">

              Souhlasím se{" "}

              <Link href="/ochrana-osobnich-udaju" className="text-sage underline" target="_blank">

                zpracováním osobních údajů

              </Link>{" "}

              pro vyřízení objednávky.

            </Label>

          </div>

        </section>



        {state.error && (

          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">

            {state.error}

          </p>

        )}

      </div>



      <div className="h-fit rounded-2xl border border-border bg-card p-6">

        <h2 className="font-display text-xl font-semibold">Souhrn objednávky</h2>

        <ul className="mt-4 space-y-2 text-sm">

          {items.map((item) => (

            <li key={item.productId} className="flex justify-between gap-2">

              <span>

                {item.name} × {item.quantity}

              </span>

              <span>{formatPrice(item.price * item.quantity)}</span>

            </li>

          ))}

        </ul>

        <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">

          <div className="flex justify-between">

            <span>Mezisoučet</span>

            <span>{formatPrice(sub)}</span>

          </div>

          <div className="flex justify-between">

            <span>Doprava</span>

            <span>{shipping === 0 ? "Zdarma" : formatPrice(shipping)}</span>

          </div>

          <div className="flex justify-between text-muted-foreground">

            <span>Platba</span>

            <span>Platební karta (Stripe)</span>

          </div>

          <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">

            <span>Celkem k úhradě</span>

            <span>{formatPrice(total)}</span>

          </div>

        </div>

        <Button type="submit" className="mt-6 w-full" size="lg" disabled={pending}>

          {pending ? "Přesměrování na platbu…" : "Objednat a zaplatit"}

        </Button>

        <p className="mt-3 text-xs text-muted-foreground">

          Kliknutím na tlačítko Objednat a zaplatit uzavíráte kupní smlouvu zavazující k platbě. Platba proběhne

          bezpečně přes Stripe.

        </p>

      </div>

    </form>

  );

}

