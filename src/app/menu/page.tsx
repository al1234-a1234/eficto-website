import type { Metadata } from "next";
import { ArchScene } from "@/components/ArchScene";
import { MENU } from "@/lib/menu";

export const metadata: Metadata = { title: "المنيو | إفيكتو" };

export default function MenuPage() {
  return (
    <>
      <section className="relative flex h-[40vh] min-h-[280px] items-center justify-center overflow-hidden">
        <ArchScene className="absolute inset-0" archCount={5} dim />
        <div className="relative z-10 text-center">
          <p className="font-arabic-body text-sm tracking-[0.2em] text-eficto-gold">إفيكتو</p>
          <h1 className="mt-3 font-arabic-display text-4xl text-eficto-cream">المنيو</h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
        {MENU.map((category) => (
          <div key={category.id} className="mb-16 last:mb-0">
            <h2 className="border-b border-eficto-gold/30 pb-3 font-arabic-display text-2xl text-eficto-green-dark">
              {category.title}
            </h2>
            <div className="mt-6 space-y-6">
              {category.items.map((item) => (
                <div key={item.name} className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="font-serif text-lg text-eficto-green">{item.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-eficto-green-dark/65">{item.desc}</p>
                  </div>
                  <p className="shrink-0 whitespace-nowrap font-arabic-display text-eficto-gold-dark">
                    {item.price} ر.س
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
