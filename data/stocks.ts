import type { StockSummary } from "@/types/market";
import { generateCandles } from "@/lib/mockSeries";

/**
 * KIS API 연동 전 사용하는 mock 종목 리스트.
 * 실데이터 연결 후에도 UI 시드 데이터로 재사용 가능.
 */
export const MOCK_STOCKS: StockSummary[] = [
  {
    symbol: "005930",
    name: "삼성전자",
    exchange: "KOSPI",
    price: 78_400,
    change: 1_200,
    changePct: 1.55,
    volume: 13_482_300,
    marketCap: "467조",
  },
  {
    symbol: "000660",
    name: "SK하이닉스",
    exchange: "KOSPI",
    price: 214_500,
    change: -3_500,
    changePct: -1.61,
    volume: 4_112_900,
    marketCap: "156조",
  },
  {
    symbol: "035420",
    name: "NAVER",
    exchange: "KOSPI",
    price: 201_000,
    change: 2_500,
    changePct: 1.26,
    volume: 892_100,
    marketCap: "32조",
  },
  {
    symbol: "373220",
    name: "LG에너지솔루션",
    exchange: "KOSPI",
    price: 352_000,
    change: -4_000,
    changePct: -1.12,
    volume: 411_200,
    marketCap: "82조",
  },
  {
    symbol: "207940",
    name: "삼성바이오로직스",
    exchange: "KOSPI",
    price: 948_000,
    change: 14_000,
    changePct: 1.50,
    volume: 74_600,
    marketCap: "67조",
  },
  {
    symbol: "068270",
    name: "셀트리온",
    exchange: "KOSPI",
    price: 182_300,
    change: 900,
    changePct: 0.50,
    volume: 1_220_500,
    marketCap: "38조",
  },
  {
    symbol: "035720",
    name: "카카오",
    exchange: "KOSPI",
    price: 43_150,
    change: -350,
    changePct: -0.80,
    volume: 3_018_700,
    marketCap: "19조",
  },
  {
    symbol: "086520",
    name: "에코프로",
    exchange: "KOSDAQ",
    price: 118_200,
    change: 3_200,
    changePct: 2.78,
    volume: 1_842_900,
    marketCap: "31조",
  },
];

export const TRENDING_SYMBOLS = MOCK_STOCKS.slice(0, 6);

/**
 * 종목별 기본 캔들 데이터. 시드를 고정해 SSR에서도 동일하게 렌더.
 */
export function getSeriesForSymbol(symbol: string, days = 180) {
  const idx = MOCK_STOCKS.findIndex((s) => s.symbol === symbol);
  const base = MOCK_STOCKS[idx] ?? MOCK_STOCKS[0];
  // 종목의 부호/크기에 따라 drift 조정
  const drift = base.changePct >= 0 ? 0.0008 : -0.0004;
  return generateCandles({
    seed: parseInt(base.symbol, 10) % 100_000,
    days,
    start: base.price * 0.82,
    drift,
    volatility: 0.02,
  });
}

export function findStock(symbol: string): StockSummary | undefined {
  return MOCK_STOCKS.find((s) => s.symbol === symbol);
}
