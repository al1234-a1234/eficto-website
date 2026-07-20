import { createClient } from "@/lib/supabase/server";
import { LoyaltySettings } from "@/components/admin/LoyaltySettings";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("eficto_settings")
    .select("key, value")
    .in("key", ["loyalty_threshold", "loyalty_reward"]);

  const loyaltyThreshold = data?.find((s) => s.key === "loyalty_threshold")?.value ?? "8";
  const loyaltyReward = data?.find((s) => s.key === "loyalty_reward")?.value ?? "مكافأة خاصة";

  return (
    <div>
      <h1 className="font-arabic-display text-3xl text-eficto-green-dark">الإعدادات</h1>
      <p className="mt-1 text-sm text-eficto-green-dark/60">
        إعدادات عامة للوحة التحكم — أعضاء الطاقم وأدوار الصلاحيات صارت من صفحة{" "}
        <a href="/admin/team" className="text-eficto-green hover:underline">الفريق</a>
      </p>

      <div className="mt-6 max-w-md space-y-5">
        <LoyaltySettings initialThreshold={loyaltyThreshold} initialReward={loyaltyReward} />
      </div>
    </div>
  );
}
