import type { Metadata } from "next";
import { BadgeMark } from "@/components/Logo";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "دخول الإدارة | افيكتو",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-eficto-green-dark px-6">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_32%,rgba(215,183,144,0.12)_0%,transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative flex w-full max-w-sm flex-col items-center">
        <div className="relative flex items-center justify-center">
          <div
            className="pointer-events-none absolute inset-0 -m-6 rounded-full bg-eficto-gold/15 blur-2xl"
            aria-hidden="true"
          />
          <BadgeMark className="relative h-32 w-32 drop-shadow-[0_18px_40px_rgba(0,0,0,0.35)]" />
        </div>
        <h1 className="mt-7 font-arabic-display text-2xl text-eficto-cream">لوحة تحكم افيكتو</h1>
        <p className="mt-1 text-sm text-eficto-cream/50">دخول مخصص لفريق العمل</p>
        <div className="mt-10 w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
