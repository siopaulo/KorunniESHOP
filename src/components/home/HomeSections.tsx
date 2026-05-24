import Link from "next/link";
import { ArrowRight, Leaf, Sparkles, Heart, Shield } from "lucide-react";

import { categoryPlaceholders, siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/shared/FadeIn";
import type { CategoryRow } from "@/types/database";

type CategoryDisplay = {
  slug: string;
  name: string;
  description: string;
};

const benefits = [
  {
    icon: Leaf,
    title: "100% přírodní",
    description: "Bez parabenů, sulfátů a syntetických vůní",
  },
  {
    icon: Heart,
    title: "Ruční výroba",
    description: "Každý produkt vzniká s péčí v malých dávkách",
  },
  {
    icon: Shield,
    title: "Lokální byliny",
    description: "Suroviny sbírané v okolí Korunní a z ověřených zdrojů",
  },
  {
    icon: Sparkles,
    title: "Prémiová kvalita",
    description: "Tradiční receptury obohacené moderními standardy",
  },
] as const;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden botanical-pattern">
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-background to-sage-light/10" />
      <div className="container-wide relative section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <Badge variant="accent" className="mb-6">
              Domácí výroba z Korunní
            </Badge>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl font-semibold leading-tight text-charcoal md:text-6xl lg:text-7xl">
              Bylinná péče{" "}
              <span className="text-sage">s duší přírody</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {siteConfig.description}
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/produkty">
                  Prohlédnout produkty
                  <ArrowRight className="ml-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/o-nas">Náš příběh</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function CategoriesSection({ categories }: { categories?: CategoryRow[] }) {
  const items: CategoryDisplay[] =
    categories && categories.length > 0
      ? categories.map((c) => ({
          slug: c.slug,
          name: c.name,
          description: c.description,
        }))
      : [...categoryPlaceholders];

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <FadeIn>
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">
              Kategorie produktů
            </h2>
            <p className="mt-3 text-muted-foreground">
              Objevte naši nabídku bylinných produktů pro každodenní péči
            </p>
          </div>
        </FadeIn>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((category, index) => (
            <FadeIn key={category.slug} delay={index * 0.1}>
              <Link href={`/kategorie/${category.slug}`} className="group block">
                <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="aspect-[4/3] bg-gradient-to-br from-sage-light/30 to-earth-light/20" />
                  <CardContent className="p-5">
                    <h3 className="font-display text-xl font-semibold group-hover:text-sage">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  return (
    <section className="section-padding bg-cream">
      <div className="container-wide">
        <FadeIn>
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">
              Proč Korunní Byliny?
            </h2>
          </div>
        </FadeIn>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <FadeIn key={benefit.title} delay={index * 0.1}>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sage/10">
                  <benefit.icon className="h-7 w-7 text-sage" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StorySection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-narrow">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-sage-light/40 to-earth-light/30" />
          </FadeIn>
          <FadeIn delay={0.15}>
            <div>
              <Badge variant="secondary" className="mb-4">
                Příběh z Korunní
              </Badge>
              <h2 className="font-display text-3xl font-semibold md:text-4xl">
                Tradice, která voní bylinkami
              </h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                V srdci pražské Korunní tvoříme produkty, které spojují tradiční bylinkářské
                know-how s moderním přístupem k péči o tělo. Každá šarže vzniká v malém množství,
                s respektem k přírodě a s láskou k detailu.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Naše receptury vycházejí z letitých zkušeností a pečlivě vybraných surovin.
                Věříme, že kvalitní péče nemusí být kompromisem mezi účinností a přírodností.
              </p>
              <Button asChild className="mt-8" variant="outline">
                <Link href="/o-nas">Více o nás</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="section-padding bg-moss text-primary-foreground">
      <div className="container-narrow text-center">
        <FadeIn>
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            Objevte sílu bylin
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Prohlédněte si naši nabídku a dopřejte své pokožce přírodní péči z Korunní.
          </p>
          <Button asChild size="lg" variant="accent" className="mt-8">
            <Link href="/produkty">
              Přejít do obchodu
              <ArrowRight />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
