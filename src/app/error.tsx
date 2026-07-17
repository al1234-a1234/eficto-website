"use client";

import { useEffect, useState } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [ua, setUa] = useState("");
  useEffect(() => {
    setUa(navigator.userAgent);
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "monospace", direction: "ltr", textAlign: "left" }}>
      <h1 style={{ color: "#b91c1c" }}>DEBUG: Route Error Caught</h1>
      <p><strong>name:</strong> {error?.name}</p>
      <p><strong>message:</strong> {error?.message}</p>
      <p><strong>digest:</strong> {error?.digest}</p>
      <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, background: "#f3f3f3", padding: 12 }}>
        {error?.stack}
      </pre>
      <p>User agent: {ua}</p>
    </div>
  );
}
