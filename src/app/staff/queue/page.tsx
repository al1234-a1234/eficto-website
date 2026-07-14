import { redirect } from "next/navigation";
import { isStaffAuthenticated } from "@/lib/staffAuth";
import { StaffQueueView } from "@/components/staff/StaffQueueView";

export default async function StaffQueuePage() {
  if (!(await isStaffAuthenticated())) {
    redirect("/staff/login");
  }

  return (
    <div className="min-h-screen bg-eficto-ivory px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-arabic-display text-3xl text-eficto-green-dark">قائمة اليوم</h1>
        <p className="mt-1 text-sm text-eficto-green-dark/60">الحجوزات والانتظار مرتبة حسب الدور — تحدّث تلقائياً</p>
        <StaffQueueView />
      </div>
    </div>
  );
}
