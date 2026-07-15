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
      <div className="leading-tight" dir="ltr">
        <Image
          src={wordmark.src}
          width={wordmark.width}
          height={wordmark.height}
          alt="eficto"
          className={`h-6 w-auto ${wordmarkClassName ?? ""}`}
          priority
          unoptimized
        />
        {withArabic && (
          <Image
            src={wordmarkAr.src}
            width={wordmarkAr.width}
            height={wordmarkAr.height}
            alt="افيكتو"
            className="mt-0.5 h-3 w-auto"
            unoptimized
          />
        )}
      </div>
    </div>
  );
}
