import { createClient } from "@/lib/supabase/server";
import { CustomerSearch } from "@/components/admin/CustomerSearch";

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("eficto_customers")
    .select("*")
    .order("visit_count", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="font-arabic-display text-3xl text-eficto-green-dark">العملاء</h1>
      <p className="mt-1 text-sm text-eficto-green-dark/60">ملف كامل لكل عميل — عدد الزيارات، آخر زيارة، وملاحظات</p>
      <div className="mt-6">
        <CustomerSearch initialCustomers={data ?? []} />
      </div>
    </div>
  );
}
