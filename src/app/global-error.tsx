"use client";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ padding: 24, fontFamily: "monospace", direction: "ltr", textAlign: "left" }}>
        <h1 style={{ color: "#b91c1c" }}>DEBUG: Global Error Caught</h1>
        <p><strong>name:</strong> {error?.name}</p>
        <p><strong>message:</strong> {error?.message}</p>
        <p><strong>digest:</strong> {error?.digest}</p>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, background: "#f3f3f3", padding: 12 }}>
          {error?.stack}
        </pre>
        <p>User agent: <span id="ua"></span></p>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.getElementById('ua').textContent = navigator.userAgent;`,
          }}
        />
      </body>
    </html>
  );
}
