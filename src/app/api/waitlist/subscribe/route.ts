import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const waitlistId = body && typeof body.waitlistId === "string" ? body.waitlistId : null;
  const subscription = body?.subscription;

  if (
    !waitlistId ||
    !subscription ||
    typeof subscription.endpoint !== "string" ||
    typeof subscription.keys?.p256dh !== "string" ||
    typeof subscription.keys?.auth !== "string"
  ) {
    return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("eficto_push_subscriptions").upsert(
    {
      waitlist_id: waitlistId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    { onConflict: "endpoint" }
  );

  if (error) return NextResponse.json({ error: "تعذر حفظ الاشتراك" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
