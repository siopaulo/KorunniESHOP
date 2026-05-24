import { PageShell, createPageMetadata } from "@/components/shared/PageShell";
import { getLegalPageBySlug } from "@/lib/data/content";

const LEGAL_SLUGS = {
  terms: "terms",
  privacy: "privacy",
  cookies: "cookies",
  returns: "returns",
} as const;

export type LegalDbSlug = (typeof LEGAL_SLUGS)[keyof typeof LEGAL_SLUGS];

interface LegalPageViewProps {
  slug: LegalDbSlug;
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackContent: string;
}

export function createLegalMetadata(title: string, description: string) {
  return createPageMetadata(title, description);
}

export async function LegalPageView({
  slug,
  fallbackTitle,
  fallbackDescription,
  fallbackContent,
}: LegalPageViewProps) {
  const page = await getLegalPageBySlug(slug);
  const title = page?.title ?? fallbackTitle;
  const content = page?.content ?? fallbackContent;

  return (
    <PageShell title={title} description={fallbackDescription}>
      <div className="mt-8 max-w-none space-y-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <p className="rounded-lg bg-accent/10 p-4 text-sm font-medium text-earth">
          ⚠️ Tento text je šablona. Finální znění musí schválit právník nebo účetní před
          spuštěním e-shopu.
        </p>
        <div className="prose prose-neutral max-w-none whitespace-pre-wrap leading-relaxed">
          {content}
        </div>
      </div>
    </PageShell>
  );
}

export { LEGAL_SLUGS };
