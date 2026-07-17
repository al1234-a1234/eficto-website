import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isLocationFull, upsertCustomer } from "@/lib/reservationLogic";
import {
  isValidPartySize,
  isValidSaudiPhone,
  isValidWaitlistLocation,
  isWithinOperatingHours,
  normalizePhone,
} from "@/lib/validate";

function currentRiyadhTimeString() {
  const riyadhNow = new Date(Date.now() + 3 * 60 * 60 * 1000);
  return `${String(riyadhNow.getUTCHours()).padStart(2, "0")}:${String(riyadhNow.getUTCMinutes()).padStart(2, "0")}`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });

  const { full_name, phone, party_size, location } = body as Record<string, unknown>;

  if (
    typeof full_name !== "string" ||
    full_name.trim().length < 2 ||
    typeof phone !== "string" ||
    !isValidSaudiPhone(phone) ||
    typeof party_size !== "number" ||
    !isValidPartySize(party_size) ||
    !isValidWaitlistLocation(location)
  ) {
    return NextResponse.json({ error: "الرجاء التحقق من البيانات" }, { status: 400 });
  }

  if (!isWithinOperatingHours(currentRiyadhTimeString())) {
    return NextResponse.json({ error: "المطعم مغلق حالياً — ساعات العمل يومياً ٥:٠٠ م — ٢:٣٠ ص" }, { status: 409 });
  }

  try {
    const supabase = createAdminClient();

    const { data: statusRow } = await supabase
      .from("eficto_settings")
      .select("value")
      .eq("key", "homepage_status")
      .maybeSingle();

    if (statusRow?.value === "full") {
      return NextResponse.json(
        { error: "الطاولات ممتلئة حالياً، يرجى الانتظار قليلاً والمحاولة بعد قليل" },
        { status: 409 }
      );
    }

    if (location !== "any" && (await isLocationFull(supabase, location))) {
      return NextResponse.json(
        { error: location === "indoor" ? "الجلسة الداخلية ممتلئة حالياً" : "الجلسة الخارجية ممتلئة حالياً" },
        { status: 409 }
      );
    }

    const normalizedPhone = normalizePhone(phone);

    const { data: alreadyWaiting } = await supabase
      .from("eficto_waitlist")
      .select("id, eficto_customers!inner(phone)")
      .eq("status", "waiting")
      .eq("eficto_customers.phone", normalizedPhone)
      .maybeSingle();

    if (alreadyWaiting) {
      return NextResponse.json({ error: "أنت بالفعل ضمن قائمة الانتظار" }, { status: 409 });
    }

    const customerId = await upsertCustomer(supabase, full_name.trim(), normalizedPhone);

    const { data: entry, error } = await supabase
      .from("eficto_waitlist")
      .insert({ customer_id: customerId, party_size, location, status: "waiting" })
      .select("id, party_size, location, status, joined_at")
      .single();

    if (error) throw error;

    const { count: position } = await supabase
      .from("eficto_waitlist")
      .select("id", { count: "exact", head: true })
      .eq("status", "waiting")
      .lte("joined_at", entry.joined_at);

    return NextResponse.json({ entry, position: position ?? 1 }, { status: 201 });
  } catch (err) {
    console.error("waitlist join failed", err);
    return NextResponse.json({ error: "تعذر الانضمام لقائمة الانتظار" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const id = body && typeof body.id === "string" ? body.id : null;
  if (!id) return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("eficto_waitlist")
      .update({ status: "left" })
      .eq("id", id)
      .eq("status", "waiting");
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("waitlist leave failed", err);
    return NextResponse.json({ error: "تعذر تحديث الحالة" }, { status: 500 });
  }
}
