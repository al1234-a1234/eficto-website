import { NextResponse } from "next/server";
import { STAFF_COOKIE } from "@/lib/staffAuth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(STAFF_COOKIE);
  return res;
}
