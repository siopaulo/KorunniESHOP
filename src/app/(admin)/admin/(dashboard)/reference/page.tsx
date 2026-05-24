import { getAdminTestimonials } from "@/lib/data/admin";
import { TestimonialForm } from "@/components/admin/ContentForms";

export default async function AdminTestimonialsPage() {
  const items = await getAdminTestimonials();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold">Reference</h1>
      <TestimonialForm />
      {items.map((item) => (
        <TestimonialForm key={item.id} item={item as Parameters<typeof TestimonialForm>[0]["item"]} />
      ))}
    </div>
  );
}
