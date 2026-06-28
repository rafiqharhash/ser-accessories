"use client";

import { useRouter } from "next/navigation";
import { Search, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export function AuditClient({ data }: AuditClientProps) {
  const router = useRouter();
  const { logs, total, page, totalPages } = data;

  const handleExportCSV = () => {
    // Generate CSV string from logs
    const headers = ["Timestamp", "Admin", "Action", "Resource", "ResourceID", "Details"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = logs.map((log: any) => [
      new Date(log.timestamp).toISOString(),
      log.admin,
      log.action,
      log.resource,
      log.resourceId || "",
      `"${log.details || ""}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      + rows.map((e: any) => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-playfair mb-1">Audit Logs</h1>
          <p className="text-sm text-muted-foreground">Immutable record of all administrative actions.</p>
        </div>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="bg-background p-4 border border-border rounded-lg shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              readOnly
              placeholder="Filter by Admin or Resource..." 
              className="flex h-10 w-64 rounded-md border border-input bg-background px-3 py-2 text-sm pl-9"
              title="Full text search requires Atlas Search indexing. Use the dropdown filter for now."
            />
          </div>
          <select 
            className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm"
            onChange={(e) => updateFilter("action", e.target.value)}
            defaultValue={typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("action") || "all" : "all"}
          >
            <option value="all">All Actions</option>
            <option value="CREATE_ORDER">Orders</option>
            <option value="UPDATE_PRODUCT">Products</option>
            <option value="UPDATE_SETTINGS">Settings</option>
            <option value="CREATE_COUPON">Coupons</option>
          </select>
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          Total Logs: {total}
        </div>
      </div>

      <div className="bg-background border border-border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Resource</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">No audit logs found.</td>
              </tr>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              logs.map((log: any) => (
                <tr key={log._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{log.admin}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-md text-xs font-mono bg-muted/50 border border-border text-foreground">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {log.resource} {log.resourceId && <span className="text-[10px] opacity-50 block">{log.resourceId}</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                    {log.details || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center text-sm text-muted-foreground pt-4">
          <p>Showing page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => updateFilter("page", String(page - 1))}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => updateFilter("page", String(page + 1))}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
