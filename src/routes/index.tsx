import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  useEffect(() => {
    window.location.replace("/coach/index.html");
  }, []);
  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg p-6 text-fg">
      <iframe
        title="Coach Muscu — Mathieu"
        src="/coach/index.html"
        className="fixed inset-0 h-dvh w-full border-0"
        style={{ position: "fixed", inset: 0, width: "100%", height: "100vh", border: 0, background: "#0E1116" }}
      />
      <p className="relative z-10 text-sm text-muted">Chargement de Coach Muscu — Mathieu…</p>
    </main>
  );
}
