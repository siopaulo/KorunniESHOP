import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TestimonialForm } from "@/components/admin/ContentForms";
import { getAdminTestimonials } from "@/lib/data/admin";

export default async function AdminTestimonialsPage() {
  const items = await getAdminTestimonials();

  return (
    <>
      <AdminPageHeader
        title="Reference"
        description={`${items.length} referencí zákazníků`}
      />

      <div className="space-y-8">
        <TestimonialForm />
        {items.map((item) => (
          <TestimonialForm key={item.id} item={item as Parameters<typeof TestimonialForm>[0]["item"]} />
        ))}
      </div>
    </>
  );
}
