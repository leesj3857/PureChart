import PatternGallery from "@/components/patterns/PatternGallery";
import { PATTERNS } from "@/data/patterns";

export const metadata = {
  title: "차트 패턴 도감 — PureChart",
  description:
    "헤드앤숄더, 컵앤핸들, 삼각형, 깃발형 등 대표 차트 패턴을 시각적으로 학습하세요.",
};

export default function PatternsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 sm:text-sm">
          Chart Pattern Library
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
          차트 패턴 도감
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--color-fg-secondary)] sm:text-[15px]">
          기술적 분석에서 자주 사용되는 대표 차트 패턴 11종을 합성 데이터로
          시각화했습니다. 패턴 카드를 터치하면 상세 모달에서 해설과 체크 포인트를
          확인할 수 있습니다.
        </p>
      </header>

      <PatternGallery patterns={PATTERNS} />
    </div>
  );
}
