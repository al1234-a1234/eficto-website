import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminReportsPage() {
  const supabase = await createClient();

  const [{ data: reservations }, { data: topCustomers }] = await Promise.all([
    supabase.from("eficto_reservations").select("reservation_time, status").limit(2000),
    supabase
      .from("eficto_customers")
      .select("id, full_name, phone, visit_count")
      .order("visit_count", { ascending: false })
      .limit(10),
  ]);

  const all = reservations ?? [];
  const total = all.length;
  const cancelled = all.filter((r) => r.status === "cancelled").length;
  const noShow = all.filter((r) => r.status === "no_show").length;
  const cancellationRate = total > 0 ? Math.round(((cancelled + noShow) / total) * 100) : 0;

  const hourCounts = new Map<number, number>();
  for (const r of all) {
    const hour = new Date(r.reservation_time).getUTCHours();
    hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1);
  }
  const busiestHours = [...hourCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([hour, count]) => {
      const riyadhHour = (hour + 3) % 24;
      return { label: `${riyadhHour.toString().padStart(2, "0")}:00`, count };
    });

  return (
    <div>
      <h1 className="font-arabic-display text-3xl text-eficto-green-dark">التقارير</h1>
      <p className="mt-1 text-sm text-eficto-green-dark/60">مؤشرات سريعة لأداء الحجوزات والعملاء</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-eficto-gold/25 bg-white p-6 shadow-soft">
          <h2 className="font-serif text-lg text-eficto-green-dark">معدل الإلغاء / عدم الحضور</h2>
          <p className="mt-3 font-arabic-display text-4xl text-eficto-green">{cancellationRate}%</p>
          <p className="mt-1 text-xs text-eficto-green-dark/50">
            {cancelled + noShow} من أصل {total} حجز
          </p>
        </div>

        <div className="rounded-2xl border border-eficto-gold/25 bg-white p-6 shadow-soft">
          <h2 className="font-serif text-lg text-eficto-green-dark">أكثر الأوقات ازدحاماً</h2>
          <ul className="mt-3 space-y-2">
            {busiestHours.length === 0 ? (
              <p className="text-sm text-eficto-green-dark/50">لا توجد بيانات كافية</p>
            ) : (
              busiestHours.map((h) => (
                <li key={h.label} className="flex items-center justify-between text-sm">
                  <span dir="ltr">{h.label}</span>
                  <span className="text-eficto-green-dark/60">{h.count} حجز</span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-eficto-gold/25 bg-white p-6 shadow-soft sm:col-span-2">
          <h2 className="font-serif text-lg text-eficto-green-dark">العملاء الأكثر تكراراً (VIP)</h2>
          <ul className="mt-3 divide-y divide-eficto-gold/10">
            {(topCustomers ?? []).length === 0 ? (
              <p className="py-3 text-sm text-eficto-green-dark/50">لا توجد بيانات كافية</p>
            ) : (
              (topCustomers ?? []).map((c) => (
                <li key={c.id} className="flex items-center justify-between py-2.5 text-sm">
                  <Link href={`/admin/customers/${c.id}`} className="text-eficto-green hover:underline">
                    {c.full_name}
                  </Link>
                  <span className="text-eficto-green-dark/60">{c.visit_count} زيارة</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
