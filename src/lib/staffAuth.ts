import { createHash } from "crypto";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

export const STAFF_COOKIE = "eficto_staff_pin_hash";

export function hashPin(pin: string) {
  return createHash("sha256").update(pin).digest("hex");
}

export async function isStaffAuthenticated() {
  const cookieStore = await cookies();
  const value = cookieStore.get(STAFF_COOKIE)?.value;
  if (!value) return false;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("eficto_settings")
    .select("value")
    .eq("key", "staff_pin")
    .maybeSingle();

  if (!data) return false;
  return hashPin(data.value) === value;
}
