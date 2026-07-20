import { createHash, createHmac } from "crypto";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import type { StaffPermissions } from "@/lib/types";

export const STAFF_COOKIE = "eficto_staff_session";

const DEFAULT_PERMISSIONS: StaffPermissions = {
  queue: false,
  customers: false,
  reviews: false,
  reports: false,
};

function sign(staffId: string) {
  return createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY!).update(staffId).digest("hex");
}

export function sessionCookieValue(staffId: string) {
  return `${staffId}.${sign(staffId)}`;
}

export function hashPin(staffId: string, pin: string) {
  return createHash("sha256").update(`${staffId}:${pin}`).digest("hex");
}

export interface StaffSession {
  id: string;
  full_name: string;
  permissions: StaffPermissions;
}

export async function getStaffSession(): Promise<StaffSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(STAFF_COOKIE)?.value;
  if (!raw) return null;

  const dotIndex = raw.indexOf(".");
  if (dotIndex === -1) return null;
  const staffId = raw.slice(0, dotIndex);
  const sig = raw.slice(dotIndex + 1);
  if (sig !== sign(staffId)) return null;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("eficto_staff_members")
    .select("id, full_name, active, eficto_permission_groups(permissions)")
    .eq("id", staffId)
    .maybeSingle();

  if (!data || !data.active) return null;

  const group = data.eficto_permission_groups as unknown as { permissions: StaffPermissions } | null;
  return {
    id: data.id,
    full_name: data.full_name,
    permissions: { ...DEFAULT_PERMISSIONS, ...(group?.permissions ?? {}) },
  };
}
