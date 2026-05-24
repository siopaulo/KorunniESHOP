import { AdminDashboardLayout } from "@/components/admin/AdminShell";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
