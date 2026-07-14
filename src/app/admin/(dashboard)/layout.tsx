import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SignOutButton } from "@/components/admin/SignOutButton";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen bg-eficto-ivory">
      <AdminSidebar />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-eficto-gold/20 bg-white/60 px-8 py-4">
          <p className="text-sm text-eficto-green-dark/60">{user?.email}</p>
          <SignOutButton />
        </header>
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
