import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("eficto_staff_members")
    .select("id, full_name")
    .eq("active", true)
    .order("full_name");

  return NextResponse.json({ members: data ?? [] });
}
