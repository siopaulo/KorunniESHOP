import { PageShell, createPageMetadata } from "@/components/shared/PageShell";

export const metadata = createPageMetadata(
  "Novinky",
  "Novinky a tipy ze světa bylinné péče.",
);

export default function BlogPage() {
  return (
    <PageShell
      title="Novinky"
      description="Články, tipy a novinky z naší dílny v Korunní."
    />
  );
}
