export type Market = "KR" | "US";

/**
 * 서버/클라이언트 모두에서 안전하게 현재 KST 시각을 구한다.
 * Date.getUTCHours()로 읽으면 시스템 로케일 영향을 받지 않는다.
 */
export function getNowKST(): Date {
  return new Date(Date.now() + 9 * 60 * 60 * 1000);
}

/**
 * KST 기준 활성 시장을 결정한다.
 *   09:00 ~ 16:59  →  "KR"  (한국 정규장)
 *   17:00 ~ 08:59  →  "US"  (미국 프리/정규/애프터마켓)
 */
export function getActiveMarket(): Market {
  const kst = getNowKST();
  const totalMinutes = kst.getUTCHours() * 60 + kst.getUTCMinutes();
  // 09:00 = 540, 17:00 = 1020
  return totalMinutes >= 540 && totalMinutes < 1020 ? "KR" : "US";
}
