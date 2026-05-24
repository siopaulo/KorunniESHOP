import { PageShell, createPageMetadata } from "@/components/shared/PageShell";

export const metadata = createPageMetadata(
  "Reference",
  "Co říkají naši zákazníci o bylinných produktech z Korunní.",
);

export default function TestimonialsPage() {
  return (
    <PageShell
      title="Reference zákazníků"
      description="Přečtěte si zkušenosti těch, kteří už objevili sílu našich bylin."
    />
  );
}
