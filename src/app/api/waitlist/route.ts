import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { upsertCustomer } from "@/lib/reservationLogic";
import { isValidPartySize, isValidSaudiPhone, normalizePhone } from "@/lib/validate";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });

  const { full_name, phone, party_size } = body as Record<string, unknown>;

  if (
    typeof full_name !== "string" ||
    full_name.trim().length < 2 ||
    typeof phone !== "string" ||
    !isValidSaudiPhone(phone) ||
    typeof party_size !== "number" ||
    !isValidPartySize(party_size)
  ) {
    return NextResponse.json({ error: "الرجاء التحقق من البيانات" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
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
      .insert({ customer_id: customerId, party_size, status: "waiting" })
      .select("id, party_size, status, joined_at")
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
