import Link from "next/link";
import CandleChart from "@/components/chart/CandleChart";
import Reveal from "@/components/motion/Reveal";
import RevealGroup, { RevealItem } from "@/components/motion/RevealGroup";
import { TRENDING_SYMBOLS, getSeriesForSymbol } from "@/data/stocks";
import {
  formatCompact,
  formatPrice,
  formatSignedNumber,
  formatSignedPct,
  toneBg,
  toneClass,
} from "@/lib/format";

export default function TrendingStocks() {
  return (
    <section className="border-b border-[color:var(--color-border-subtle)] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 sm:text-sm">
              Trending
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl">
              지금 주목받는 종목
            </h2>
            <p className="mt-2 text-xs text-[color:var(--color-fg-secondary)] sm:text-sm">
              Mock 데이터 기반 — KIS API 연동 이후 실시간 시세로 교체됩니다.
            </p>
          </div>
          <Link
            href="/chart/005930"
            className="hidden shrink-0 rounded-md border border-[color:var(--color-border-strong)] bg-[color:var(--color-bg-surface)] px-3 py-1.5 text-sm text-[color:var(--color-fg-secondary)] hover:border-emerald-400/40 hover:text-white md:inline-block"
          >
            전체 보기 →
          </Link>
        </Reveal>

        <RevealGroup
          stagger={0.07}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TRENDING_SYMBOLS.map((s) => {
            const series = getSeriesForSymbol(s.symbol, 90);
            return (
              <RevealItem key={s.symbol}>
                <Link
                  href={`/chart/${s.symbol}`}
                  className="card-hover flex h-full flex-col overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)]"
                >
                <div className="flex items-start justify-between gap-3 px-4 pt-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-[15px] font-semibold text-white">
                        {s.name}
                      </h3>
                      <span className="shrink-0 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-[color:var(--color-fg-muted)]">
                        {s.exchange}
                      </span>
                    </div>
                    <p className="num mt-0.5 text-xs text-[color:var(--color-fg-muted)]">
                      {s.symbol}
                    </p>
                  </div>
                  <span
                    className={`num rounded-md px-2 py-1 text-xs font-semibold ${toneBg(s.change)}`}
                  >
                    {formatSignedPct(s.changePct)}
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-3 px-4">
                  <span className="num text-2xl font-semibold text-white">
                    ₩{formatPrice(s.price)}
                  </span>
                  <span className={`num text-xs ${toneClass(s.change)}`}>
                    {formatSignedNumber(s.change)}
                  </span>
                </div>

                <div className="mt-3 w-full">
                  <CandleChart
                    data={series}
                    type="area"
                    showVolume={false}
                    minimal
                    className="h-20 sm:h-24"
                  />
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-[color:var(--color-border-subtle)] px-4 py-2.5 text-xs text-[color:var(--color-fg-muted)]">
                  <span>
                    거래량 <span className="num text-[color:var(--color-fg-secondary)]">{formatCompact(s.volume)}</span>
                  </span>
                  {s.marketCap && (
                    <span>
                      시총 <span className="num text-[color:var(--color-fg-secondary)]">{s.marketCap}</span>
                    </span>
                  )}
                </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
