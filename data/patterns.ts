import type { ChartPattern } from "@/types/market";
import { shapedCandles } from "@/lib/mockSeries";

const TAU = Math.PI * 2;

/**
 * 각 패턴의 형태를 0~1 사이의 x에 대해 -1~1 사이의 값으로 정의한다.
 * 실제 가격은 base * (1 + shape(x) * amplitude) 로 합성됨.
 */

function headAndShoulders(x: number): number {
  // 좌 어깨 - 고점 - 우 어깨 - 넥라인 하향 이탈
  if (x < 0.15) return lerp(x / 0.15, -0.4, 0.1);
  if (x < 0.25) return lerp((x - 0.15) / 0.1, 0.1, 0.45); // 좌 어깨 피크
  if (x < 0.35) return lerp((x - 0.25) / 0.1, 0.45, 0.15); // 하락
  if (x < 0.5) return lerp((x - 0.35) / 0.15, 0.15, 0.75); // 머리 피크
  if (x < 0.65) return lerp((x - 0.5) / 0.15, 0.75, 0.15);
  if (x < 0.78) return lerp((x - 0.65) / 0.13, 0.15, 0.42); // 우 어깨
  if (x < 0.88) return lerp((x - 0.78) / 0.1, 0.42, 0.05);
  return lerp((x - 0.88) / 0.12, 0.05, -0.7); // 넥라인 이탈
}

function inverseHeadAndShoulders(x: number): number {
  return -headAndShoulders(x);
}

function doubleTop(x: number): number {
  if (x < 0.1) return lerp(x / 0.1, -0.4, 0.0);
  if (x < 0.3) return lerp((x - 0.1) / 0.2, 0.0, 0.65); // 1차 고점
  if (x < 0.5) return lerp((x - 0.3) / 0.2, 0.65, 0.15); // 골
  if (x < 0.7) return lerp((x - 0.5) / 0.2, 0.15, 0.62); // 2차 고점
  if (x < 0.85) return lerp((x - 0.7) / 0.15, 0.62, 0.0);
  return lerp((x - 0.85) / 0.15, 0.0, -0.75); // 하향 이탈
}

function doubleBottom(x: number): number {
  return -doubleTop(x);
}

function cupAndHandle(x: number): number {
  // 좌측 컵 테두리 - 완만한 U - 우측 컵 테두리 - 작은 손잡이 하락 - 돌파
  if (x < 0.05) return lerp(x / 0.05, -0.1, 0.35);
  if (x < 0.55) {
    // U 모양 (cos 반주기)
    const t = (x - 0.05) / 0.5;
    const u = -Math.cos(t * Math.PI);
    return 0.35 * (1 - (1 - u) * 0.9) - 0.25 * (1 - u * 0.5);
  }
  if (x < 0.7) return lerp((x - 0.55) / 0.15, 0.3, 0.38); // 오른쪽 컵 라인
  if (x < 0.85) return lerp((x - 0.7) / 0.15, 0.38, 0.18); // 손잡이
  return lerp((x - 0.85) / 0.15, 0.18, 0.8); // 돌파
}

function ascendingTriangle(x: number): number {
  // 상단 저항선 수평, 하단 지지선 상승, 마지막 돌파
  const resistance = 0.5;
  const support = lerp(x, -0.5, 0.4);
  const wobble = Math.sin(x * TAU * 3) * (resistance - support) * 0.5;
  const mid = (resistance + support) / 2 + wobble;
  if (x > 0.88) return lerp((x - 0.88) / 0.12, mid, 0.85);
  return mid;
}

function descendingTriangle(x: number): number {
  return -ascendingTriangle(x);
}

function bullFlag(x: number): number {
  // 급등 폴대 → 약한 하락 채널 → 재돌파
  if (x < 0.3) return lerp(x / 0.3, -0.4, 0.6); // 깃대 (강한 상승)
  if (x < 0.75) {
    // 완만한 하락 깃발 (노이즈 진폭 안쪽)
    const t = (x - 0.3) / 0.45;
    return lerp(t, 0.6, 0.3);
  }
  return lerp((x - 0.75) / 0.25, 0.3, 0.9); // 돌파
}

function bearFlag(x: number): number {
  return -bullFlag(x);
}

function risingWedge(x: number): number {
  // 상승 쐐기 (두 선 모두 상승하지만 수렴) → 하향 이탈
  const upper = lerp(x, 0.0, 0.55);
  const lower = lerp(x, -0.5, 0.45);
  const mid = (upper + lower) / 2 + Math.sin(x * TAU * 4) * (upper - lower) * 0.4;
  if (x > 0.85) return lerp((x - 0.85) / 0.15, mid, -0.5);
  return mid;
}

function fallingWedge(x: number): number {
  const upper = lerp(x, 0.5, -0.45);
  const lower = lerp(x, 0.0, -0.55);
  const mid = (upper + lower) / 2 + Math.sin(x * TAU * 4) * (upper - lower) * 0.4;
  if (x > 0.85) return lerp((x - 0.85) / 0.15, mid, 0.55);
  return mid;
}

function lerp(t: number, a: number, b: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

export const PATTERNS: ChartPattern[] = [
  {
    slug: "head-and-shoulders",
    name: "Head and Shoulders",
    nameKo: "헤드앤숄더",
    kind: ["bearish", "reversal"],
    summary: "상승 추세의 끝을 알리는 대표적인 하락 반전 패턴",
    description:
      "세 개의 고점이 가운데(머리)가 가장 높고 양 옆(어깨)이 비슷한 높이를 보이는 모양입니다. 두 저점을 잇는 넥라인(neckline)을 하향 이탈할 때 패턴이 완성되며, 상승 추세에서 하락 추세로 전환되는 신호로 해석됩니다.",
    reliability: 4,
    formationDays: [40, 120],
    direction: "down",
    keyPoints: [
      "머리는 좌/우 어깨보다 명확히 높아야 함",
      "넥라인 이탈 시 거래량 증가 동반",
      "목표가 ≈ 머리 - 넥라인 구간만큼 하락",
    ],
    series: shapedCandles(headAndShoulders, { seed: 11, start: 100, amplitude: 0.32 }),
  },
  {
    slug: "inverse-head-and-shoulders",
    name: "Inverse Head and Shoulders",
    nameKo: "역헤드앤숄더",
    kind: ["bullish", "reversal"],
    summary: "하락 추세의 바닥을 알리는 상승 반전 패턴",
    description:
      "헤드앤숄더를 뒤집은 형태로, 가운데 저점이 가장 낮습니다. 넥라인 저항을 돌파하면 상승 추세 전환 신호입니다.",
    reliability: 4,
    formationDays: [40, 120],
    direction: "up",
    keyPoints: [
      "저점 3개 중 가운데가 가장 낮아야 함",
      "넥라인 돌파 시 거래량 급증 필요",
      "목표가 ≈ 넥라인 + (넥라인 - 머리) 폭",
    ],
    series: shapedCandles(inverseHeadAndShoulders, { seed: 12, start: 100, amplitude: 0.32 }),
  },
  {
    slug: "double-top",
    name: "Double Top",
    nameKo: "이중천정 (쌍봉)",
    kind: ["bearish", "reversal"],
    summary: "두 번의 고점 시도 후 하락 전환되는 패턴",
    description:
      "비슷한 높이의 두 고점과 사이의 골짜기로 구성됩니다. 골짜기 저점(지지선)을 하향 이탈하면 추세 전환이 확정됩니다.",
    reliability: 4,
    formationDays: [20, 80],
    direction: "down",
    keyPoints: [
      "두 고점의 높이는 ±3% 이내여야 함",
      "지지선 이탈 거래량이 형성 중 거래량 대비 증가",
      "목표가 ≈ 지지선 - (고점 - 지지선)",
    ],
    series: shapedCandles(doubleTop, { seed: 13, start: 100, amplitude: 0.3 }),
  },
  {
    slug: "double-bottom",
    name: "Double Bottom",
    nameKo: "이중바닥 (쌍바닥)",
    kind: ["bullish", "reversal"],
    summary: "두 번의 저점 시도 후 상승 전환되는 패턴",
    description:
      "비슷한 깊이의 두 저점과 사이의 반등 고점으로 구성됩니다. 반등 고점(저항선)을 상향 돌파하면 상승 전환입니다.",
    reliability: 4,
    formationDays: [20, 80],
    direction: "up",
    keyPoints: [
      "두 저점이 유사한 가격대에 형성",
      "두 번째 저점에서 거래량 감소가 이상적",
      "저항선 돌파 이후 지지선으로 재시험되는 경우 많음",
    ],
    series: shapedCandles(doubleBottom, { seed: 14, start: 100, amplitude: 0.3 }),
  },
  {
    slug: "cup-and-handle",
    name: "Cup and Handle",
    nameKo: "컵앤핸들",
    kind: ["bullish", "continuation"],
    summary: "U자형 컵과 짧은 조정(손잡이) 이후 상승 지속",
    description:
      "완만한 U자 곡선(컵) 이후 소폭 하락(손잡이)이 형성되고, 컵의 저항선을 돌파하면서 추세가 이어집니다. 윌리엄 오닐이 제시한 대표적 상승 지속 패턴.",
    reliability: 3,
    formationDays: [40, 180],
    direction: "up",
    keyPoints: [
      "컵 깊이는 직전 상승 폭의 12~33% 권장",
      "손잡이는 컵 높이의 1/3 이내 조정",
      "돌파 시 대량 거래 동반 필요",
    ],
    series: shapedCandles(cupAndHandle, { seed: 15, start: 100, amplitude: 0.35 }),
  },
  {
    slug: "ascending-triangle",
    name: "Ascending Triangle",
    nameKo: "상승 삼각형",
    kind: ["bullish", "continuation"],
    summary: "저점이 점점 높아지고 고점이 수평으로 수렴 후 상방 돌파",
    description:
      "수평 저항선과 상승하는 지지선이 만나는 수렴 패턴. 매수세가 점차 강해지며 수평 저항을 돌파할 때 강한 상승이 발생합니다.",
    reliability: 3,
    formationDays: [15, 60],
    direction: "up",
    keyPoints: [
      "두 번 이상 터치된 수평 저항선 필요",
      "상승하는 지지 추세선 확인",
      "돌파 시점 거래량 급증",
    ],
    series: shapedCandles(ascendingTriangle, { seed: 16, start: 100, amplitude: 0.3 }),
  },
  {
    slug: "descending-triangle",
    name: "Descending Triangle",
    nameKo: "하락 삼각형",
    kind: ["bearish", "continuation"],
    summary: "고점이 점점 낮아지고 저점이 수평으로 수렴 후 하방 이탈",
    description:
      "수평 지지선과 하락하는 저항선이 만나는 패턴. 지지선이 무너지는 순간 하락 추세가 가속됩니다.",
    reliability: 3,
    formationDays: [15, 60],
    direction: "down",
    keyPoints: [
      "수평 지지선이 여러 번 테스트되어야 함",
      "고점이 계단식으로 낮아지는지 확인",
      "이탈 후 되돌림 재시험 발생 빈번",
    ],
    series: shapedCandles(descendingTriangle, { seed: 17, start: 100, amplitude: 0.3 }),
  },
  {
    slug: "bull-flag",
    name: "Bull Flag",
    nameKo: "상승 깃발형",
    kind: ["bullish", "continuation"],
    summary: "급등 후 완만한 하락 조정, 다시 상승 재개",
    description:
      "강한 상승(깃대) 이후 짧은 기간 동안 평행 채널의 조정(깃발)이 나타나고, 다시 상방 돌파되는 단기 상승 지속 패턴입니다.",
    reliability: 3,
    formationDays: [5, 20],
    direction: "up",
    keyPoints: [
      "깃대 구간의 거래량이 뚜렷이 많음",
      "조정 기간은 깃대 대비 짧아야 함",
      "돌파 목표 ≈ 깃대 상승폭 복제",
    ],
    series: shapedCandles(bullFlag, { seed: 18, start: 100, amplitude: 0.35 }),
  },
  {
    slug: "bear-flag",
    name: "Bear Flag",
    nameKo: "하락 깃발형",
    kind: ["bearish", "continuation"],
    summary: "급락 후 짧은 반등 조정, 다시 하락 재개",
    description:
      "급락(깃대) 이후 완만한 상승 채널(깃발)이 형성되고, 다시 하방 이탈하며 하락이 이어지는 단기 하락 지속 패턴입니다.",
    reliability: 3,
    formationDays: [5, 20],
    direction: "down",
    keyPoints: [
      "깃대 하락폭이 명확해야 함",
      "조정 중 거래량 감소 확인",
      "이탈 목표 ≈ 깃대 하락폭 복제",
    ],
    series: shapedCandles(bearFlag, { seed: 19, start: 100, amplitude: 0.35 }),
  },
  {
    slug: "rising-wedge",
    name: "Rising Wedge",
    nameKo: "상승 쐐기형",
    kind: ["bearish", "reversal"],
    summary: "두 선이 모두 상승하지만 고점이 약해지는 약세 쐐기",
    description:
      "지지선과 저항선이 모두 상승하지만 저항선의 기울기가 완만해져 결국 하향 이탈이 발생하는 약세 반전 패턴입니다.",
    reliability: 3,
    formationDays: [15, 60],
    direction: "down",
    keyPoints: [
      "상승 폭이 점차 줄어드는 양상",
      "거래량은 점차 감소",
      "이탈 시 급락 가능성 높음",
    ],
    series: shapedCandles(risingWedge, { seed: 20, start: 100, amplitude: 0.3 }),
  },
  {
    slug: "falling-wedge",
    name: "Falling Wedge",
    nameKo: "하락 쐐기형",
    kind: ["bullish", "reversal"],
    summary: "두 선이 모두 하락하지만 저점이 덜 내려가는 강세 쐐기",
    description:
      "지지선과 저항선이 하락하지만 지지선이 점차 완만해져 상승 반전하는 패턴입니다. 하락 추세 끝에서 자주 관찰됩니다.",
    reliability: 3,
    formationDays: [15, 60],
    direction: "up",
    keyPoints: [
      "하락 각도가 점차 완만해짐",
      "돌파 시 거래량 급증",
      "반전 초기 매수 기회로 활용",
    ],
    series: shapedCandles(fallingWedge, { seed: 21, start: 100, amplitude: 0.3 }),
  },
];

export function findPattern(slug: string): ChartPattern | undefined {
  return PATTERNS.find((p) => p.slug === slug);
}
