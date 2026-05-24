import Link from "next/link";

import { PageShell, createPageMetadata } from "@/components/shared/PageShell";
import { getPublishedBlogPosts } from "@/lib/data/content";

export const metadata = createPageMetadata(
  "Novinky",
  "Novinky a tipy ze světa bylinné péče.",
);

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <PageShell
      title="Novinky"
      description="Články, tipy a novinky z naší dílny v Korunní."
    >
      {posts.length === 0 ? (
        <p className="mt-8 text-muted-foreground">Zatím žádné publikované články.</p>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/novinky/${post.slug}`}
                className="block rounded-2xl border border-border bg-card p-6 transition-colors hover:border-sage/40"
              >
                <time
                  dateTime={post.published_at ?? post.created_at}
                  className="text-xs text-muted-foreground"
                >
                  {new Date(post.published_at ?? post.created_at).toLocaleDateString("cs-CZ")}
                </time>
                <h2 className="mt-2 font-display text-xl font-semibold">{post.title}</h2>
                {post.excerpt ? (
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                ) : null}
                <span className="mt-4 inline-block text-sm font-medium text-sage">Číst dál →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
