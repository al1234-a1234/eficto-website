import { createClient } from "@/lib/supabase/server";
import { TeamManager } from "@/components/admin/TeamManager";

export default async function AdminTeamPage() {
  const supabase = await createClient();
  const [{ data: groups }, { data: members }] = await Promise.all([
    supabase.from("eficto_permission_groups").select("*").order("created_at"),
    supabase.from("eficto_staff_members").select("*").order("created_at"),
  ]);

  return (
    <div>
      <h1 className="font-arabic-display text-3xl text-eficto-green-dark">الفريق</h1>
      <p className="mt-1 text-sm text-eficto-green-dark/60">
        أدوار الصلاحيات وأعضاء الطاقم اللي يدخلون على /staff برمزهم الشخصي
      </p>

      <TeamManager initialGroups={groups ?? []} initialMembers={members ?? []} />
    </div>
  );
}
