import { PageShell, createPageMetadata } from "@/components/shared/PageShell";

export const metadata = createPageMetadata(
  "Kategorie",
  "Prohlédněte si produkty podle kategorií — mýdla, šampony, masti a elixíry.",
);

export default function CategoriesPage() {
  return (
    <PageShell
      title="Kategorie produktů"
      description="Vyberte si z našich kategorií bylinných produktů."
    />
  );
}
