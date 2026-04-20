"use client";

import { motion } from "motion/react";
import CandleChart from "@/components/chart/CandleChart";
import Badge from "@/components/ui/Badge";
import type { ChartPattern } from "@/types/market";

type Props = {
  pattern: ChartPattern;
  onClick?: (pattern: ChartPattern) => void;
};

function directionBadge(d: ChartPattern["direction"]) {
  if (d === "up") return <Badge tone="up">상승 전망</Badge>;
  if (d === "down") return <Badge tone="down">하락 전망</Badge>;
  return <Badge tone="neutral">양방향</Badge>;
}

function kindLabels(kinds: ChartPattern["kind"]) {
  const map: Record<string, { label: string; tone: "up" | "down" | "info" | "neutral" }> = {
    bullish: { label: "강세", tone: "up" },
    bearish: { label: "약세", tone: "down" },
    continuation: { label: "추세지속", tone: "info" },
    reversal: { label: "추세전환", tone: "neutral" },
  };
  return kinds.map((k) => {
    const m = map[k];
    return (
      <Badge key={k} tone={m.tone}>
        {m.label}
      </Badge>
    );
  });
}

export default function PatternCard({ pattern, onClick }: Props) {
  return (
    <motion.button
      type="button"
      onClick={() => onClick?.(pattern)}
      layout
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group flex flex-col overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)] text-left transition-colors hover:border-[color:var(--color-border-strong)]"
    >
      <div className="relative border-b border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-base)]">
        <CandleChart
          data={pattern.series}
          type="area"
          showVolume={false}
          minimal
          className="h-36 sm:h-44"
        />
        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
          {kindLabels(pattern.kind)}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white group-hover:text-emerald-300">
              {pattern.nameKo}
            </h3>
            <p className="text-xs text-[color:var(--color-fg-muted)]">{pattern.name}</p>
          </div>
          {directionBadge(pattern.direction)}
        </div>
        <p className="text-sm text-[color:var(--color-fg-secondary)]">{pattern.summary}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-[color:var(--color-fg-muted)]">
          <span className="flex items-center gap-1.5">
            <span aria-hidden>★</span>
            <span className="num">{pattern.reliability}/5 신뢰도</span>
          </span>
          <span className="num">
            {pattern.formationDays[0]}–{pattern.formationDays[1]}일
          </span>
        </div>
      </div>
    </motion.button>
  );
}
