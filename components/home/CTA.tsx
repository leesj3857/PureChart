import Link from "next/link";
import Reveal from "@/components/motion/Reveal";

export default function CTA() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-[color:var(--color-bg-surface)] to-cyan-500/10 p-6 text-center sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(600px 200px at 50% -20%, rgba(16,185,129,0.35), transparent 60%)",
            }}
          />
          <div className="relative">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              차트는 복잡한 공식이 아니라,
              <br />
              <span className="text-emerald-400">반복되는 형태</span>를 읽는 언어입니다.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[color:var(--color-fg-secondary)] sm:text-[15px]">
              지금은 Mock 데이터로 UI를 탐색하고, KIS API가 연결되면 실제
              KOSPI/KOSDAQ 데이터로 곧바로 확장됩니다.
            </p>
            <div className="mt-6 flex flex-col items-stretch justify-center gap-2 sm:mt-7 sm:flex-row sm:gap-3">
              <Link
                href="/patterns"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-emerald-400"
              >
                패턴 도감 시작하기
              </Link>
              <Link
                href="/chart/005930"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[color:var(--color-border-strong)] bg-[color:var(--color-bg-surface)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-emerald-400/40"
              >
                샘플 차트 체험
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
