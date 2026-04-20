import CandleChart from "@/components/chart/CandleChart";
import Badge from "@/components/ui/Badge";
import type { ChartPattern } from "@/types/market";

export default function PatternDetail({ pattern }: { pattern: ChartPattern }) {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-base)]">
          <CandleChart
            data={pattern.series}
            showVolume
            title={pattern.nameKo}
            className="h-64 sm:h-80 lg:h-[380px]"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {pattern.kind.includes("bullish") && <Badge tone="up">강세 패턴</Badge>}
          {pattern.kind.includes("bearish") && <Badge tone="down">약세 패턴</Badge>}
          {pattern.kind.includes("continuation") && <Badge tone="info">추세 지속</Badge>}
          {pattern.kind.includes("reversal") && <Badge tone="neutral">추세 전환</Badge>}
          <span className="ml-auto text-xs text-[color:var(--color-fg-muted)]">
            일반 형성 기간 <span className="num text-[color:var(--color-fg-secondary)]">
              {pattern.formationDays[0]}~{pattern.formationDays[1]}일
            </span>
          </span>
        </div>
      </div>

      <div className="space-y-6 lg:col-span-2">
        <section>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[color:var(--color-fg-muted)]">
            패턴 개요
          </h4>
          <p className="text-sm leading-relaxed text-[color:var(--color-fg-secondary)]">
            {pattern.description}
          </p>
        </section>

        <section>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[color:var(--color-fg-muted)]">
            체크 포인트
          </h4>
          <ul className="space-y-2">
            {pattern.keyPoints.map((p, i) => (
              <li
                key={i}
                className="flex gap-2 rounded-md border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)] px-3 py-2 text-sm text-[color:var(--color-fg-secondary)]"
              >
                <span className="mt-0.5 text-emerald-400">▸</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)] p-3">
            <p className="text-[11px] uppercase tracking-wider text-[color:var(--color-fg-muted)]">
              신뢰도
            </p>
            <p className="mt-1 num text-xl font-semibold text-white">
              {pattern.reliability}
              <span className="text-sm text-[color:var(--color-fg-muted)]"> / 5</span>
            </p>
          </div>
          <div className="rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)] p-3">
            <p className="text-[11px] uppercase tracking-wider text-[color:var(--color-fg-muted)]">
              방향
            </p>
            <p
              className={`mt-1 text-xl font-semibold ${
                pattern.direction === "up"
                  ? "text-[color:var(--color-up)]"
                  : pattern.direction === "down"
                    ? "text-[color:var(--color-down)]"
                    : "text-[color:var(--color-fg-secondary)]"
              }`}
            >
              {pattern.direction === "up" ? "▲ 상승" : pattern.direction === "down" ? "▼ 하락" : "양방향"}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
