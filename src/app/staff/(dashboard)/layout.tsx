import { redirect } from "next/navigation";
import { getStaffSession } from "@/lib/staffAuth";
import { StaffNav } from "@/components/staff/StaffNav";

export default async function StaffDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getStaffSession();
  if (!session) redirect("/staff/login");

  return (
    <div className="min-h-screen bg-eficto-ivory">
      <StaffNav fullName={session.full_name} permissions={session.permissions} />
      <div className="px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-3xl">{children}</div>
      </div>
    </div>
  );
}
