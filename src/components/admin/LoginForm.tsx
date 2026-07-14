"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setStatus("error");
      setError("بيانات الدخول غير صحيحة");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
      <div>
        <label className="mb-1.5 block text-sm text-eficto-cream/80">البريد الإلكتروني</label>
        <input
          name="email"
          type="email"
          dir="ltr"
          required
          className="w-full rounded-xl border border-eficto-gold/40 bg-eficto-green-dark/40 px-4 py-3 text-eficto-cream outline-none transition-colors focus:border-eficto-gold"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-eficto-cream/80">كلمة المرور</label>
        <input
          name="password"
          type="password"
          dir="ltr"
          required
          className="w-full rounded-xl border border-eficto-gold/40 bg-eficto-green-dark/40 px-4 py-3 text-eficto-cream outline-none transition-colors focus:border-eficto-gold"
        />
      </div>

      {status === "error" && <p className="text-sm text-red-300">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-eficto-gold py-3.5 text-sm font-medium text-eficto-green-dark transition-transform duration-300 ease-soft hover:scale-[1.01] disabled:opacity-60"
      >
        {status === "submitting" ? "جاري الدخول…" : "تسجيل الدخول"}
      </button>
    </form>
  );
}
