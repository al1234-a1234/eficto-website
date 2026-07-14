import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashPin, STAFF_COOKIE } from "@/lib/staffAuth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const pin = body && typeof body.pin === "string" ? body.pin.trim() : "";
  if (!pin) return NextResponse.json({ error: "أدخل الرمز" }, { status: 400 });

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("eficto_settings")
    .select("value")
    .eq("key", "staff_pin")
    .maybeSingle();

  if (!data || data.value !== pin) {
    return NextResponse.json({ error: "رمز غير صحيح" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(STAFF_COOKIE, hashPin(pin), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
