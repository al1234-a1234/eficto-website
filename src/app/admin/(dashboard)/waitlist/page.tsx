import { createClient } from "@/lib/supabase/server";
import { WaitlistManager, type WaitlistRow } from "@/components/admin/WaitlistManager";
import { LocationStatusToggle } from "@/components/admin/LocationStatusToggle";
import { HomepageStatusControl } from "@/components/admin/HomepageStatusControl";

export default async function AdminWaitlistPage() {
  const supabase = await createClient();
  const [{ data }, { data: locationStatus }] = await Promise.all([
    supabase
      .from("eficto_waitlist")
      .select("id, party_size, location, status, joined_at, eficto_customers(full_name, phone)")
      .eq("status", "waiting")
      .order("joined_at", { ascending: true }),
    supabase.from("eficto_location_status").select("location, is_full").order("location"),
  ]);

  return (
    <div>
      <h1 className="font-arabic-display text-3xl text-eficto-green-dark">قائمة الانتظار</h1>
      <p className="mt-1 text-sm text-eficto-green-dark/60">تحديث لحظي — انقل العميل إلى &quot;جالس&quot; عند توفر طاولة</p>

      <div className="mt-6">
        <HomepageStatusControl />
      </div>

      <div className="mt-6">
        <LocationStatusToggle
          initialStatus={(locationStatus ?? []) as { location: "indoor" | "outdoor"; is_full: boolean }[]}
        />
      </div>

      <WaitlistManager initialRows={(data ?? []) as unknown as WaitlistRow[]} />
    </div>
  );
}
