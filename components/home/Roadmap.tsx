import Badge from "@/components/ui/Badge";
import Reveal from "@/components/motion/Reveal";
import RevealGroup, { RevealItem } from "@/components/motion/RevealGroup";

const items = [
  {
    phase: "Phase 1",
    status: "in-progress" as const,
    title: "UI & 패턴 도감",
    points: ["다크톤 차트 대시보드", "11종 패턴 시각화 + 모달", "Mock OHLC 데이터"],
  },
  {
    phase: "Phase 2",
    status: "next" as const,
    title: "KIS API 연동",
    points: [
      "한국투자증권 OAuth 토큰 관리",
      "일봉/분봉 시세 Fetch 추상 레이어",
      "종목 검색 · Watchlist",
    ],
  },
  {
    phase: "Phase 3",
    status: "planned" as const,
    title: "예측 퀴즈 & 저장",
    points: [
      "과거 구간 마스킹 차트 퀴즈",
      "Prisma + DB로 결과 저장",
      "개인별 정확도 통계",
    ],
  },
  {
    phase: "Phase 4",
    status: "planned" as const,
    title: "패턴 자동 인식",
    points: [
      "룰 기반 패턴 detector",
      "ML 기반 형태 유사도 검색",
      "실시간 알림",
    ],
  },
];

function StatusBadge({ s }: { s: "in-progress" | "next" | "planned" }) {
  if (s === "in-progress") return <Badge tone="up">진행중</Badge>;
  if (s === "next") return <Badge tone="info">예정</Badge>;
  return <Badge tone="neutral">계획</Badge>;
}

export default function Roadmap() {
  return (
    <section className="border-b border-[color:var(--color-border-subtle)] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-6 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 sm:text-sm">
            Roadmap
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl">
            KIS API 키 발급 전후로 단계적으로 확장
          </h2>
        </Reveal>

        <RevealGroup
          as="ol"
          stagger={0.1}
          className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
        >
          {items.map((it) => (
            <RevealItem
              key={it.phase}
              as="li"
              className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)] p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-fg-muted)]">
                  {it.phase}
                </span>
                <StatusBadge s={it.status} />
              </div>
              <h3 className="mt-3 text-base font-semibold text-white">{it.title}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-[color:var(--color-fg-secondary)]">
                {it.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-0.5 text-emerald-400">◆</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
