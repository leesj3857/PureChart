import Reveal from "@/components/motion/Reveal";
import RevealGroup, { RevealItem } from "@/components/motion/RevealGroup";

const features = [
  {
    icon: (
      <path d="M3 17l5-6 4 4 5-8 4 6" />
    ),
    title: "패턴 차트 시각화",
    desc: "헤드앤숄더, 컵앤핸들 등 11가지 대표 차트 패턴을 합성 데이터로 시각화해 한눈에 비교할 수 있습니다.",
  },
  {
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    title: "실전 차트 연습",
    desc: "과거 종목의 특정 구간만 노출하고 다음 움직임을 예측. 학습한 패턴이 어디서 나타나는지 스스로 찾아보세요.",
  },
  {
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    title: "KIS API 실데이터",
    desc: "한국투자증권 KIS Developers API를 연동해 KOSPI/KOSDAQ 일봉·분봉 데이터를 실시간으로 제공합니다.",
  },
  {
    icon: (
      <>
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </>
    ),
    title: "투자 대신 감각 훈련",
    desc: "자동매매가 아닌 “차트 읽는 눈”을 기르기 위한 학습 중심 서비스. 초보자도 빠르게 패턴 감각을 익힙니다.",
  },
];

export default function Features() {
  return (
    <section className="border-b border-[color:var(--color-border-subtle)] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 sm:text-sm">
              Why PureChart
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl">
              복잡한 보조지표 대신, 차트의 <span className="text-emerald-400">형태</span>부터 읽자.
            </h2>
          </div>
        </Reveal>

        <RevealGroup
          stagger={0.1}
          className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
        >
          {features.map((f) => (
            <RevealItem
              key={f.title}
              className="card-hover rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)] p-5"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {f.icon}
                </svg>
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-[color:var(--color-fg-secondary)]">
                {f.desc}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
