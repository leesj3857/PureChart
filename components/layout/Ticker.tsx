"use client";

import { useMarketStore } from "@/store/market-store";
import { KR_STOCKS, US_STOCKS } from "@/data/stocks";
import { formatPrice, formatSignedPct, toneClass } from "@/lib/format";

export default function Ticker() {
  const market = useMarketStore((s) => s.market);
  const quotes = useMarketStore((s) => s.quotes);
  const stocks = market === "KR" ? KR_STOCKS : US_STOCKS;

  // 데이터가 아직 없으면 종목명만 표시
  const items = [...stocks, ...stocks];

  return (
    <div className="relative overflow-hidden border-b border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)]/70">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[color:var(--color-bg-base)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[color:var(--color-bg-base)] to-transparent" />

      <div className="flex items-center gap-2 px-3 sm:px-4">
        {/* LIVE / DEMO 점 */}
        <div className="flex shrink-0 items-center gap-2 py-2 pr-2 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-fg-muted)] sm:pr-4 sm:text-xs">
          <span className="relative inline-flex h-2 w-2 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-[color:var(--color-brand-400)] opacity-80" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-400)]" />
          </span>
          {market === "KR" ? "KRX" : "US"}
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max animate-ticker gap-5 py-2 sm:gap-8">
            {items.map((s, i) => {
              const q = quotes[s.symbol];
              return (
                <div
                  key={`${s.symbol}-${i}`}
                  className="flex shrink-0 items-center gap-1.5 text-[12px] sm:gap-2 sm:text-[13px]"
                >
                  <span className="text-[color:var(--color-fg-secondary)]">{s.name}</span>
                  {q ? (
                    <>
                      <span className="num text-white">
                        {market === "KR"
                          ? formatPrice(q.price)
                          : `$${formatPrice(q.price, "USD")}`}
                      </span>
                      <span className={`num ${toneClass(q.changePct)}`}>
                        {formatSignedPct(q.changePct)}
                      </span>
                    </>
                  ) : (
                    <span className="num text-[color:var(--color-fg-muted)]">—</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
