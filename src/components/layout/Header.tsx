import Link from "next/link";
import { Leaf, Menu, ShoppingBag } from "lucide-react";

import { siteConfig, navLinks } from "@/config/site";
import { Button } from "@/components/ui/button";
import { CartLink, CartBadge } from "@/components/shop/CartBadge";
import { MobileNav } from "@/components/layout/MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Přeskočit na obsah
      </a>
      <div className="container-wide flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <Leaf
            className="h-6 w-6 text-sage transition-colors group-hover:text-moss"
            aria-hidden="true"
          />
          <span className="font-display text-xl font-semibold tracking-tight text-charcoal">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Hlavní navigace">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="relative">
            <CartLink aria-label="Košík">
              <ShoppingBag className="h-5 w-5" />
              <CartBadge />
            </CartLink>
          </Button>

          <div className="md:hidden">
            <MobileNav
              trigger={
                <Button variant="ghost" size="icon" aria-label="Otevřít menu">
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
          </div>

          <Button asChild className="hidden sm:inline-flex" size="sm">
            <Link href="/produkty">Nakupovat</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
