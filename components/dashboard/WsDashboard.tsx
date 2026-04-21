"use client";

import { useEffect, useRef } from "react";
import { KisWebSocket } from "@/lib/kis-ws";
import { useMarketStore } from "@/store/market-store";
import { KR_STOCKS, US_STOCKS } from "@/data/stocks";
import type { Market } from "@/lib/market-time";
import type { RealtimeQuote } from "@/types/market";
import MarketBadge from "./MarketBadge";
import RealtimeTable from "./RealtimeTable";

// DEMO 모드의 기준가 (KIS 인증 없이 실행 시 사용)
const DEMO_BASE: Record<string, number> = {
  "005930": 78_400,
  "000660": 214_500,
  "035420": 201_000,
  AAPL: 198.5,
  TSLA: 245.3,
  MSFT: 421.8,
};

function startDemo(market: Market, updateQuote: (q: RealtimeQuote) => void) {
  const stocks = market === "KR" ? KR_STOCKS : US_STOCKS;
  const prevPrices: Record<string, number> = {};
  for (const s of stocks) prevPrices[s.symbol] = DEMO_BASE[s.symbol] ?? 100;

  let ticks = 0;

  const id = setInterval(() => {
    ticks++;
    for (const stock of stocks) {
      const prev = prevPrices[stock.symbol];
      const vol = market === "KR" ? prev * 0.002 : prev * 0.003;
      const delta = (Math.random() - 0.5) * vol;
      const price =
        market === "KR"
          ? Math.round(prev + delta)
          : Math.round((prev + delta) * 100) / 100;

      prevPrices[stock.symbol] = price;
      const base = DEMO_BASE[stock.symbol] ?? price;
      const change = market === "KR" ? price - base : Math.round((price - base) * 100) / 100;
      const changePct = (change / base) * 100;

      updateQuote({
        symbol: stock.symbol,
        name: stock.name,
        price,
        change,
        changePct,
        volume: Math.floor(1_000_000 + Math.random() * 5_000_000 + ticks * 10_000),
        market,
        updatedAt: Date.now(),
      });
    }
  }, 2_000);

  return id;
}

interface Props {
  /** 서버 컴포넌트에서 SSR 기준으로 결정한 초기 시장 값 */
  initialMarket: Market;
}

export default function WsDashboard({ initialMarket }: Props) {
  const setMarket = useMarketStore((s) => s.setMarket);
  const updateQuote = useMarketStore((s) => s.updateQuote);
  const setWsStatus = useMarketStore((s) => s.setWsStatus);

  const wsRef = useRef<KisWebSocket | null>(null);
  const demoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // 서버에서 결정한 시장을 스토어에 반영
    setMarket(initialMarket);

    async function init() {
      try {
        const res = await fetch("/api/kis/approval-key");
        if (!res.ok) throw new Error("credentials not configured");
        const { approval_key } = (await res.json()) as { approval_key: string };

        const kisWs = new KisWebSocket(approval_key, initialMarket, {
          onQuote: updateQuote,
          onStatus: (status) => {
            if (status === "connecting") setWsStatus("connecting");
            else if (status === "connected") setWsStatus("connected");
            else setWsStatus("disconnected");
          },
        });
        wsRef.current = kisWs;
        kisWs.connect();
      } catch {
        // KIS 인증 정보 없음 → DEMO 모드로 대체
        setWsStatus("demo");
        demoRef.current = startDemo(initialMarket, updateQuote);
      }
    }

    init();

    return () => {
      wsRef.current?.destroy();
      wsRef.current = null;
      if (demoRef.current !== null) {
        clearInterval(demoRef.current);
        demoRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">실시간 시세 대시보드</h1>
          <p className="mt-1 text-sm text-[color:var(--color-fg-muted)]">
            KST 기준 시간대에 따라 한국장 / 미국장이 자동 전환됩니다.
          </p>
        </div>
        <MarketBadge />
      </div>

      {/* 실시간 테이블 */}
      <RealtimeTable />

      {/* DEMO 모드 안내 */}
      <DemoNotice />
    </div>
  );
}

function DemoNotice() {
  const wsStatus = useMarketStore((s) => s.wsStatus);
  if (wsStatus !== "demo") return null;

  return (
    <div className="mt-4 rounded-lg border border-sky-400/20 bg-sky-400/5 px-4 py-3 text-sm text-sky-400">
      <strong>DEMO 모드:</strong> KIS API 인증 정보가 없어 시뮬레이션 데이터를 표시합니다.{" "}
      <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs">
        .env.local
      </code>
      에 <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs">KIS_APP_KEY</code> /
      <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs">KIS_APP_SECRET</code>
      을 추가하면 실시간 데이터가 활성화됩니다.
    </div>
  );
}
