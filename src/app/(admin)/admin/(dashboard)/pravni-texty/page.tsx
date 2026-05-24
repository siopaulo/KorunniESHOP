import { getAdminLegalPages } from "@/lib/data/admin";
import { LegalPageForm } from "@/components/admin/ContentForms";

export default async function AdminLegalPage() {
  const pages = await getAdminLegalPages();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold">Právní texty</h1>
      <p className="text-sm text-amber-800">
        ⚠️ Šablony — finální znění musí schválit právník.
      </p>
      {pages.map((page) => (
        <LegalPageForm key={page.slug} page={page} />
      ))}
    </div>
  );
}
