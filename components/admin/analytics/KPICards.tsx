import { getRevenueKPIs } from "@/actions/analytics.actions";
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingBag, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Trend = ({ growth }: { growth: number }) => {
  if (growth === 0) return <span className="text-muted-foreground text-xs ml-2">No change</span>;
  const isPositive = growth > 0;
  return (
    <span className={`text-xs ml-2 flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
      {Math.abs(growth).toFixed(1)}%
    </span>
  );
};

export async function KPICards({ searchParams }: { searchParams: { start?: string; end?: string } }) {
  const data = await getRevenueKPIs(searchParams);

  const formatCurrency = (val: number) => `EGP ${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(data.revenue.value)}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            vs previous period <Trend growth={data.revenue.growth} />
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orders</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.orders.value.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            vs previous period <Trend growth={data.orders.growth} />
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(data.aov.value)}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            vs previous period <Trend growth={data.aov.growth} />
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
