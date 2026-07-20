import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PhotoBackground } from "@/components/PhotoBackground";
import { IMAGES } from "@/lib/assets";
import type { MenuCategory, MenuItem } from "@/lib/types";

export const metadata: Metadata = { title: "قائمة الطعام | افيكتو" };
export const revalidate = 60;

export default async function MenuPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("eficto_menu_categories").select("*").eq("active", true).order("sort_order"),
    supabase.from("eficto_menu_items").select("*").eq("active", true).order("sort_order"),
  ]);

  const sections = (categories ?? []).map((category: MenuCategory) => ({
    category,
    items: (items ?? []).filter((item: MenuItem) => item.category_id === category.id),
  }));

  return (
    <>
      <section className="relative flex h-[42vh] min-h-[280px] items-center justify-center overflow-hidden">
        <PhotoBackground src={IMAGES.interiorArch} alt="أجواء افيكتو" className="absolute inset-0" dim />
        <div className="relative z-10 text-center">
          <p className="font-arabic-body text-sm tracking-[0.25em] text-eficto-gold">افيكتو</p>
          <h1 className="mt-4 font-arabic-display text-5xl text-eficto-cream">قائمة الطعام</h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        {sections.length === 0 ? (
          <p className="rounded-2xl border border-eficto-gold/25 bg-white/60 p-10 text-center text-sm text-eficto-green-dark/60 shadow-premium">
            القائمة قيد التحضير — تابعونا قريباً
          </p>
        ) : (
          <div className="space-y-16">
            {sections.map(({ category, items: categoryItems }) => (
              <div key={category.id}>
                <div className="text-center">
                  <h2 className="font-arabic-display text-3xl text-eficto-green-dark">{category.name_ar}</h2>
                  {category.name_en && (
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-eficto-gold-deep">{category.name_en}</p>
                  )}
                  <div className="mx-auto mt-4 h-px w-16 bg-eficto-gold/50" />
                </div>

                {categoryItems.length === 0 ? (
                  <p className="mt-6 text-center text-sm text-eficto-green-dark/40">قريباً</p>
                ) : (
                  <div className="mt-8 space-y-6">
                    {categoryItems.map((item: MenuItem) => (
                      <div key={item.id} className="flex items-baseline gap-3">
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 font-serif text-lg text-eficto-green-dark">
                            {item.name_ar}
                            {item.is_featured && <span className="text-eficto-gold">★</span>}
                          </p>
                          {item.name_en && <p className="text-xs text-eficto-green-dark/40">{item.name_en}</p>}
                          {item.description_ar && (
                            <p className="mt-1 text-sm leading-6 text-eficto-green-dark/60">{item.description_ar}</p>
                          )}
                        </div>
                        <div className="flex-1 self-end border-b border-dotted border-eficto-gold/40" />
                        <p dir="ltr" className="shrink-0 font-arabic-display text-lg text-eficto-gold-deep">
                          {item.price_sar} ر.س
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
