import Link from "next/link";
import CandleChart from "@/components/chart/CandleChart";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/motion/Reveal";
import { getSeriesForSymbol, MOCK_STOCKS } from "@/data/stocks";
import { formatPrice, formatSignedNumber, formatSignedPct, toneClass } from "@/lib/format";

export default function Hero() {
  const featured = MOCK_STOCKS[0];
  const series = getSeriesForSymbol(featured.symbol, 140);

  return (
    <section className="relative border-b border-[color:var(--color-border-subtle)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-14 lg:grid-cols-5 lg:gap-8 lg:px-8 lg:py-20">
        <div className="lg:col-span-2">
          <Reveal immediate delay={0.02}>
            <Badge tone="info" className="mb-4">
              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-cyan-300" />
              v0.1 Preview · KIS API 연동 예정
            </Badge>
          </Reveal>
          <Reveal immediate delay={0.08}>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              차트의 <span className="text-emerald-400">모양</span>으로
              <br />
              다음 움직임을 읽다.
            </h1>
          </Reveal>
          <Reveal immediate delay={0.18}>
            <p className="mt-4 max-w-md text-sm leading-7 text-[color:var(--color-fg-secondary)] sm:text-base">
              과거 주가 차트의 반복되는 패턴을 학습하고, 실제 사례로 예측 감각을
              훈련하는 주식 학습 플랫폼입니다. 한국투자증권 KIS 오픈 API와 연동해
              실시간 데이터로 확장됩니다.
            </p>
          </Reveal>

          <Reveal immediate delay={0.28} className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/patterns"
              className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-emerald-400"
            >
              패턴 도감 열기
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href={`/chart/${featured.symbol}`}
              className="inline-flex items-center gap-2 rounded-md border border-[color:var(--color-border-strong)] bg-[color:var(--color-bg-surface)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-emerald-400/40 hover:bg-[color:var(--color-bg-elevated)]"
            >
              샘플 차트 보기
            </Link>
          </Reveal>

          <Reveal immediate delay={0.38}>
            <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-[color:var(--color-border-subtle)] pt-5 sm:mt-10 sm:gap-4 sm:pt-6">
              <div>
                <dt className="text-[11px] text-[color:var(--color-fg-muted)] sm:text-xs">수록 패턴</dt>
                <dd className="num mt-1 text-lg font-semibold text-white sm:text-xl">11개</dd>
              </div>
              <div>
                <dt className="text-[11px] text-[color:var(--color-fg-muted)] sm:text-xs">샘플 종목</dt>
                <dd className="num mt-1 text-lg font-semibold text-white sm:text-xl">8개</dd>
              </div>
              <div>
                <dt className="text-[11px] text-[color:var(--color-fg-muted)] sm:text-xs">데이터 소스</dt>
                <dd className="mt-1 text-lg font-semibold text-white sm:text-xl">KIS</dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <Reveal immediate delay={0.16} y={24} className="lg:col-span-3">
          <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)] shadow-[0_20px_80px_rgba(0,0,0,0.4)] sm:rounded-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-[color:var(--color-border-subtle)] px-3 py-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-sm font-bold text-emerald-300">
                  {featured.name[0]}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {featured.name}
                    <span className="ml-2 text-[11px] font-normal text-[color:var(--color-fg-muted)]">
                      {featured.symbol} · {featured.exchange}
                    </span>
                  </p>
                  <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="num text-base font-semibold text-white sm:text-lg">
                      ₩{formatPrice(featured.price)}
                    </span>
                    <span className={`num text-xs sm:text-sm ${toneClass(featured.change)}`}>
                      {formatSignedNumber(featured.change)} ({formatSignedPct(featured.changePct)})
                    </span>
                  </p>
                </div>
              </div>
              <div className="hidden shrink-0 items-center gap-2 text-xs text-[color:var(--color-fg-muted)] sm:flex">
                <span className="relative inline-flex h-2 w-2 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-emerald-400 opacity-80" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                MOCK · 일봉
              </div>
            </div>
            <div className="px-1 pb-1 pt-2 sm:px-2 sm:pb-2">
              <CandleChart data={series} showVolume className="h-64 sm:h-80 lg:h-[380px]" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
