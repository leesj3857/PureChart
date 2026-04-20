"use client";

import { useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import PatternCard from "@/components/patterns/PatternCard";
import PatternDetail from "@/components/patterns/PatternDetail";
import Reveal from "@/components/motion/Reveal";
import RevealGroup, { RevealItem } from "@/components/motion/RevealGroup";
import type { ChartPattern } from "@/types/market";

export default function PatternPreview({ patterns }: { patterns: ChartPattern[] }) {
  const [active, setActive] = useState<ChartPattern | null>(null);
  const preview = patterns.slice(0, 6);

  return (
    <section className="border-b border-[color:var(--color-border-subtle)] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 sm:text-sm">
              Pattern Library
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl">
              대표 차트 패턴 미리보기
            </h2>
            <p className="mt-2 text-xs text-[color:var(--color-fg-secondary)] sm:text-sm">
              카드를 터치하면 상세 모달로 패턴 해설을 확인할 수 있어요.
            </p>
          </div>
          <Link
            href="/patterns"
            className="hidden shrink-0 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20 md:inline-block"
          >
            전체 패턴 보기 →
          </Link>
        </Reveal>

        <RevealGroup
          stagger={0.07}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {preview.map((p) => (
            <RevealItem key={p.slug}>
              <PatternCard pattern={p} onClick={setActive} />
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/patterns"
            className="inline-flex rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300"
          >
            전체 패턴 보기 →
          </Link>
        </div>
      </div>

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
    </section>
  );
}
