import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client for server-only routes (API route handlers).
 * Bypasses RLS — never import this from client components.
 *
 * Next.js patches the global fetch() and caches GET requests by default, even inside
 * route handlers marked force-dynamic — that caching applies underneath supabase-js's own
 * requests too. Without opting every request out here, reads through this client can serve
 * stale (sometimes permanently empty) results instead of the current database state.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false },
      global: { fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }) },
    }
  );
}
