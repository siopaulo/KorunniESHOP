import { getAdminSiteSettings } from "@/lib/data/admin";
import { SiteSettingsForm } from "@/components/admin/ContentForms";

export default async function AdminSettingsPage() {
  const settings = await getAdminSiteSettings();
  if (!settings) {
    return <p>Nastavení obchodu nebylo nalezeno. Spusťte seed.sql.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Nastavení obchodu</h1>
      <SiteSettingsForm settings={settings} />
    </div>
  );
}
