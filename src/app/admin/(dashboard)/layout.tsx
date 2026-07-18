import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SignOutButton } from "@/components/admin/SignOutButton";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  // Middleware already verified the session with Supabase's auth server (a real network
  // round trip) before this layout even runs. getSession() here just decodes the cookie
  // locally for the email display — no second round trip on every single navigation.
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

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
