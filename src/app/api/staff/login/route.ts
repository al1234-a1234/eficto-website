import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashPin, sessionCookieValue, STAFF_COOKIE } from "@/lib/staffAuth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const staffId = body && typeof body.staffId === "string" ? body.staffId : "";
  const pin = body && typeof body.pin === "string" ? body.pin.trim() : "";
  if (!staffId || !pin) return NextResponse.json({ error: "اختر اسمك وأدخل الرمز" }, { status: 400 });

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("eficto_staff_members")
    .select("id, pin_hash, active")
    .eq("id", staffId)
    .maybeSingle();

  if (!data || !data.active || data.pin_hash !== hashPin(data.id, pin)) {
    return NextResponse.json({ error: "الاسم أو الرمز غير صحيح" }, { status: 401 });
  }

  await supabase.from("eficto_staff_members").update({ last_login_at: new Date().toISOString() }).eq("id", data.id);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(STAFF_COOKIE, sessionCookieValue(data.id), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
