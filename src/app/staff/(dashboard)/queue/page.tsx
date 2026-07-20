import { getStaffSession } from "@/lib/staffAuth";
import { StaffQueueView } from "@/components/staff/StaffQueueView";
import { StaffAccessDenied } from "@/components/staff/StaffAccessDenied";

export default async function StaffQueuePage() {
  const session = await getStaffSession();
  if (!session?.permissions.queue) return <StaffAccessDenied />;

  return (
    <div>
      <h1 className="font-arabic-display text-3xl text-eficto-green-dark">قائمة اليوم</h1>
      <p className="mt-1 text-sm text-eficto-green-dark/60">الحجوزات والانتظار مرتبة حسب الدور — تحدّث تلقائياً</p>
      <StaffQueueView />
    </div>
  );
}
