export function IdentityBadge({
  fullName,
  onChange,
}: {
  fullName: string;
  onChange: () => void;
}) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-2xl border border-eficto-gold/25 bg-eficto-green/5 px-5 py-3.5 text-sm shadow-premium">
      <span className="text-eficto-green-dark/80">
        باسم <span className="font-medium text-eficto-green">{fullName}</span>
      </span>
      <button
        type="button"
        onClick={onChange}
        className="text-eficto-green underline underline-offset-4 transition-colors hover:text-eficto-gold-deep"
      >
        تغيير
      </button>
    </div>
  );
}
