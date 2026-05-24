import Link from "next/link";
import { notFound } from "next/navigation";

import { CloudinaryImage } from "@/components/shared/CloudinaryImage";
import { PageShell, createPageMetadata } from "@/components/shared/PageShell";
import { getPublishedBlogPostBySlug } from "@/lib/data/content";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) {
    return createPageMetadata("Novinka nenalezena", "Požadovaný článek neexistuje.");
  }
  return createPageMetadata(
    post.seo_title || post.title,
    post.seo_description || post.excerpt || post.title,
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <PageShell title={post.title}>
      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <time dateTime={post.published_at ?? post.created_at}>
          {new Date(post.published_at ?? post.created_at).toLocaleDateString("cs-CZ", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
        <span aria-hidden="true">·</span>
        <Link href="/novinky" className="text-sage hover:underline">
          ← Všechny novinky
        </Link>
      </div>

      {post.cover_image_url ? (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
          <CloudinaryImage
            src={post.cover_image_url}
            alt=""
            fill
            width={1200}
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      {post.excerpt ? (
        <p className="mt-8 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
      ) : null}

      <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-wrap leading-relaxed">
        {post.content}
      </div>
    </PageShell>
  );
}
