import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatArabicDate } from "@/lib/format";
import { recallWhatsAppLink } from "@/lib/whatsapp";
import { RECALL_INACTIVITY_DAYS } from "@/lib/analytics";

export default async function AdminRecallPage() {
  const supabase = await createClient();
  const cutoff = new Date(Date.now() - RECALL_INACTIVITY_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data: customers } = await supabase
    .from("eficto_customers")
    .select("id, full_name, phone, visit_count, last_visit_at")
    .not("last_visit_at", "is", null)
    .lt("last_visit_at", cutoff)
    .order("visit_count", { ascending: false });

  return (
    <div>
      <h1 className="font-arabic-display text-3xl text-eficto-green-dark">استرجاع العملاء</h1>
      <p className="mt-1 text-sm text-eficto-green-dark/60">
        عملاء ما زاروا من أكثر من {RECALL_INACTIVITY_DAYS} يوم — رسالة واتساب جاهزة، عدّلها قبل الإرسال إذا حبيت
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
        {(customers ?? []).length === 0 ? (
          <p className="p-8 text-center text-sm text-eficto-green-dark/50">ولا حد — كل العملاء نشيطين 👍</p>
        ) : (
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-eficto-cream/60 text-eficto-green-dark/60">
              <tr>
                <th className="px-5 py-3 text-right font-normal">العميل</th>
                <th className="px-5 py-3 text-right font-normal">الجوال</th>
                <th className="px-5 py-3 text-right font-normal">عدد الزيارات</th>
                <th className="px-5 py-3 text-right font-normal">آخر زيارة</th>
                <th className="px-5 py-3 text-right font-normal">إرسال</th>
              </tr>
            </thead>
            <tbody>
              {(customers ?? []).map((c) => (
                <tr key={c.id} className="border-t border-eficto-gold/10">
                  <td className="px-5 py-3">
                    <Link href={`/admin/customers/${c.id}`} className="text-eficto-green hover:underline">
                      {c.full_name}
                    </Link>
                    {c.visit_count >= 5 && (
                      <span className="mr-2 rounded-full bg-eficto-gold/20 px-2 py-0.5 text-[10px] text-eficto-gold-deep">
                        VIP
                      </span>
                    )}
                  </td>
                  <td dir="ltr" className="px-5 py-3 text-left">{c.phone}</td>
                  <td className="px-5 py-3">{c.visit_count}</td>
                  <td className="px-5 py-3 text-eficto-green-dark/60">
                    {c.last_visit_at ? formatArabicDate(c.last_visit_at) : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <a
                      href={recallWhatsAppLink(c.phone, c.full_name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-[#25D366]/50 px-3 py-1.5 text-xs text-[#128C4A] transition-colors hover:bg-[#25D366]/10"
                    >
                      واتساب
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
