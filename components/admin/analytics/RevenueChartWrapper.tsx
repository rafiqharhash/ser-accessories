import { getRevenueChartData } from "@/actions/analytics.actions";
import { RevenueChartClient } from "./RevenueChartClient";

export async function RevenueChartWrapper({ searchParams }: { searchParams: { start?: string; end?: string } }) {
  const data = await getRevenueChartData(searchParams);
  return <RevenueChartClient data={data} />;
}
