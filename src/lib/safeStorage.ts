// localStorage throws (SecurityError) in some in-app browsers (e.g. WhatsApp's WebView)
// that restrict storage access — these wrappers turn that into a harmless no-op.
export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore — storage unavailable
  }
}

export function safeRemoveItem(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore — storage unavailable
  }
}
