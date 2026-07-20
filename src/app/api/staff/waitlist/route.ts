import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStaffSession } from "@/lib/staffAuth";
import { notifyLocationPositions } from "@/lib/push";

export async function PATCH(request: Request) {
  const session = await getStaffSession();
  if (!session?.permissions.queue) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const id = body && typeof body.id === "string" ? body.id : null;
  const status =
    body && (body.status === "seated" || body.status === "left" || body.status === "completed")
      ? body.status
      : null;
  if (!id || !status) return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });

  const supabase = createAdminClient();

  const { data: entry } = await supabase
    .from("eficto_waitlist")
    .select("id, customer_id, location")
    .eq("id", id)
    .maybeSingle();

  const update: { status: string; seated_at?: string; left_at?: string; completed_at?: string } = { status };
  if (status === "seated") update.seated_at = new Date().toISOString();
  if (status === "left") update.left_at = new Date().toISOString();
  if (status === "completed") update.completed_at = new Date().toISOString();

  const { error } = await supabase.from("eficto_waitlist").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: "تعذر تحديث الحالة" }, { status: 500 });

  if (entry?.location === "indoor" || entry?.location === "outdoor") {
    await notifyLocationPositions(supabase, entry.location);
  }

  if (status === "seated" && entry?.customer_id) {
    const { data: customer } = await supabase
      .from("eficto_customers")
      .select("id, visit_count")
      .eq("id", entry.customer_id)
      .maybeSingle();
    if (customer) {
      await supabase
        .from("eficto_customers")
        .update({ visit_count: (customer.visit_count ?? 0) + 1, last_visit_at: new Date().toISOString() })
        .eq("id", customer.id);
    }
  }

  return NextResponse.json({ ok: true });
}
