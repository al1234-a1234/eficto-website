import Link from "next/link";
import { MENU } from "@/lib/menu";

export function MenuPreview() {
  const featured = MENU.map((cat) => ({ category: cat.title, item: cat.items[0] }));

  return (
    <section className="section-fade bg-eficto-green py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center">
          <p className="font-arabic-body text-sm tracking-[0.2em] text-eficto-gold">المنيو</p>
          <h2 className="mt-3 font-arabic-display text-3xl text-eficto-cream sm:text-4xl">
            نخبة من أطباقنا
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map(({ category, item }) => (
            <div
              key={category}
              className="rounded-2xl border border-eficto-gold/20 bg-eficto-green-dark/40 p-6 transition-colors duration-300 ease-soft hover:border-eficto-gold/50"
            >
              <p className="text-xs tracking-[0.15em] text-eficto-gold">{category}</p>
              <h3 className="mt-3 font-serif text-lg text-eficto-cream">{item.name}</h3>
              <p className="mt-2 text-sm leading-6 text-eficto-cream/65">{item.desc}</p>
              <p className="mt-4 font-arabic-display text-eficto-gold">{item.price} ر.س</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/menu"
            className="rounded-full border border-eficto-gold px-8 py-3 text-sm text-eficto-gold transition-colors duration-300 ease-soft hover:bg-eficto-gold hover:text-eficto-green-dark"
          >
            عرض المنيو كاملاً
          </Link>
        </div>
      </div>
    </section>
  );
}
