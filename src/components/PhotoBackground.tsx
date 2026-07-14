import Image from "next/image";

type PhotoBackgroundProps = {
  src: string;
  alt?: string;
  className?: string;
  dim?: boolean;
  priority?: boolean;
};

/** Real eficto interior photography with a dark gradient for text legibility. */
export function PhotoBackground({ src, alt = "", className, dim = false, priority = false }: PhotoBackgroundProps) {
  return (
    <div className={`overflow-hidden bg-eficto-green-deep ${className ?? ""}`}>
      <div className="relative h-full w-full">
        <Image src={src} alt={alt} fill priority={priority} sizes="100vw" className="object-cover" unoptimized />
        <div
          className="absolute inset-0 bg-gradient-to-t from-eficto-green-deep via-eficto-green-deep/50 to-eficto-green-deep/10"
          style={{ opacity: dim ? 0.85 : 0.55 }}
        />
      </div>
    </div>
  );
}
