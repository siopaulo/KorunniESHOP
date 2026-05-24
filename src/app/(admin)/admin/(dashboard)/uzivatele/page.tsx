import { getAdminUsers } from "@/lib/data/admin";
import { updateAdminUserRoleAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import type { AdminRole } from "@/types/database";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Uživatelé a role</h1>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
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
              <tr key={user.id} className="border-b border-border/60">
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
    </div>
  );
}
