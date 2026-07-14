type LogoMarkProps = {
  className?: string;
};

/** Abstract concentric-oval mark — echoes the restaurant's arched interior. */
export function LogoMark({ className }: LogoMarkProps) {
  const rings = [
    { rx: 46, ry: 34 },
    { rx: 37, ry: 27 },
    { rx: 28, ry: 20 },
    { rx: 19, ry: 13 },
  ];

  return (
    <svg
      viewBox="0 0 100 72"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {rings.map((r, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="36"
          rx={r.rx}
          ry={r.ry}
          stroke="currentColor"
          strokeWidth="1.4"
        />
      ))}
      <ellipse cx="50" cy="36" rx="4.5" ry="3.2" fill="currentColor" />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  withArabic?: boolean;
};

export function Logo({ className, markClassName, wordmarkClassName, withArabic = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <LogoMark className={`h-9 w-auto ${markClassName ?? ""}`} />
      <div className="leading-tight">
        <div className={`font-serif text-2xl tracking-[0.08em] ${wordmarkClassName ?? ""}`}>
          eficto
        </div>
        {withArabic && (
          <div className="font-arabic-display text-xs tracking-[0.15em] opacity-80">إفيكتو</div>
        )}
      </div>
    </div>
  );
}
