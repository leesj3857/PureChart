import { MOCK_STOCKS } from "@/data/stocks";
import { formatPrice, formatSignedPct, toneClass } from "@/lib/format";

export default function Ticker() {
  const items = [...MOCK_STOCKS, ...MOCK_STOCKS];
  return (
    <div className="relative overflow-hidden border-b border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)]/70">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[color:var(--color-bg-base)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[color:var(--color-bg-base)] to-transparent" />

      <div className="flex items-center gap-2 px-3 sm:px-4">
        <div className="flex shrink-0 items-center gap-2 py-2 pr-2 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-fg-muted)] sm:pr-4 sm:text-xs">
          <span className="relative inline-flex h-2 w-2 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-emerald-400 opacity-80" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          MARKET
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max animate-ticker gap-5 py-2 sm:gap-8">
            {items.map((s, i) => (
              <div
                key={`${s.symbol}-${i}`}
                className="flex shrink-0 items-center gap-1.5 text-[12px] sm:gap-2 sm:text-[13px]"
              >
                <span className="text-[color:var(--color-fg-secondary)]">{s.name}</span>
                <span className="num text-white">{formatPrice(s.price)}</span>
                <span className={`num ${toneClass(s.change)}`}>
                  {formatSignedPct(s.changePct)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
