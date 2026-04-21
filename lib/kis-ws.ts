import type { Market } from "./market-time";
import type { RealtimeQuote } from "@/types/market";
import { KR_STOCKS, US_STOCKS } from "@/data/stocks";

const WS_URL = "ws://ops.koreainvestment.com:21000";

// 한국주식 실시간 체결가 TR ID
const KR_TR_ID = "H0STCNT0";
// 해외주식 실시간 지연 체결가 TR ID
const US_TR_ID = "HDFSCNT0";

export type WsCallback = {
  onQuote: (q: RealtimeQuote) => void;
  onStatus: (s: "connecting" | "connected" | "disconnected") => void;
};

/**
 * KIS WebSocket 클라이언트.
 * - 구독 등록 / PINGPONG 응답 / Exponential Backoff 재연결을 처리한다.
 * - 컴포넌트 언마운트 시 반드시 destroy()를 호출해야 메모리 누수가 없다.
 */
export class KisWebSocket {
  private ws: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private destroyed = false;

  constructor(
    private readonly approvalKey: string,
    private readonly market: Market,
    private readonly callbacks: WsCallback,
  ) {}

  connect() {
    if (this.destroyed) return;
    this.callbacks.onStatus("connecting");

    const ws = new WebSocket(WS_URL);
    this.ws = ws;

    ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.callbacks.onStatus("connected");
      this.sendSubscriptions();
    };

    ws.onmessage = (e: MessageEvent) => {
      this.handleMessage(e.data as string);
    };

    ws.onclose = () => {
      if (this.destroyed) return;
      this.callbacks.onStatus("disconnected");
      this.scheduleReconnect();
    };

    ws.onerror = () => {
      // onerror 뒤 항상 onclose가 뒤따르므로 재연결은 onclose에서 처리.
      ws.close();
    };
  }

  private sendSubscriptions() {
    const stocks = this.market === "KR" ? KR_STOCKS : US_STOCKS;
    const trId = this.market === "KR" ? KR_TR_ID : US_TR_ID;

    for (const stock of stocks) {
      const msg = JSON.stringify({
        header: {
          approval_key: this.approvalKey,
          custtype: "P",
          tr_type: "1",
          "content-type": "utf-8",
        },
        body: {
          input: {
            tr_id: trId,
            tr_key: stock.wsKey,
          },
        },
      });
      this.ws?.send(msg);
    }
  }

  private handleMessage(raw: string) {
    // KIS 서버가 보내는 PINGPONG keepalive: 수신한 메시지를 그대로 돌려보낸다.
    if (raw.startsWith("{")) {
      try {
        const parsed = JSON.parse(raw) as { header?: { tr_id?: string } };
        if (parsed.header?.tr_id === "PINGPONG") {
          this.ws?.send(raw);
        }
      } catch {
        // JSON 파싱 실패는 무시
      }
      return;
    }

    // 실시간 데이터 포맷: "0|TR_ID|데이터건수|^-구분-데이터"
    const parts = raw.split("|");
    if (parts.length < 4 || parts[0] !== "0") return;

    const trId = parts[1];
    const fields = parts[3].split("^");

    if (trId === KR_TR_ID) {
      this.parseKrQuote(fields);
    } else if (trId === US_TR_ID) {
      this.parseUsQuote(fields);
    }
  }

  /**
   * H0STCNT0 응답 필드 인덱스 (KIS 공식 문서 기준):
   *  [0]  유가증권단축종목코드
   *  [2]  주식현재가
   *  [3]  전일대비부호 (2=상승, 5=하락, 3=보합)
   *  [4]  전일대비
   *  [5]  전일대비율
   *  [13] 누적거래량
   */
  private parseKrQuote(f: string[]) {
    if (f.length < 14) return;
    const symbol = f[0];
    const stock = KR_STOCKS.find((s) => s.symbol === symbol);
    if (!stock) return;

    const price = parseInt(f[2], 10);
    const sign = f[3]; // 2=상승, 5=하락, 3=보합
    const rawChange = parseInt(f[4], 10);
    const change = sign === "5" ? -rawChange : rawChange;
    const changePct = parseFloat(f[5]) * (sign === "5" ? -1 : 1);
    const volume = parseInt(f[13], 10);

    this.callbacks.onQuote({
      symbol,
      name: stock.name,
      price,
      change,
      changePct,
      volume,
      market: "KR",
      updatedAt: Date.now(),
    });
  }

  /**
   * HDFSCNT0 응답 필드 인덱스 (KIS 공식 문서 기준):
   *  [0]  실시간종목코드 (wsKey, e.g. "DNASAAPL")
   *  [11] 현재가
   *  [12] 대비구분
   *  [13] 전일대비
   *  [14] 등락율
   *  [20] 거래량
   */
  private parseUsQuote(f: string[]) {
    if (f.length < 21) return;
    const rtCode = f[0]; // e.g. "DNASAAPL"
    const stock = US_STOCKS.find((s) => s.wsKey === rtCode);
    if (!stock) return;

    const price = parseFloat(f[11]);
    const sign = f[12]; // 2=상승, 5=하락, 3=보합
    const rawChange = parseFloat(f[13]);
    const change = sign === "5" ? -rawChange : rawChange;
    const changePct = parseFloat(f[14]) * (sign === "5" ? -1 : 1);
    const volume = parseInt(f[20], 10);

    this.callbacks.onQuote({
      symbol: stock.symbol,
      name: stock.name,
      price,
      change,
      changePct,
      volume,
      market: "US",
      updatedAt: Date.now(),
    });
  }

  private scheduleReconnect() {
    if (this.destroyed) return;
    // Exponential Backoff: 1s, 2s, 4s, 8s, ... 최대 30s
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30_000);
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => {
      if (!this.destroyed) this.connect();
    }, delay);
  }

  /** 컴포넌트 언마운트 시 호출. 재연결 타이머와 WebSocket을 모두 정리한다. */
  destroy() {
    this.destroyed = true;
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.onclose = null; // onclose에서 재연결 스케줄 방지
      this.ws.close();
      this.ws = null;
    }
  }
}
