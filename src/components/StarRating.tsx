function Star({ fill }: { fill: number }) {
  const id = `star-clip-${Math.round(fill * 100)}-${Math.random().toString(36).slice(2)}`;
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4">
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width={20 * fill} height="20" />
        </clipPath>
      </defs>
      <path
        d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6L10 1.5z"
        fill="none"
        stroke="#CBA97D"
        strokeWidth="1"
      />
      <g clipPath={`url(#${id})`}>
        <path
          d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6L10 1.5z"
          fill="#CBA97D"
        />
      </g>
    </svg>
  );
}

export function StarRating({ rating }: { rating: number }) {
  const stars = [0, 1, 2, 3, 4].map((i) => {
    const fill = Math.max(0, Math.min(1, rating - i));
    return <Star key={i} fill={fill} />;
  });
  return <div className="flex items-center gap-0.5">{stars}</div>;
}
