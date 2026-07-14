export type CustomerIdentity = { full_name: string; phone: string };

const KEY = "eficto_identity";

export function getStoredIdentity(): CustomerIdentity | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.full_name === "string" && typeof parsed?.phone === "string") return parsed;
    return null;
  } catch {
    return null;
  }
}

export function setStoredIdentity(identity: CustomerIdentity) {
  localStorage.setItem(KEY, JSON.stringify(identity));
}

export function clearStoredIdentity() {
  localStorage.removeItem(KEY);
}
