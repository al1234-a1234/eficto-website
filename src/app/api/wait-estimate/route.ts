import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeWaitEstimateMinutes } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAdminClient();
  const minutes = await computeWaitEstimateMinutes(supabase);
  return NextResponse.json({ minutes });
}
