import Image from "next/image";
import { LOGO } from "@/lib/assets";

type Variant = "white" | "green";

const ICON = { white: LOGO.iconWhite, green: LOGO.iconGreen };
const WORDMARK_EN = { white: LOGO.wordmarkEnWhite, green: LOGO.wordmarkEnGreen };
const WORDMARK_AR = { white: LOGO.wordmarkArWhite, green: LOGO.wordmarkArGreen };

type LogoMarkProps = {
  className?: string;
  variant?: Variant;
};

/** The real eficto shell mark, extracted from the brand's own logo files. */
export function LogoMark({ className, variant = "white" }: LogoMarkProps) {
  const icon = ICON[variant];
  return (
    <Image
      src={icon.src}
      width={icon.width}
      height={icon.height}
      alt="eficto"
      className={`h-9 w-auto ${className ?? ""}`}
      priority
      unoptimized
    />
  );
}

/** The circular gold-ring "eficto" badge — the brand's own app-icon / profile mark. */
export function BadgeMark({ className }: { className?: string }) {
  return (
    <Image
      src={LOGO.badgeCircle.src}
      width={LOGO.badgeCircle.width}
      height={LOGO.badgeCircle.height}
      alt="eficto"
      className={`h-9 w-auto ${className ?? ""}`}
      priority
      unoptimized
    />
  );
}

type LogoProps = {
  className?: string;
  variant?: Variant;
  wordmarkClassName?: string;
  withArabic?: boolean;
};

export function Logo({ className, variant = "white", wordmarkClassName, withArabic = true }: LogoProps) {
  const wordmark = WORDMARK_EN[variant];
  const wordmarkAr = WORDMARK_AR[variant];

  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <LogoMark variant={variant} className="h-9" />
      <div className={`h-8 w-px ${variant === "white" ? "bg-eficto-cream/15" : "bg-eficto-green-dark/15"}`} />
      <div className="flex flex-col items-center leading-tight">
        <Image
          src={wordmark.src}
          width={wordmark.width}
          height={wordmark.height}
          alt="eficto"
          className={`h-auto w-14 ${wordmarkClassName ?? ""}`}
          priority
          unoptimized
        />
        {withArabic && (
          <>
            <div
              className={`my-0.5 h-px w-10 ${variant === "white" ? "bg-eficto-gold/40" : "bg-eficto-gold-dark/30"}`}
            />
            <Image
              src={wordmarkAr.src}
              width={wordmarkAr.width}
              height={wordmarkAr.height}
              alt="افيكتو"
              className="h-auto w-14"
              unoptimized
            />
          </>
        )}
      </div>
    </div>
  );
}
