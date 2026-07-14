import Image from "next/image";

type Variant = "white" | "green";

const ICON = {
  white: { src: "/logo/icon-white.png", width: 508, height: 335 },
  green: { src: "/logo/icon-green.png", width: 496, height: 325 },
};

const WORDMARK_EN = {
  white: { src: "/logo/wordmark-en-white.png", width: 879, height: 555 },
  green: { src: "/logo/wordmark-en-green.png", width: 721, height: 288 },
};

const WORDMARK_AR = {
  white: { src: "/logo/wordmark-ar-white.png", width: 344, height: 143 },
  green: { src: "/logo/wordmark-ar-green.png", width: 344, height: 143 },
};

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
      <div className="leading-tight">
        <Image
          src={wordmark.src}
          width={wordmark.width}
          height={wordmark.height}
          alt="eficto"
          className={`h-6 w-auto ${wordmarkClassName ?? ""}`}
          priority
        />
        {withArabic && (
          <Image
            src={wordmarkAr.src}
            width={wordmarkAr.width}
            height={wordmarkAr.height}
            alt="إفيكتو"
            className="mt-0.5 h-3 w-auto opacity-90"
          />
        )}
      </div>
    </div>
  );
}
