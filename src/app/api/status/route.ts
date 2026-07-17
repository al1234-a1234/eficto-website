import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("eficto_settings")
    .select("value")
    .eq("key", "homepage_status")
    .maybeSingle();

  return NextResponse.json({ status: data?.value ?? "available" });
}
