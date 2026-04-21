"use client";

import { useMarketStore } from "@/store/market-store";
import type { WsStatus } from "@/store/market-store";

const STATUS_CONFIG: Record<WsStatus, { label: string; color: string }> = {
  idle: { label: "대기", color: "text-[color:var(--color-fg-muted)] border-[color:var(--color-border-subtle)] bg-white/5" },
  connecting: { label: "연결 중", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" },
  connected: { label: "LIVE", color: "text-[color:var(--color-brand-400)] border-[color:var(--color-brand-400)]/30 bg-[color:var(--color-brand-400)]/10" },
  disconnected: { label: "재연결 중", color: "text-[color:var(--color-down)] border-[color:var(--color-down)]/30 bg-[color:var(--color-down-soft)]" },
  demo: { label: "DEMO", color: "text-sky-400 border-sky-400/30 bg-sky-400/10" },
};

export default function MarketBadge() {
  const market = useMarketStore((s) => s.market);
  const wsStatus = useMarketStore((s) => s.wsStatus);
  const { label, color } = STATUS_CONFIG[wsStatus];
  const isPulsing = wsStatus === "connected" || wsStatus === "demo";

  return (
    <div className="flex items-center gap-2">
      {/* 시장 배지 */}
      <div className="flex items-center gap-2 rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-bg-elevated)] px-4 py-2 text-sm">
        <span className="text-[color:var(--color-fg-muted)]">시장</span>
        <span className="font-semibold text-white">
          {market === "KR" ? "🇰🇷 한국 (KRX)" : "🇺🇸 미국 (US)"}
        </span>
      </div>

      {/* WebSocket 상태 배지 */}
      <div className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold ${color}`}>
        <span
          className={`h-1.5 w-1.5 rounded-full bg-current ${isPulsing ? "animate-pulse-dot" : ""}`}
        />
        {label}
      </div>
    </div>
  );
}
