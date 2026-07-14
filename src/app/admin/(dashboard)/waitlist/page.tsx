import { createClient } from "@/lib/supabase/server";
import { WaitlistManager, type WaitlistRow } from "@/components/admin/WaitlistManager";

export default async function AdminWaitlistPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("eficto_waitlist")
    .select("id, party_size, location, status, joined_at, eficto_customers(full_name, phone)")
    .eq("status", "waiting")
    .order("joined_at", { ascending: true });

  return (
    <div>
      <h1 className="font-arabic-display text-3xl text-eficto-green-dark">قائمة الانتظار</h1>
      <p className="mt-1 text-sm text-eficto-green-dark/60">تحديث لحظي — انقل العميل إلى &quot;جالس&quot; عند توفر طاولة</p>
      <WaitlistManager initialRows={(data ?? []) as unknown as WaitlistRow[]} />
    </div>
  );
}
