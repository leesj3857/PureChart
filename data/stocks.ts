/**
 * 한국장 대표 종목 (KRX).
 * wsKey: KIS WebSocket tr_key (H0STCNT0) — 종목코드 6자리 그대로 사용.
 */
export const KR_STOCKS = [
  { symbol: "005930", name: "삼성전자", wsKey: "005930", exchange: "KOSPI" as const },
  { symbol: "000660", name: "SK하이닉스", wsKey: "000660", exchange: "KOSPI" as const },
  { symbol: "035420", name: "NAVER", wsKey: "035420", exchange: "KOSPI" as const },
];

/**
 * 미국장 대표 종목 (NASDAQ).
 * wsKey: KIS WebSocket tr_key (HDFSCNT0) — "DNAS" + 티커 형식.
 * DNAS = NASDAQ 시장구분코드 (KIS 규격)
 */
export const US_STOCKS = [
  { symbol: "AAPL", name: "Apple", wsKey: "DNASAAPL", exchange: "NASDAQ" as const },
  { symbol: "TSLA", name: "Tesla", wsKey: "DNASTSLA", exchange: "NASDAQ" as const },
  { symbol: "MSFT", name: "Microsoft", wsKey: "DNASMSFT", exchange: "NASDAQ" as const },
];
