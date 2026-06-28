import { getGovernorateDistribution } from "@/actions/analytics.actions";
import { GovernorateChartClient } from "./GovernorateChartClient";

export async function GovernorateChartWrapper({ searchParams }: { searchParams: { start?: string; end?: string } }) {
  const data = await getGovernorateDistribution(searchParams);
  return <GovernorateChartClient data={data} />;
}
