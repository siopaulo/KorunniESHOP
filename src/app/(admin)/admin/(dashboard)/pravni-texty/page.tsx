import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LegalPageForm } from "@/components/admin/ContentForms";
import { getAdminLegalPages } from "@/lib/data/admin";

export default async function AdminLegalPage() {
  const pages = await getAdminLegalPages();

  return (
    <>
      <AdminPageHeader
        title="Právní texty"
        description="Obchodní podmínky, GDPR, cookies a reklamační řád"
      />
      <p className="mb-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
        ⚠️ Šablony — finální znění musí schválit právník.
      </p>
      <div className="space-y-8">
        {pages.map((page) => (
          <LegalPageForm key={page.slug} page={page} />
        ))}
      </div>
    </>
  );
}
