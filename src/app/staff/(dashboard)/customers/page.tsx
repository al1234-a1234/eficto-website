import { getStaffSession } from "@/lib/staffAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import { StaffAccessDenied } from "@/components/staff/StaffAccessDenied";
import { StaffCustomerSearch } from "@/components/staff/StaffCustomerSearch";

export default async function StaffCustomersPage() {
  const session = await getStaffSession();
  if (!session?.permissions.customers) return <StaffAccessDenied />;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("eficto_customers")
    .select("*")
    .order("visit_count", { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 className="font-arabic-display text-3xl text-eficto-green-dark">العملاء</h1>
      <p className="mt-1 text-sm text-eficto-green-dark/60">عدد الزيارات وآخر زيارة لكل عميل</p>
      <div className="mt-6">
        <StaffCustomerSearch initialCustomers={data ?? []} />
      </div>
    </div>
  );
}
