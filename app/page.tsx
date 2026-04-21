import { getActiveMarket } from "@/lib/market-time";
import WsDashboard from "@/components/dashboard/WsDashboard";

export default function Home() {
  // 서버에서 KST 기준으로 시장을 결정해 클라이언트에 전달 → 초기 렌더 깜빡임 방지
  const market = getActiveMarket();
  return <WsDashboard initialMarket={market} />;
}
