import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SiteSettingsForm } from "@/components/admin/ContentForms";
import { getAdminSiteSettings } from "@/lib/data/admin";

export default async function AdminSettingsPage() {
  const settings = await getAdminSiteSettings();
  if (!settings) {
    return (
      <>
        <AdminPageHeader title="Nastavení obchodu" />
        <p className="text-sm text-muted-foreground">
          Nastavení obchodu nebylo nalezeno. Spusťte seed.sql.
        </p>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Nastavení obchodu"
        description="Kontakty, doprava, homepage obsah a sociální sítě"
      />
      <SiteSettingsForm settings={settings} />
    </>
  );
}
