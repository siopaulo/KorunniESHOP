import { Star } from "lucide-react";

import { PageShell, createPageMetadata } from "@/components/shared/PageShell";
import { getTestimonials } from "@/lib/data/content";

export const metadata = createPageMetadata(
  "Reference",
  "Co říkají naši zákazníci o bylinných produktech z Korunní.",
);

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <PageShell
      title="Reference zákazníků"
      description="Přečtěte si zkušenosti těch, kteří už objevili sílu našich bylin."
    >
      {testimonials.length === 0 ? (
        <p className="mt-8 text-muted-foreground">Zatím nemáme publikované reference.</p>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <li
              key={item.id}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex gap-0.5" aria-label={`Hodnocení ${item.rating} z 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < item.rating ? "fill-sage text-sage" : "text-muted-foreground/30"}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed">&ldquo;{item.content}&rdquo;</blockquote>
              <footer className="mt-4 text-sm font-medium text-sage">{item.author_name}</footer>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
