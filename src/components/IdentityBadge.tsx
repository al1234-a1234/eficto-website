export function IdentityBadge({
  fullName,
  onChange,
}: {
  fullName: string;
  onChange: () => void;
}) {
  return (
    <div className="mb-2 flex items-center justify-between rounded-2xl bg-eficto-green/[0.04] px-6 py-4 text-sm">
      <span className="font-light text-eficto-green-dark/70">
        باسم <span className="text-eficto-green">{fullName}</span>
      </span>
      <button
        type="button"
        onClick={onChange}
        className="text-xs tracking-wide text-eficto-green underline underline-offset-4 transition-colors duration-300 ease-soft hover:text-eficto-gold-deep"
      >
        تغيير
      </button>
    </div>
  );
}
