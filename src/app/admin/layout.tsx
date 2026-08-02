import AdminSidebar from "@/components/AdminSidebar";

export const metadata = {
  title: "Admin",
  robots: { noindex: true, nofollow: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminSidebar>{children}</AdminSidebar>;
}
