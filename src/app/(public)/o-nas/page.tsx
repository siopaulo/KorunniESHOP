import { PageShell, createPageMetadata } from "@/components/shared/PageShell";
import { siteConfig } from "@/config/site";
import { getSiteSettings } from "@/lib/data/content";

export const metadata = createPageMetadata(
  "O nás",
  "Příběh značky Korunní Byliny — domácí bylinné produkty z Prahy.",
);

type HomepageContent = {
  heroTitle?: string;
  storyTitle?: string;
  storyBody?: string;
  aboutIntro?: string;
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const content = (settings?.homepage_content ?? {}) as HomepageContent;

  const storyTitle = content.storyTitle ?? "Tradice, která voní bylinkami";
  const intro =
    content.aboutIntro ??
    content.storyBody ??
    siteConfig.description;
  const body =
    content.storyBody ??
    "Jsme malá dílna v srdci Korunní, kde tradice potkává moderní péči o tělo. Každý produkt vzniká ručně, v malých dávkách, z bylin sbíraných s respektem k přírodě a okolí.";

  return (
    <PageShell title="O nás" description={intro}>
      <div className="mt-10 space-y-8">
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold">{storyTitle}</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground whitespace-pre-wrap">{body}</p>
        </section>

        {settings ? (
          <section className="rounded-2xl border border-border bg-muted/30 p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold">Kontakt</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {settings.address ? <li>{settings.address}</li> : null}
              {settings.phone ? <li>{settings.phone}</li> : null}
              {settings.shop_email ? (
                <li>
                  <a href={`mailto:${settings.shop_email}`} className="text-sage hover:underline">
                    {settings.shop_email}
                  </a>
                </li>
              ) : null}
            </ul>
          </section>
        ) : null}
      </div>
    </PageShell>
  );
}
