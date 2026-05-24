export const siteConfig = {
  name: "Korunní Byliny",
  tagline: "Domácí bylinné produkty z srdce Korunní",
  description:
    "Ručně vyráběné bylinné mýdla, šampony, mastičky a elixíry z lokálních bylin. Přírodní péče s láskou z Korunní.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "cs_CZ",
  currency: "CZK",
  contact: {
    email: "info@korunni-byliny.cz",
    phone: "+420 123 456 789",
    address: "Korunní, Praha",
  },
  social: {
    instagram: "https://instagram.com/korunni-byliny",
    facebook: "https://facebook.com/korunni-byliny",
  },
} as const;

export const navLinks = [
  { href: "/produkty", label: "Produkty" },
  { href: "/kategorie", label: "Kategorie" },
  { href: "/novinky", label: "Novinky" },
  { href: "/reference", label: "Reference" },
  { href: "/o-nas", label: "O nás" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export const footerLinks = {
  shop: [
    { href: "/produkty", label: "Všechny produkty" },
    { href: "/kategorie", label: "Kategorie" },
    { href: "/novinky", label: "Novinky" },
  ],
  company: [
    { href: "/o-nas", label: "O nás" },
    { href: "/reference", label: "Reference" },
    { href: "/kontakt", label: "Kontakt" },
  ],
  legal: [
    { href: "/obchodni-podminky", label: "Obchodní podmínky" },
    { href: "/ochrana-osobnich-udaju", label: "Ochrana osobních údajů" },
    { href: "/cookies", label: "Cookies" },
    { href: "/reklamacni-rad", label: "Reklamační řád" },
    { href: "/odstoupeni-od-smlouvy", label: "Odstoupení od smlouvy" },
  ],
} as const;

export const categoryPlaceholders = [
  {
    slug: "mydla",
    name: "Bylinná mýdla",
    description: "Ručně míchaná mýdla z přírodních olejí a bylin",
  },
  {
    slug: "sampony",
    name: "Bylinné šampony",
    description: "Šetrná péče o vlasy bez chemie",
  },
  {
    slug: "masticky",
    name: "Masti a balzámy",
    description: "Koncentrovaná síla bylin pro pokožku",
  },
  {
    slug: "elixiry",
    name: "Elixíry",
    description: "Bylinné kapky a tinktury pro vnitřní i vnější použití",
  },
] as const;
