export function Header() {
  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl border bg-surface text-lg">
          🛡️
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight text-primary">
            Heimdall
          </div>
          <div className="text-[11px] text-tertiary">BIST Zekâ Platformu</div>
        </div>
      </div>

      <nav className="hidden items-center gap-1 text-sm sm:flex">
        <span className="rounded-lg px-3 py-1.5 text-primary">Genel Bakış</span>
        <span className="rounded-lg px-3 py-1.5 text-secondary transition-colors hover:text-primary">
          Araştırma
        </span>
        <span className="rounded-lg px-3 py-1.5 text-secondary transition-colors hover:text-primary">
          Sinyaller
        </span>
        <span className="rounded-lg px-3 py-1.5 text-secondary transition-colors hover:text-primary">
          Strateji
        </span>
      </nav>

      <span className="rounded-full border px-2.5 py-1 text-[11px] text-secondary">
        Faz 1 · Temel
      </span>
    </header>
  );
}
