export type Candle = {
  /** YYYY-MM-DD */
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type StockSummary = {
  symbol: string;
  name: string;
  exchange: "KOSPI" | "KOSDAQ" | "NASDAQ" | "NYSE";
  price: number;
  change: number;
  changePct: number;
  volume: number;
  marketCap?: string;
};

export type PatternKind = "bullish" | "bearish" | "continuation" | "reversal";

export type ChartPattern = {
  slug: string;
  name: string;
  nameKo: string;
  kind: PatternKind[];
  summary: string;
  description: string;
  /** 신뢰도 0-5 */
  reliability: number;
  /** 형성 기간(일) 범위 */
  formationDays: [number, number];
  /** 패턴 완성 후 기대 방향 */
  direction: "up" | "down" | "either";
  /** 간단한 매매 가이드 포인트 */
  keyPoints: string[];
  /** 예시 차트 시리즈 (합성 데이터) */
  series: Candle[];
};

/** WebSocket 실시간 체결 시세 */
export type RealtimeQuote = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  volume: number;
  market: "KR" | "US";
  updatedAt: number;
};
