import { create } from "zustand";
import type { RealtimeQuote } from "@/types/market";
import type { Market } from "@/lib/market-time";

export type WsStatus = "idle" | "connecting" | "connected" | "disconnected" | "demo";

interface MarketState {
  market: Market;
  quotes: Record<string, RealtimeQuote>;
  wsStatus: WsStatus;

  setMarket: (m: Market) => void;
  /** 단일 종목 시세를 업데이트. 객체 스프레드로 다른 종목 시세 보존. */
  updateQuote: (q: RealtimeQuote) => void;
  setWsStatus: (s: WsStatus) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  market: "KR",
  quotes: {},
  wsStatus: "idle",

  setMarket: (market) => set({ market }),
  updateQuote: (q) =>
    set((state) => ({ quotes: { ...state.quotes, [q.symbol]: q } })),
  setWsStatus: (wsStatus) => set({ wsStatus }),
}));
