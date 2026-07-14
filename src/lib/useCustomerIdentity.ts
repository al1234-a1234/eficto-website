"use client";

import { useEffect, useState } from "react";
import { clearStoredIdentity, getStoredIdentity, setStoredIdentity, type CustomerIdentity } from "@/lib/identity";

export function useCustomerIdentity() {
  const [identity, setIdentity] = useState<CustomerIdentity | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIdentity(getStoredIdentity());
    setReady(true);
  }, []);

  function save(next: CustomerIdentity) {
    setStoredIdentity(next);
    setIdentity(next);
  }

  function clear() {
    clearStoredIdentity();
    setIdentity(null);
  }

  return { identity, ready, save, clear };
}
