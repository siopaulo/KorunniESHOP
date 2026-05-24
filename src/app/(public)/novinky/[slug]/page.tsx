import { PageShell, createPageMetadata } from "@/components/shared/PageShell";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  return createPageMetadata(`Novinka: ${slug}`, `Článek ${slug}.`);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  return <PageShell title={slug} description="Detail novinky / článku." />;
}
