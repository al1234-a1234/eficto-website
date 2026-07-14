"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-full border border-eficto-gold/30 px-4 py-2 text-xs text-eficto-cream/70 transition-colors hover:border-eficto-gold hover:text-eficto-gold"
    >
      تسجيل الخروج
    </button>
  );
}
