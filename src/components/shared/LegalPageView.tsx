import { PageShell, createPageMetadata } from "@/components/shared/PageShell";
import { getLegalPageBySlug } from "@/lib/data/content";
import {
  getDefaultLegalContent,
  LEGAL_SLUGS,
  type LegalSlug,
} from "@/lib/legal/default-content";

export type LegalDbSlug = LegalSlug;

interface LegalPageViewProps {
  slug: LegalDbSlug;
  fallbackDescription: string;
}

export function createLegalMetadata(title: string, description: string) {
  return createPageMetadata(title, description);
}

export async function LegalPageView({ slug, fallbackDescription }: LegalPageViewProps) {
  const defaults = getDefaultLegalContent(slug);
  const page = await getLegalPageBySlug(slug);
  const title = page?.title ?? defaults.title;
  const content = page?.content ?? defaults.content;
  const isTemplate =
    !page?.content ||
    page.content.includes("⚠️") ||
    page.content.includes("Šablona") ||
    page.content.length < 200;

  const displayContent = isTemplate ? defaults.content : content;

  return (
    <PageShell title={title} description={fallbackDescription}>
      <div className="mt-8 max-w-none space-y-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="prose prose-neutral max-w-none whitespace-pre-wrap leading-relaxed">
          {displayContent}
        </div>
      </div>
    </PageShell>
  );
}

export { LEGAL_SLUGS };
