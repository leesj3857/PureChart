import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)]/50">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-xs text-[color:var(--color-fg-secondary)] sm:text-sm">
            과거 차트의 모양을 학습하고, 다음 움직임을 예측하는 연습을 해보세요.
            한국투자증권 오픈 API를 기반으로 동작합니다.
          </p>
          <p className="mt-3 text-xs text-[color:var(--color-fg-muted)]">
            ⚠️ 본 서비스는 교육용이며, 투자 결과에 대한 책임은 사용자에게 있습니다.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-fg-secondary)]">
            <li>대시보드</li>
            <li>패턴 도감</li>
            <li>예측 퀴즈 (준비중)</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Data</h4>
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-fg-secondary)]">
            <li>한국투자증권 KIS Developers</li>
            <li>업비트 공개 시세 (예정)</li>
            <li>Mock 데이터 (개발중)</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[color:var(--color-border-subtle)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-xs text-[color:var(--color-fg-muted)] sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} PureChart</span>
          <span className="num">v0.1.0 — preview</span>
        </div>
      </div>
    </footer>
  );
}
