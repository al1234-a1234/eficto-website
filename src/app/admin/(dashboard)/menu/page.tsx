import { createClient } from "@/lib/supabase/server";
import { MenuManager } from "@/components/admin/MenuManager";

export default async function AdminMenuPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("eficto_menu_categories").select("*").order("sort_order"),
    supabase.from("eficto_menu_items").select("*").order("sort_order"),
  ]);

  return (
    <div>
      <h1 className="font-arabic-display text-3xl text-eficto-green-dark">قائمة الطعام</h1>
      <p className="mt-1 text-sm text-eficto-green-dark/60">
        الأقسام والأصناف اللي تظهر لعملائك في صفحة القائمة العامة
      </p>

      <MenuManager initialCategories={categories ?? []} initialItems={items ?? []} />
    </div>
  );
}
