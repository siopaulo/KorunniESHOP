import { AdminContentContainer } from "@/components/admin/AdminContentContainer";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LegalPageForm } from "@/components/admin/ContentForms";
import { getAdminLegalPages } from "@/lib/data/admin";
import { getDefaultLegalContent, LEGAL_SLUGS, type LegalSlug } from "@/lib/legal/default-content";

export default async function AdminLegalPage() {
  const pages = await getAdminLegalPages();
  const slugs = Object.values(LEGAL_SLUGS);

  const merged = slugs.map((slug) => {
    const existing = pages.find((p) => p.slug === slug);
    const defaults = getDefaultLegalContent(slug as LegalSlug);
    return {
      slug,
      title: existing?.title ?? defaults.title,
      content: existing?.content ?? defaults.content,
    };
  });

  return (
    <>
      <AdminPageHeader
        title="Právní texty"
        description="Obchodní podmínky, GDPR, cookies, reklamace a odstoupení"
      />
      <AdminContentContainer width="wide" className="space-y-8">
        {merged.map((page) => (
          <LegalPageForm key={page.slug} page={page} />
        ))}
      </AdminContentContainer>
    </>
  );
}
