import { AdminContentContainer } from "@/components/admin/AdminContentContainer";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TestimonialsTable } from "@/components/admin/TestimonialsTable";
import { getAdminTestimonials } from "@/lib/data/admin";

export default async function AdminTestimonialsPage() {
  const items = await getAdminTestimonials();

  return (
    <>
      <AdminPageHeader
        title="Reference"
        description={`${items.length} referencí zákazníků — správa zobrazení na webu`}
      />

      <AdminContentContainer width="wide">
        <TestimonialsTable rows={items as Parameters<typeof TestimonialsTable>[0]["rows"]} />
      </AdminContentContainer>
    </>
  );
}
