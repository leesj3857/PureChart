import { NextResponse } from "next/server";

export const runtime = "nodejs";

// 인메모리 캐시: approval_key는 24시간 유효하므로 캐싱.
let cachedKey: string | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 23 * 60 * 60 * 1000; // 23시간

export async function GET() {
  const appKey = process.env.KIS_APP_KEY;
  const secretKey = process.env.KIS_APP_SECRET;

  if (!appKey || !secretKey) {
    return NextResponse.json(
      { error: "KIS_APP_KEY / KIS_APP_SECRET 환경변수가 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  // 캐시 유효 시 즉시 반환
  if (cachedKey && Date.now() - cachedAt < CACHE_TTL_MS) {
    return NextResponse.json({ approval_key: cachedKey });
  }

  const res = await fetch(
    "https://openapi.koreainvestment.com:9443/oauth2/Approval",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        appkey: appKey,
        secretkey: secretKey,
      }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: `KIS approval key 발급 실패: ${res.status}` },
      { status: 502 },
    );
  }

  const data = await res.json();
  cachedKey = data.approval_key as string;
  cachedAt = Date.now();

  return NextResponse.json({ approval_key: cachedKey });
}
