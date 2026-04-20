import type { Candle } from "@/types/market";

/**
 * 시드 기반 의사난수 — 빌드/SSR에서 결정적 결과가 나오도록.
 * Mulberry32.
 */
export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function formatDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = `${d.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${d.getUTCDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type GenOptions = {
  seed?: number;
  days?: number;
  start?: number;
  /** 추세: >0 상승, <0 하락 */
  drift?: number;
  /** 변동성 (0.005 ~ 0.05 권장) */
  volatility?: number;
  /** 기준 종료일 */
  endDate?: Date;
};

/**
 * 랜덤 워크 기반 캔들 생성기.
 */
export function generateCandles({
  seed = 42,
  days = 180,
  start = 50_000,
  drift = 0.0005,
  volatility = 0.018,
  endDate = new Date("2026-04-18T00:00:00Z"),
}: GenOptions = {}): Candle[] {
  const rnd = mulberry32(seed);
  const candles: Candle[] = [];
  let price = start;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setUTCDate(d.getUTCDate() - i);
    const dow = d.getUTCDay();
    if (dow === 0 || dow === 6) continue; // 주말 스킵

    const shock = (rnd() - 0.5) * 2 * volatility;
    const move = drift + shock;
    const open = price;
    const close = Math.max(1, open * (1 + move));
    const range = Math.abs(open - close) + open * volatility * (0.3 + rnd() * 0.6);
    const high = Math.max(open, close) + range * rnd() * 0.6;
    const low = Math.min(open, close) - range * rnd() * 0.6;
    const volume = Math.round(300_000 + rnd() * 2_500_000);

    candles.push({
      time: formatDate(d),
      open: round(open),
      high: round(high),
      low: round(Math.max(1, low)),
      close: round(close),
      volume,
    });
    price = close;
  }

  return candles;
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * 주어진 "형상 함수" f(x) ∈ [-1,1]를 가격에 겹쳐 합성 시리즈를 만든다.
 * 패턴 도감에서 시각적으로 명확한 차트를 만들기 위함.
 */
export function shapedCandles(
  shape: (x: number) => number,
  opts: GenOptions & { amplitude?: number } = {},
): Candle[] {
  const {
    seed = 7,
    days = 120,
    start = 100,
    volatility = 0.01,
    amplitude = 0.35,
    endDate = new Date("2026-04-18T00:00:00Z"),
  } = opts;

  const rnd = mulberry32(seed);
  const candles: Candle[] = [];

  let idx = 0;
  const tradingDays: Date[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setUTCDate(d.getUTCDate() - i);
    const dow = d.getUTCDay();
    if (dow === 0 || dow === 6) continue;
    tradingDays.push(d);
  }

  let prevClose = start;
  for (const d of tradingDays) {
    const x = idx / Math.max(1, tradingDays.length - 1);
    const target = start * (1 + shape(x) * amplitude);
    // 노이즈를 섞되 target에 서서히 수렴
    const mix = prevClose * 0.45 + target * 0.55;
    const noise = (rnd() - 0.5) * 2 * volatility * mix;
    const close = Math.max(1, mix + noise);
    const open = prevClose;
    const hiBase = Math.max(open, close);
    const loBase = Math.min(open, close);
    const high = hiBase + Math.abs(noise) * (0.8 + rnd() * 0.8);
    const low = Math.max(1, loBase - Math.abs(noise) * (0.8 + rnd() * 0.8));
    const volume = Math.round(400_000 + rnd() * 1_800_000);

    candles.push({
      time: formatDate(d),
      open: round(open),
      high: round(high),
      low: round(low),
      close: round(close),
      volume,
    });
    prevClose = close;
    idx++;
  }
  return candles;
}
