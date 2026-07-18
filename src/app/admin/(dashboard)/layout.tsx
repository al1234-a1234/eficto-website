import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SignOutButton } from "@/components/admin/SignOutButton";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-eficto-ivory lg:flex-row">
      <AdminSidebar />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-eficto-gold/20 bg-white/60 px-5 py-4 sm:px-8">
          <p dir="ltr" className="truncate text-xs text-eficto-green-dark/60 sm:text-sm">
            {user?.email}
          </p>
          <SignOutButton />
        </header>
        <main className="px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
