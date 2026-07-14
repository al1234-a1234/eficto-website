export function IdentityBadge({
  fullName,
  onChange,
}: {
  fullName: string;
  onChange: () => void;
}) {
  return (
    <div className="mb-5 flex items-center justify-between rounded-xl border border-eficto-gold/30 bg-eficto-green/5 px-4 py-2.5 text-sm">
      <span className="text-eficto-green-dark/80">
        باسم <span className="font-medium text-eficto-green">{fullName}</span>
      </span>
      <button type="button" onClick={onChange} className="text-eficto-green underline">
        تغيير
      </button>
    </div>
  );
}
