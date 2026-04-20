"use client";

import { useEffect, useRef } from "react";
import {
  AreaSeries,
  CandlestickSeries,
  HistogramSeries,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import type { Candle } from "@/types/market";

type Props = {
  data: Candle[];
  /** candlestick 또는 area */
  type?: "candles" | "area";
  /** 거래량 서브패널 표시 */
  showVolume?: boolean;
  /** 차트 높이(px) — className으로 반응형 높이를 주면 생략 가능 */
  height?: number;
  /** 차트 제목 (패턴 이름 등) */
  title?: string;
  /** 가격축 숨김 (프리뷰 전용 미니차트에서 사용) */
  minimal?: boolean;
  /** 반응형 높이용 추가 className (예: "h-64 sm:h-80 lg:h-96") */
  className?: string;
};

function toTime(yyyyMmDd: string): UTCTimestamp {
  return (Date.parse(`${yyyyMmDd}T00:00:00Z`) / 1000) as UTCTimestamp;
}

export default function CandleChart({
  data,
  type = "candles",
  showVolume = true,
  height,
  title,
  minimal = false,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      autoSize: true,
      layout: {
        background: { color: "transparent" },
        textColor: "#9aa7b8",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto",
      },
      grid: {
        vertLines: { color: minimal ? "transparent" : "rgba(42, 52, 71, 0.35)" },
        horzLines: { color: minimal ? "transparent" : "rgba(42, 52, 71, 0.35)" },
      },
      rightPriceScale: {
        borderColor: "rgba(42, 52, 71, 0.6)",
        visible: !minimal,
      },
      timeScale: {
        borderColor: "rgba(42, 52, 71, 0.6)",
        timeVisible: false,
        visible: !minimal,
      },
      crosshair: {
        mode: minimal ? 0 : 1,
        vertLine: {
          color: "rgba(16, 185, 129, 0.35)",
          labelBackgroundColor: "#059669",
        },
        horzLine: {
          color: "rgba(16, 185, 129, 0.35)",
          labelBackgroundColor: "#059669",
        },
      },
      handleScale: !minimal,
      handleScroll: !minimal,
    });

    chartRef.current = chart;

    let mainSeries:
      | ISeriesApi<"Candlestick">
      | ISeriesApi<"Area">;

    if (type === "area") {
      mainSeries = chart.addSeries(AreaSeries, {
        topColor: "rgba(16, 185, 129, 0.4)",
        bottomColor: "rgba(16, 185, 129, 0.0)",
        lineColor: "#10b981",
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: !minimal,
      });
      mainSeries.setData(
        data.map((c) => ({ time: toTime(c.time), value: c.close })),
      );
    } else {
      mainSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderUpColor: "#22c55e",
        borderDownColor: "#ef4444",
        wickUpColor: "#4ade80",
        wickDownColor: "#f87171",
        priceLineVisible: false,
      });
      mainSeries.setData(
        data.map((c) => ({
          time: toTime(c.time),
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        })),
      );
    }

    if (showVolume && !minimal) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: "volume" },
        priceScaleId: "vol",
        color: "#374151",
      });
      chart.priceScale("vol").applyOptions({
        scaleMargins: { top: 0.78, bottom: 0 },
      });
      volumeSeries.setData(
        data.map((c) => ({
          time: toTime(c.time),
          value: c.volume,
          color:
            c.close >= c.open
              ? "rgba(34, 197, 94, 0.45)"
              : "rgba(239, 68, 68, 0.45)",
        })),
      );
    }

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
      chartRef.current = null;
    };
  }, [data, type, showVolume, minimal]);

  return (
    <div className="relative w-full">
      {title && (
        <div className="absolute left-3 top-2 z-10 rounded-md bg-black/40 px-2 py-1 text-xs text-[color:var(--color-fg-secondary)] backdrop-blur">
          {title}
        </div>
      )}
      <div
        ref={containerRef}
        style={height !== undefined ? { height } : undefined}
        className={`w-full ${className ?? ""}`}
      />
    </div>
  );
}
