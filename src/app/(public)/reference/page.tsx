import { PageShell, createPageMetadata } from "@/components/shared/PageShell";
import { StarRating } from "@/components/public/StarRating";
import { Badge } from "@/components/ui/badge";
import { TESTIMONIALS_DISCLAIMER } from "@/lib/legal/default-content";
import { getTestimonials } from "@/lib/data/content";

export const metadata = createPageMetadata(
  "Reference",
  "Co říkají naši zákazníci o bylinných produktech z Korunní.",
);

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  const avg =
    testimonials.length > 0
      ? testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length
      : 0;

  return (
    <PageShell
      title="Reference zákazníků"
      description="Přečtěte si zkušenosti těch, kteří už objevili sílu našich bylin."
    >
      <p className="mt-6 rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
        {TESTIMONIALS_DISCLAIMER}
      </p>

      {testimonials.length === 0 ? (
        <p className="mt-8 text-muted-foreground">Zatím nemáme publikované reference.</p>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-6">
            <div>
              <p className="text-sm text-muted-foreground">Průměrné hodnocení</p>
              <p className="font-display text-3xl font-semibold">{avg.toFixed(1)} / 5</p>
            </div>
            <StarRating value={Math.round(avg)} />
            <p className="text-sm text-muted-foreground">{testimonials.length} referencí</p>
          </div>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item) => (
              <li
                key={item.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-center justify-between gap-2">
                  <StarRating value={item.rating} size="sm" />
                  {"is_verified" in item && item.is_verified ? (
                    <Badge variant="outline" className="text-xs">
                      Ověřený zákazník
                    </Badge>
                  ) : null}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed">
                  &ldquo;{item.content}&rdquo;
                </blockquote>
                <footer className="mt-4 text-sm font-medium text-sage">{item.author_name}</footer>
              </li>
            ))}
          </ul>
        </>
      )}
    </PageShell>
  );
}
