import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyLocationPositions } from "@/lib/push";
import { isValidWaitlistLocation } from "@/lib/validate";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const location = body?.location;
  if (!isValidWaitlistLocation(location) || location === "any") {
    return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  }

  const supabase = createAdminClient();
  await notifyLocationPositions(supabase, location);
  return NextResponse.json({ ok: true });
}
