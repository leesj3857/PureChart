import Link from "next/link";
import { notFound } from "next/navigation";
import CandleChart from "@/components/chart/CandleChart";
import Badge from "@/components/ui/Badge";
import { MOCK_STOCKS, findStock, getSeriesForSymbol } from "@/data/stocks";
import {
  formatCompact,
  formatPrice,
  formatSignedNumber,
  formatSignedPct,
  toneBg,
  toneClass,
} from "@/lib/format";

export function generateStaticParams() {
  return MOCK_STOCKS.map((s) => ({ symbol: s.symbol }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const s = findStock(symbol);
  if (!s) return { title: "종목을 찾을 수 없음 — PureChart" };
  return {
    title: `${s.name} (${s.symbol}) — PureChart`,
    description: `${s.name} 차트 · ${s.exchange}`,
  };
}

export default async function ChartPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const stock = findStock(symbol);
  if (!stock) notFound();
  const series = getSeriesForSymbol(stock.symbol, 220);

  const high52 = Math.max(...series.map((c) => c.high));
  const low52 = Math.min(...series.map((c) => c.low));
  const avgVolume = Math.round(
    series.reduce((a, b) => a + b.volume, 0) / series.length,
  );

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-4 lg:px-8">
      <div className="lg:col-span-3">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <Link
              href="/"
              className="mb-2 inline-flex items-center gap-1 text-xs text-[color:var(--color-fg-muted)] hover:text-emerald-300"
            >
              ← 대시보드
            </Link>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-base font-bold text-emerald-300 sm:h-12 sm:w-12 sm:text-lg">
                {stock.name[0]}
              </span>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-semibold text-white sm:text-2xl">
                  {stock.name}
                </h1>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[color:var(--color-fg-muted)]">
                  <span className="num">{stock.symbol}</span>
                  <span className="inline-block h-1 w-1 rounded-full bg-[color:var(--color-fg-muted)]" />
                  <span>{stock.exchange}</span>
                  <Badge tone="warn">MOCK</Badge>
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="num text-3xl font-semibold text-white sm:text-4xl">
                ₩{formatPrice(stock.price)}
              </span>
              <span
                className={`num rounded-md px-2 py-1 text-xs font-semibold sm:text-sm ${toneBg(stock.change)}`}
              >
                {formatSignedPct(stock.changePct)}
              </span>
              <span className={`num text-xs sm:text-sm ${toneClass(stock.change)}`}>
                {formatSignedNumber(stock.change)}
              </span>
            </div>
          </div>

          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
            <div className="flex gap-1.5 sm:gap-2">
              {["1D", "1W", "1M", "3M", "6M", "1Y"].map((t, i) => (
                <button
                  key={t}
                  type="button"
                  className={`shrink-0 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    i === 3
                      ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-200"
                      : "border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)] text-[color:var(--color-fg-secondary)] hover:border-[color:var(--color-border-strong)] hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)] sm:mt-6 sm:rounded-2xl">
          <div className="px-1 pb-1 pt-2 sm:px-3 sm:pb-2 sm:pt-3">
            <CandleChart
              data={series}
              showVolume
              className="h-[340px] sm:h-[420px] lg:h-[480px]"
            />
          </div>
        </div>
      </div>

      <aside className="space-y-4 lg:col-span-1">
        <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)] p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[color:var(--color-fg-muted)]">
            주요 지표
          </h3>
          <dl className="space-y-3 text-sm">
            <Row label="시가총액" value={stock.marketCap ?? "-"} />
            <Row label="거래량" value={formatCompact(stock.volume)} />
            <Row label="평균 거래량" value={formatCompact(avgVolume)} />
            <Row label="52주 최고" value={`₩${formatPrice(high52)}`} tone="up" />
            <Row label="52주 최저" value={`₩${formatPrice(low52)}`} tone="down" />
          </dl>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-sm text-[color:var(--color-fg-secondary)]">
          <p className="mb-1 font-semibold text-emerald-300">KIS API 연동 예정</p>
          <p className="leading-6 text-[color:var(--color-fg-secondary)]">
            현재는 시드 기반 Mock 데이터입니다. KIS 토큰이 연결되면
            <code className="mx-1 rounded bg-black/30 px-1 py-0.5 text-[12px]">
              /api/kis/daily
            </code>
            경로로 실시간 일봉이 교체됩니다.
          </p>
        </div>

        <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)] p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[color:var(--color-fg-muted)]">
            다른 종목
          </h3>
          <ul className="space-y-1">
            {MOCK_STOCKS.filter((s) => s.symbol !== stock.symbol)
              .slice(0, 6)
              .map((s) => (
                <li key={s.symbol}>
                  <Link
                    href={`/chart/${s.symbol}`}
                    className="flex items-center justify-between gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-white/5"
                  >
                    <span className="truncate text-[color:var(--color-fg-secondary)]">
                      {s.name}
                    </span>
                    <span className={`num text-xs ${toneClass(s.change)}`}>
                      {formatSignedPct(s.changePct)}
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "up" | "down";
}) {
  const toneCls =
    tone === "up"
      ? "text-[color:var(--color-up)]"
      : tone === "down"
        ? "text-[color:var(--color-down)]"
        : "text-white";
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-[color:var(--color-fg-muted)]">{label}</dt>
      <dd className={`num font-medium ${toneCls}`}>{value}</dd>
    </div>
  );
}
