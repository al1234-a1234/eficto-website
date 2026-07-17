import { InstagramIcon } from "./icons";
import { SITE } from "@/lib/constants";

export function InstagramSection() {
  return (
    <section className="section-fade bg-eficto-green-dark py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="افيكتو على انستقرام"
          className="flex h-24 w-24 items-center justify-center rounded-full border border-eficto-gold/40 shadow-premium transition-all duration-300 ease-soft hover:scale-105 hover:border-eficto-gold hover:shadow-elegant active:scale-[0.97]"
        >
          <InstagramIcon className="h-9 w-9 text-eficto-gold" />
        </a>
      </div>
    </section>
  );
}
