import { createClient } from "@/lib/supabase/server";
import { CustomerSearch } from "@/components/admin/CustomerSearch";

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const [{ data }, { data: allVisitCounts }] = await Promise.all([
    supabase.from("eficto_customers").select("*").order("visit_count", { ascending: false }).limit(1000),
    supabase.from("eficto_customers").select("visit_count").limit(5000),
  ]);

  const counts = (allVisitCounts ?? []).map((c) => c.visit_count ?? 0);
  const totalCustomers = counts.length;
  const repeatCustomers = counts.filter((c) => c >= 2).length;
  const vipCustomers = counts.filter((c) => c >= 5).length;
  const avgVisits = totalCustomers > 0 ? counts.reduce((sum, c) => sum + c, 0) / totalCustomers : 0;
  const repeatRate = totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;

  return (
    <div>
      <h1 className="font-arabic-display text-3xl text-eficto-green-dark">العملاء</h1>
      <p className="mt-1 text-sm text-eficto-green-dark/60">ملف كامل لكل عميل — عدد الزيارات، آخر زيارة، وملاحظات</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="border-t-4 border-eficto-gold p-5">
            <p className="text-xs text-eficto-green-dark/60">إجمالي العملاء</p>
            <p className="mt-1.5 font-arabic-display text-3xl text-eficto-green">{totalCustomers}</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="border-t-4 border-eficto-gold p-5">
            <p className="text-xs text-eficto-green-dark/60">نسبة العملاء المتكررين</p>
            <p className="mt-1.5 font-arabic-display text-3xl text-eficto-green">{repeatRate}%</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="border-t-4 border-eficto-gold p-5">
            <p className="text-xs text-eficto-green-dark/60">متوسط الزيارات لكل عميل</p>
            <p className="mt-1.5 font-arabic-display text-3xl text-eficto-green">{avgVisits.toFixed(1)}</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="border-t-4 border-eficto-gold p-5">
            <p className="text-xs text-eficto-green-dark/60">عملاء VIP (٥+ زيارات)</p>
            <p className="mt-1.5 font-arabic-display text-3xl text-eficto-green">{vipCustomers}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <CustomerSearch initialCustomers={data ?? []} />
      </div>
    </div>
  );
}
