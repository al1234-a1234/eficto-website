import { createClient } from "@/lib/supabase/server";
import { StaffPinSettings } from "@/components/admin/StaffPinSettings";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("eficto_settings")
    .select("value")
    .eq("key", "staff_pin")
    .maybeSingle();

  return (
    <div>
      <h1 className="font-arabic-display text-3xl text-eficto-green-dark">الإعدادات</h1>
      <p className="mt-1 text-sm text-eficto-green-dark/60">إعدادات عامة للوحة التحكم وفريق العمل</p>

      <div className="mt-6 max-w-md">
        <StaffPinSettings initialPin={data?.value ?? ""} />
      </div>
    </div>
  );
}
