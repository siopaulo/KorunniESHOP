import { getAdminBlogPosts } from "@/lib/data/admin";
import { BlogPostForm } from "@/components/admin/ContentForms";

export default async function AdminBlogPage() {
  const posts = await getAdminBlogPosts();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold">Novinky</h1>
      <BlogPostForm />
      {posts.map((post) => (
        <BlogPostForm key={post.id} post={post as Parameters<typeof BlogPostForm>[0]["post"]} />
      ))}
    </div>
  );
}
