import { PageShell, createPageMetadata } from "@/components/shared/PageShell";

export const metadata = createPageMetadata(
  "O nás",
  "Příběh značky Korunní Byliny — domácí bylinné produkty z Prahy.",
);

export default function AboutPage() {
  return (
    <PageShell
      title="O nás"
      description="Jsme malá dílna v srdci Korunní, kde tradice potkává moderní péči o tělo."
    />
  );
}
