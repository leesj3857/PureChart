"use client";

import { useMarketStore } from "@/store/market-store";
import { KR_STOCKS, US_STOCKS } from "@/data/stocks";
import { formatPrice, formatSignedPct, formatCompact, toneClass, toneBg } from "@/lib/format";

function Skeleton({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block animate-pulse rounded bg-white/10 ${className ?? "h-4 w-20"}`}
    />
  );
}

function ChangeCell({ change, market }: { change: number; market: "KR" | "US" }) {
  const sign = change > 0 ? "+" : "";
  const abs = Math.abs(change);
  const formatted =
    market === "KR"
      ? `${sign}${formatPrice(abs)}`
      : `${sign}$${formatPrice(abs, "USD")}`;
  return <span className={`num text-sm ${toneClass(change)}`}>{formatted}</span>;
}

export default function RealtimeTable() {
  const market = useMarketStore((s) => s.market);
  const quotes = useMarketStore((s) => s.quotes);
  const wsStatus = useMarketStore((s) => s.wsStatus);

  const stocks = market === "KR" ? KR_STOCKS : US_STOCKS;
  const isWaiting = wsStatus === "connecting" || wsStatus === "connected";

  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)]">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between border-b border-[color:var(--color-border-subtle)] px-6 py-4">
        <h2 className="text-sm font-semibold text-[color:var(--color-fg-secondary)]">
          {market === "KR" ? "주요 한국 종목" : "주요 미국 종목"}
        </h2>
        <span className="text-xs text-[color:var(--color-fg-muted)]">
          {market === "KR" ? "KST 09:00~16:59 · KRX 정규장" : "KST 17:00~ · 미국장"}
        </span>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[color:var(--color-border-subtle)] text-xs text-[color:var(--color-fg-muted)]">
              <th className="px-6 py-3 text-left font-medium">종목</th>
              <th className="px-4 py-3 text-right font-medium">현재가</th>
              <th className="px-4 py-3 text-right font-medium">등락률</th>
              <th className="px-4 py-3 text-right font-medium">전일대비</th>
              <th className="px-4 py-3 text-right font-medium">거래량</th>
              <th className="px-4 py-3 text-right font-medium">갱신</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border-subtle)]">
            {stocks.map((stock) => {
              const q = quotes[stock.symbol];
              const loading = !q && isWaiting;

              return (
                <tr
                  key={stock.symbol}
                  className="transition-colors hover:bg-white/[0.02]"
                >
                  {/* 종목명 */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{stock.name}</div>
                    <div className="num mt-0.5 text-xs text-[color:var(--color-fg-muted)]">
                      {stock.symbol} · {stock.exchange}
                    </div>
                  </td>

                  {/* 현재가 */}
                  <td className="px-4 py-4 text-right">
                    {loading ? (
                      <Skeleton className="h-5 w-24" />
                    ) : q ? (
                      <span className="num text-base font-semibold text-white">
                        {market === "KR"
                          ? `₩${formatPrice(q.price)}`
                          : `$${formatPrice(q.price, "USD")}`}
                      </span>
                    ) : (
                      <span className="text-[color:var(--color-fg-muted)]">—</span>
                    )}
                  </td>

                  {/* 등락률 */}
                  <td className="px-4 py-4 text-right">
                    {loading ? (
                      <Skeleton className="h-5 w-14" />
                    ) : q ? (
                      <span
                        className={`num inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${toneBg(q.changePct)}`}
                      >
                        {formatSignedPct(q.changePct)}
                      </span>
                    ) : null}
                  </td>

                  {/* 전일대비 */}
                  <td className="px-4 py-4 text-right">
                    {loading ? (
                      <Skeleton className="h-4 w-16" />
                    ) : q ? (
                      <ChangeCell change={q.change} market={market} />
                    ) : null}
                  </td>

                  {/* 거래량 */}
                  <td className="px-4 py-4 text-right">
                    {loading ? (
                      <Skeleton className="h-4 w-12" />
                    ) : q ? (
                      <span className="num text-sm text-[color:var(--color-fg-secondary)]">
                        {formatCompact(q.volume)}
                      </span>
                    ) : null}
                  </td>

                  {/* 갱신 시각 */}
                  <td className="px-4 py-4 text-right">
                    {q ? (
                      <span className="num text-xs text-[color:var(--color-fg-muted)]">
                        {new Date(q.updatedAt).toLocaleTimeString("ko-KR")}
                      </span>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
