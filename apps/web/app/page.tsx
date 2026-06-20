import { Dashboard } from "@/components/dashboard";
import { Header } from "@/components/header";
import { getSeries } from "@/lib/api";

export default async function Page() {
  const series = await getSeries("THYAO");

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
      <Header />
      <main className="flex-1 pb-24">
        <Dashboard series={series} />
      </main>
      <footer className="border-t py-6 text-center text-xs text-tertiary">
        Heimdall · Faz 1 — Temel &amp; Mimari · veri kaynağı:{" "}
        {series.source === "mock" ? "demo (mock)" : "API"}
      </footer>
    </div>
  );
}
