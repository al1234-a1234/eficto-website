import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { countAvailableTables, isLocationFull, toRiyadhISOString } from "@/lib/reservationLogic";
import { isValidLocation, isValidPartySize, isWithinOperatingHours } from "@/lib/validate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const partySize = Number(searchParams.get("party_size"));
  const location = searchParams.get("location");

  if (!date || !time || !isValidPartySize(partySize) || !isValidLocation(location)) {
    return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  }
  if (!isWithinOperatingHours(time)) {
    return NextResponse.json({ available: false, tablesFree: 0, reason: "outside_hours" });
  }

  try {
    const supabase = createAdminClient();
    if (await isLocationFull(supabase, location)) {
      return NextResponse.json({ available: false, tablesFree: 0, reason: "location_full" });
    }
    const reservationTimeISO = toRiyadhISOString(date, time);
    const tablesFree = await countAvailableTables(supabase, reservationTimeISO, partySize, location);
    return NextResponse.json({ available: tablesFree > 0, tablesFree });
  } catch (err) {
    console.error("availability check failed", err);
    return NextResponse.json({ error: "تعذر التحقق من التوفر" }, { status: 500 });
  }
}
