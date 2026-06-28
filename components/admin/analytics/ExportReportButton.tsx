"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useSearchParams } from "next/navigation";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { getRevenueChartData, getTopProducts, getGovernorateDistribution } from "@/actions/analytics.actions";

export function ExportReportButton() {
  const searchParams = useSearchParams();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const params = { start: searchParams.get("start") || "", end: searchParams.get("end") || "" };
      
      // Fetch fresh data for export
      const [revenueData, topProducts, governorateData] = await Promise.all([
        getRevenueChartData(params),
        getTopProducts(params, 50),
        getGovernorateDistribution(params)
      ]);

      const wb = XLSX.utils.book_new();

      // Sheet 1: Revenue
      const wsRevenue = XLSX.utils.json_to_sheet(revenueData);
      XLSX.utils.book_append_sheet(wb, wsRevenue, "Revenue Over Time");

      // Sheet 2: Top Products
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const productRows = topProducts.map((p: any) => ({
        "Product Name": p.name,
        "SKU/Slug": p.slug,
        "Units Sold": p.unitsSold,
        "Total Revenue (EGP)": p.revenue
      }));
      const wsProducts = XLSX.utils.json_to_sheet(productRows);
      XLSX.utils.book_append_sheet(wb, wsProducts, "Top Products");

      // Sheet 3: Governorates
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const govRows = governorateData.map((g: any) => ({
        "Governorate": g.governorate,
        "Total Orders": g.orders,
        "Total Revenue (EGP)": g.revenue
      }));
      const wsGovs = XLSX.utils.json_to_sheet(govRows);
      XLSX.utils.book_append_sheet(wb, wsGovs, "Governorate Sales");

      // Download
      const fileName = `SER_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      // Log audit
      // We don't have a direct log action exposed simply, so we'll just log it silently or skip the UI block if it fails
      
      toast.success("Excel report exported successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export report");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleExport} disabled={isExporting}>
      <Download className="w-4 h-4 mr-2" />
      {isExporting ? "Generating..." : "Export Excel"}
    </Button>
  );
}
