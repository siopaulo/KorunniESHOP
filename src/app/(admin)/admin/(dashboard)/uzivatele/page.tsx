import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { updateAdminUserRoleAction } from "@/lib/actions/admin";
import { getAdminUsers } from "@/lib/data/admin";
import { Button } from "@/components/ui/button";
import type { AdminRole } from "@/types/database";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <>
      <AdminPageHeader
        title="Uživatelé a role"
        description={`${users.length} admin účtů`}
      />

      <ul className="space-y-3 md:hidden">
        {users.map((user) => (
          <li key={user.id} className="rounded-2xl border border-border bg-card p-4">
            <p className="font-medium">{user.full_name || user.email}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="mt-1 text-sm">Role: {user.role}</p>
            <form
              action={async (formData: FormData) => {
                "use server";
                const role = String(formData.get("role")) as AdminRole;
                await updateAdminUserRoleAction(user.id, role);
              }}
              className="mt-3 flex flex-col gap-2 sm:flex-row"
            >
              <select name="role" defaultValue={user.role} className="rounded border px-2 py-2 text-sm">
                <option value="admin">admin</option>
                <option value="editor">editor</option>
                <option value="orders_only">orders_only</option>
              </select>
              <Button type="submit" size="sm" variant="outline">
                Uložit
              </Button>
            </form>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4">E-mail</th>
              <th className="p-4">Jméno</th>
              <th className="p-4">Role</th>
              <th className="p-4">Akce</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border/60 last:border-0">
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.full_name}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">
                  <form
                    action={async (formData: FormData) => {
                      "use server";
                      const role = String(formData.get("role")) as AdminRole;
                      await updateAdminUserRoleAction(user.id, role);
                    }}
                    className="flex gap-2"
                  >
                    <select name="role" defaultValue={user.role} className="rounded border px-2 py-1">
                      <option value="admin">admin</option>
                      <option value="editor">editor</option>
                      <option value="orders_only">orders_only</option>
                    </select>
                    <Button type="submit" size="sm" variant="outline">
                      Uložit
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
