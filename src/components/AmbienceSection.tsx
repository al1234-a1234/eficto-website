import Image from "next/image";
import { IMAGES } from "@/lib/assets";

const PILLARS = [
  { title: "الأقواس الخشبية", desc: "خطوط معمارية دافئة مستوحاة من العمارة الإيطالية الكلاسيكية." },
  { title: "الجلد الأخضر الغامق", desc: "مقاعد فاخرة بلمسة هادئة تعانق ضوء الشموع والإضاءة المعلّقة." },
  { title: "الرخام والإضاءة الدافئة", desc: "تفاصيل دقيقة تصنع أجواء راقية تناسب كل مناسبة." },
];

export function AmbienceSection() {
  return (
    <section className="section-fade mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <div className="grid gap-14 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-arabic-body text-sm tracking-[0.2em] text-eficto-gold-deep">من نحن</p>
          <h2 className="mt-3 font-arabic-display text-3xl leading-relaxed text-eficto-green-dark sm:text-4xl">
            أجواء إيطالية أصيلة، بلمسة بريدة
          </h2>
          <p className="mt-5 max-w-lg leading-8 text-eficto-green-dark/75">
            في إفيكتو، صممنا كل تفصيلة لتعكس هدوء الأناقة الإيطالية: من الأقواس الخشبية إلى
            الجلد الأخضر الغامق والرخام الدافئ. نقدّم مأكولات إيطالية أصيلة في مساحة تدعوك
            للبقاء أطول قليلاً.
          </p>

          <div className="mt-10 space-y-6">
            {PILLARS.map((p) => (
              <div key={p.title} className="border-r-2 border-eficto-gold/50 pr-4">
                <h3 className="font-serif text-lg text-eficto-green">{p.title}</h3>
                <p className="mt-1 text-sm leading-7 text-eficto-green-dark/70">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative col-span-2 h-56 overflow-hidden rounded-2xl arch-frame">
            <Image
              src={IMAGES.interiorArch}
              alt="أجواء إفيكتو الداخلية"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="relative h-40 overflow-hidden rounded-2xl arch-frame">
            <Image
              src={IMAGES.interiorBooth}
              alt="جلسات إفيكتو"
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="relative h-40 overflow-hidden rounded-2xl arch-frame">
            <Image
              src={IMAGES.floorLogo}
              alt="شعار إفيكتو عند المدخل"
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}
