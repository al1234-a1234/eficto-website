const SAUDI_PHONE = /^(?:\+966|0)5\d{8}$/;

export function isValidSaudiPhone(phone: string) {
  return SAUDI_PHONE.test(phone.trim());
}

export function normalizePhone(phone: string) {
  const trimmed = phone.trim();
  return trimmed.startsWith("0") ? `+966${trimmed.slice(1)}` : trimmed;
}

export function isValidPartySize(size: number) {
  return Number.isInteger(size) && size >= 1 && size <= 20;
}

/** Restaurant operates 5:00 PM – 2:30 AM Riyadh time. */
export function isWithinOperatingHours(time: string) {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return false;
  const minutes = h * 60 + m;
  return minutes >= 17 * 60 || minutes <= 2 * 60 + 30;
}
