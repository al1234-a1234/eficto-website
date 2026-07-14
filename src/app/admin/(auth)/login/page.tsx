import type { Metadata } from "next";
import { LogoMark } from "@/components/Logo";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "دخول الإدارة | افيكتو" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-eficto-green-dark px-6">
      <div className="flex w-full max-w-sm flex-col items-center">
        <LogoMark className="h-14" />
        <h1 className="mt-6 font-arabic-display text-2xl text-eficto-cream">لوحة تحكم افيكتو</h1>
        <p className="mt-1 text-sm text-eficto-cream/50">دخول مخصص لفريق العمل</p>
        <div className="mt-10 w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
