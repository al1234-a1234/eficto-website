type ArchSceneProps = {
  className?: string;
  archCount?: number;
  dim?: boolean;
};

/**
 * Abstract stand-in for the restaurant's real interior photography: repeated
 * arches, warm pendant-light pools and a fine marble grain. Swap for actual
 * photos in /public/images once available — see README.
 */
export function ArchScene({ className, archCount = 5, dim = false }: ArchSceneProps) {
  const arches = Array.from({ length: archCount });

  return (
    <div className={`overflow-hidden bg-eficto-green-dark ${className ?? ""}`}>
      <div className="relative h-full w-full">
        <div className="absolute inset-0 flex">
          {arches.map((_, i) => (
            <div key={i} className="relative h-full flex-1 border-x border-eficto-gold/10">
              <div
                className="absolute inset-x-3 bottom-0 top-6 rounded-t-full border border-eficto-gold/20"
                style={{ opacity: 0.25 + (i % 3) * 0.08 }}
              />
            </div>
          ))}
        </div>

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 45% at 50% 0%, rgba(203,169,125,0.28) 0%, rgba(203,169,125,0) 65%), radial-gradient(35% 30% at 20% 90%, rgba(203,169,125,0.14) 0%, rgba(203,169,125,0) 70%), radial-gradient(35% 30% at 80% 85%, rgba(203,169,125,0.12) 0%, rgba(203,169,125,0) 70%)",
          }}
        />

        <svg className="absolute inset-0 h-full w-full opacity-[0.05] mix-blend-overlay" aria-hidden="true">
          <filter id="eficto-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#eficto-grain)" />
        </svg>

        <div
          className="absolute inset-0 bg-gradient-to-t from-eficto-green-dark via-eficto-green-dark/40 to-transparent"
          style={{ opacity: dim ? 0.75 : 0.5 }}
        />
      </div>
    </div>
  );
}
