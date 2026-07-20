import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStaffSession } from "@/lib/staffAuth";

const ALLOWED = ["available", "busy", "full"];

export async function POST(request: Request) {
  const session = await getStaffSession();
  if (!session?.permissions.queue) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const status = body && typeof body.status === "string" ? body.status : null;
  if (!status || !ALLOWED.includes(status)) {
    return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("eficto_settings")
    .update({ value: status })
    .eq("key", "homepage_status");

  if (error) return NextResponse.json({ error: "تعذر تحديث الحالة" }, { status: 500 });
  return NextResponse.json({ ok: true, status });
}
