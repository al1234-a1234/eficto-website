import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { findAvailableTable, toRiyadhISOString, upsertCustomer } from "@/lib/reservationLogic";
import { isValidPartySize, isValidSaudiPhone, isWithinOperatingHours, normalizePhone } from "@/lib/validate";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });

  const { full_name, phone, date, time, party_size } = body as Record<string, unknown>;

  if (
    typeof full_name !== "string" ||
    full_name.trim().length < 2 ||
    typeof phone !== "string" ||
    !isValidSaudiPhone(phone) ||
    typeof date !== "string" ||
    typeof time !== "string" ||
    !isWithinOperatingHours(time) ||
    typeof party_size !== "number" ||
    !isValidPartySize(party_size)
  ) {
    return NextResponse.json({ error: "الرجاء التحقق من بيانات الحجز" }, { status: 400 });
  }

  const reservationTimeISO = toRiyadhISOString(date, time);
  if (new Date(reservationTimeISO).getTime() < Date.now() - 5 * 60 * 1000) {
    return NextResponse.json({ error: "لا يمكن الحجز بوقت سابق" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const table = await findAvailableTable(supabase, reservationTimeISO, party_size);

    if (!table) {
      return NextResponse.json(
        { error: "لا توجد طاولات متاحة بهذا الوقت", suggestWaitlist: true },
        { status: 409 }
      );
    }

    const customerId = await upsertCustomer(supabase, full_name.trim(), normalizePhone(phone));

    const { data: reservation, error } = await supabase
      .from("eficto_reservations")
      .insert({
        customer_id: customerId,
        table_id: table.id,
        reservation_time: reservationTimeISO,
        party_size,
        status: "confirmed",
      })
      .select("id, reservation_time, party_size, status")
      .single();

    if (error) throw error;

    return NextResponse.json({ reservation, table }, { status: 201 });
  } catch (err) {
    console.error("reservation creation failed", err);
    return NextResponse.json({ error: "تعذر إتمام الحجز، حاول مرة أخرى" }, { status: 500 });
  }
}
