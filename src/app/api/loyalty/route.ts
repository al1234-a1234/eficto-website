import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidSaudiPhone, normalizePhone } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const phone = new URL(request.url).searchParams.get("phone");
  if (!phone || !isValidSaudiPhone(phone)) {
    return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const [{ data: customer }, { data: settings }] = await Promise.all([
    supabase.from("eficto_customers").select("visit_count").eq("phone", normalizePhone(phone)).maybeSingle(),
    supabase.from("eficto_settings").select("key, value").in("key", ["loyalty_threshold", "loyalty_reward"]),
  ]);

  const threshold = Number(settings?.find((s) => s.key === "loyalty_threshold")?.value ?? "8") || 8;
  const reward = settings?.find((s) => s.key === "loyalty_reward")?.value ?? "مكافأة خاصة";
  const visits = customer?.visit_count ?? 0;
  const visitsIntoCycle = visits % threshold;
  const earned = visits > 0 && visitsIntoCycle === 0;
  const untilReward = earned ? threshold : threshold - visitsIntoCycle;

  return NextResponse.json({ visits, threshold, reward, untilReward, earned });
}
