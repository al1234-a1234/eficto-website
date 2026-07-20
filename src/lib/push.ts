import webpush from "web-push";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TableLocation } from "@/lib/types";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return;
  webpush.setVapidDetails("mailto:admin@eficto.online", publicKey, privateKey);
  configured = true;
}

/**
 * Recomputes queue positions for a location and pushes a notification only to customers
 * whose position actually changed since the last time we notified them — so an unrelated
 * status change elsewhere doesn't re-spam everyone still waiting.
 */
export async function notifyLocationPositions(supabase: SupabaseClient, location: TableLocation) {
  ensureConfigured();
  if (!configured) return;

  const { data: rows } = await supabase
    .from("eficto_waitlist")
    .select("id, party_size, last_notified_position")
    .eq("status", "waiting")
    .eq("location", location)
    .order("joined_at", { ascending: true });

  if (!rows || rows.length === 0) return;

  const changed = rows
    .map((row, index) => ({ ...row, position: index + 1 }))
    .filter((row) => row.position !== row.last_notified_position);

  if (changed.length === 0) return;

  const { data: subscriptions } = await supabase
    .from("eficto_push_subscriptions")
    .select("id, waitlist_id, endpoint, p256dh, auth")
    .in(
      "waitlist_id",
      changed.map((row) => row.id)
    );

  const subsByWaitlistId = new Map<string, typeof subscriptions>();
  for (const sub of subscriptions ?? []) {
    const list = subsByWaitlistId.get(sub.waitlist_id) ?? [];
    list.push(sub);
    subsByWaitlistId.set(sub.waitlist_id, list);
  }

  await Promise.all(
    changed.map(async (row) => {
      await supabase.from("eficto_waitlist").update({ last_notified_position: row.position }).eq("id", row.id);

      const subs = subsByWaitlistId.get(row.id) ?? [];
      const payload = JSON.stringify({
        title: `دورك الآن رقم ${row.position}`,
        body: row.position === 1 ? "أنت التالي — استعد للحضور" : `باقي ${row.position - 1} قبلك`,
      });

      await Promise.all(
        subs.map(async (sub) => {
          try {
            await webpush.sendNotification(
              { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
              payload
            );
          } catch (err) {
            const statusCode = (err as { statusCode?: number }).statusCode;
            if (statusCode === 404 || statusCode === 410) {
              await supabase.from("eficto_push_subscriptions").delete().eq("id", sub.id);
            }
          }
        })
      );
    })
  );
}
