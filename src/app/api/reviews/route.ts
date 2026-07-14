import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { upsertCustomer } from "@/lib/reservationLogic";
import { isValidSaudiPhone, normalizePhone } from "@/lib/validate";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });

  const { full_name, phone, rating, comment } = body as Record<string, unknown>;

  if (
    typeof full_name !== "string" ||
    full_name.trim().length < 2 ||
    typeof phone !== "string" ||
    !isValidSaudiPhone(phone) ||
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json({ error: "الرجاء التحقق من بيانات التقييم" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const customerId = await upsertCustomer(supabase, full_name.trim(), normalizePhone(phone));

    const { data: review, error } = await supabase
      .from("eficto_reviews")
      .insert({
        customer_id: customerId,
        customer_name: full_name.trim(),
        rating,
        comment: typeof comment === "string" && comment.trim() ? comment.trim() : null,
        review_date: new Date().toISOString().slice(0, 10),
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    console.error("review submission failed", err);
    return NextResponse.json({ error: "تعذر إرسال التقييم، حاول مرة أخرى" }, { status: 500 });
  }
}
