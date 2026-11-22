"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#fff8ee", color: "#221a16", margin: 0 }}>
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center", padding: 16 }}>
          <h1 style={{ fontSize: 32, margin: 0 }}>PizzaHub hit a snag</h1>
          <p style={{ maxWidth: 420, margin: 0 }}>Something unexpected happened. Please try again.</p>
          <button onClick={reset} style={{ background: "#c8102e", color: "#fff", border: 0, borderRadius: 10, padding: "12px 24px", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
