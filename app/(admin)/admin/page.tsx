import { Suspense } from "react";
import { DateRangePicker } from "@/components/admin/analytics/DateRangePicker";
import { ExportReportButton } from "@/components/admin/analytics/ExportReportButton";
import { KPICards } from "@/components/admin/analytics/KPICards";
import { RevenueChartWrapper } from "@/components/admin/analytics/RevenueChartWrapper";
import { GovernorateChartWrapper } from "@/components/admin/analytics/GovernorateChartWrapper";
import { TopProductsTable } from "@/components/admin/analytics/TopProductsTable";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage({ searchParams }: { searchParams: { start?: string; end?: string } }) {
  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-playfair mb-1">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time business intelligence and store metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker />
          <ExportReportButton />
        </div>
      </div>

      {/* KPIs Streamed Independently */}
      <Suspense fallback={
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      }>
        <KPICards searchParams={searchParams} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Revenue Chart Streamed */}
        <div className="lg:col-span-4">
          <Suspense fallback={<Skeleton className="h-[450px] w-full rounded-xl" />}>
            <RevenueChartWrapper searchParams={searchParams} />
          </Suspense>
        </div>

        {/* Governorates Streamed */}
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-[450px] w-full rounded-xl" />}>
            <GovernorateChartWrapper searchParams={searchParams} />
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Top Products Streamed */}
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-xl" />}>
            <TopProductsTable searchParams={searchParams} />
          </Suspense>
        </div>
        
        {/* Empty Placeholder for Future Widgets (e.g., Coupon Usage) */}
        <div className="lg:col-span-2 space-y-6">
           {/* Add low stock or other widgets here later */}
        </div>
      </div>
    </div>
  );
}
