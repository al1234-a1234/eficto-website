import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// eficto.app is the simple link-hub domain — customers land here only to pick a
// link (Requeue, menu, Instagram...), so its homepage is /links, not the full
// Supabase-backed site.
const LINKS_ONLY_HOSTS = ["eficto.app"];

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const isLinksOnlyHost = LINKS_ONLY_HOSTS.some((h) => host === h || host.startsWith(`${h}:`));

  if (request.nextUrl.pathname === "/") {
    if (isLinksOnlyHost) {
      return NextResponse.rewrite(new URL("/links", request.url));
    }
    return NextResponse.next();
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*", "/"],
};
