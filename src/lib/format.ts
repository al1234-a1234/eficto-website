const DAY_MS = 24 * 60 * 60 * 1000;

export function formatArabicDate(iso: string) {
  return new Intl.DateTimeFormat("ar-SA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    calendar: "gregory",
  }).format(new Date(iso));
}

export function formatArabicTime(iso: string) {
  return new Intl.DateTimeFormat("ar-SA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

export function formatArabicDateTime(iso: string) {
  return `${formatArabicDate(iso)} — ${formatArabicTime(iso)}`;
}

export function relativeMinutesSince(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
}

export function isSameDay(a: Date, b: Date) {
  return Math.floor(a.getTime() / DAY_MS) === Math.floor(b.getTime() / DAY_MS);
}
