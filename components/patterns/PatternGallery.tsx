"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Modal from "@/components/ui/Modal";
import PatternCard from "./PatternCard";
import PatternDetail from "./PatternDetail";
import type { ChartPattern } from "@/types/market";

type Filter = "all" | "bullish" | "bearish" | "reversal" | "continuation";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "bullish", label: "강세" },
  { id: "bearish", label: "약세" },
  { id: "reversal", label: "추세 전환" },
  { id: "continuation", label: "추세 지속" },
];

export default function PatternGallery({ patterns }: { patterns: ChartPattern[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<ChartPattern | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return patterns;
    return patterns.filter((p) => p.kind.includes(filter));
  }, [patterns, filter]);

  return (
    <div>
      <LayoutGroup>
        <div className="mb-4 flex items-center gap-2 sm:mb-6">
          <div className="-mx-4 flex flex-1 gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            {FILTERS.map((f) => {
              const selected = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`relative shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    selected
                      ? "border-emerald-400/60 text-emerald-200"
                      : "border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)] text-[color:var(--color-fg-secondary)] hover:border-[color:var(--color-border-strong)] hover:text-white"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 -z-0 rounded-full bg-emerald-500/15"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{f.label}</span>
                </button>
              );
            })}
          </div>
          <motion.span
            key={filtered.length}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="shrink-0 text-xs text-[color:var(--color-fg-muted)]"
          >
            총 <span className="num text-[color:var(--color-fg-secondary)]">{filtered.length}</span>개
          </motion.span>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <PatternCard pattern={p} onClick={setActive} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        size="xl"
        title={
          active && (
            <div>
              <h2 className="text-xl font-semibold text-white">{active.nameKo}</h2>
              <p className="text-xs text-[color:var(--color-fg-muted)]">{active.name}</p>
            </div>
          )
        }
      >
        {active && <PatternDetail pattern={active} />}
      </Modal>
    </div>
  );
}
