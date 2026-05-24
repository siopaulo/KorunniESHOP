import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BlogPostForm } from "@/components/admin/ContentForms";
import { getAdminBlogPosts } from "@/lib/data/admin";

export default async function AdminBlogPage() {
  const posts = await getAdminBlogPosts();

  return (
    <>
      <AdminPageHeader
        title="Novinky"
        description={`${posts.length} článků v administraci`}
      />

      <div className="space-y-8">
        <BlogPostForm />
        {posts.map((post) => (
          <BlogPostForm key={post.id} post={post as Parameters<typeof BlogPostForm>[0]["post"]} />
        ))}
      </div>
    </>
  );
}
