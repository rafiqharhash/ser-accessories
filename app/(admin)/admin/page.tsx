import { getDashboardStats } from "@/actions/dashboard.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Package, AlertTriangle, XOctagon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* KPI Cards Row 1 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">EGP {stats.todaysRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Updated live</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Orders</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todaysOrdersCount}</div>
            <p className="text-xs text-muted-foreground">Orders placed since midnight</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrdersCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Out of Stock</CardTitle>
            <XOctagon className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.outOfStockCount}</div>
            <p className="text-xs text-muted-foreground">Products requiring restock</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Latest Orders Table */}
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Latest Orders</CardTitle>
            <Link href="/admin/orders" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {stats.latestOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent orders.</p>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                stats.latestOrders.map((order: any) => (
                  <div key={order._id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customerName}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium">EGP {order.total}</div>
                      <div className={`text-xs px-2 py-1 rounded-full border ${order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-muted text-muted-foreground'}`}>
                        {order.orderStatus}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Warnings */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" /> Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-destructive mb-3">Out of Stock ({stats.outOfStockCount})</h4>
                {stats.outOfStockProducts.length === 0 ? (
                  <p className="text-xs text-muted-foreground">All products have stock.</p>
                ) : (
                  <div className="space-y-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {stats.outOfStockProducts.map((p: any) => (
                      <div key={p._id} className="flex justify-between text-sm">
                        <span className="truncate pr-4">{p.name}</span>
                        <span className="text-destructive font-semibold">0</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-orange-600 mb-3">Low Stock ({stats.lowStockCount})</h4>
                {stats.lowStockProducts.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No low stock warnings.</p>
                ) : (
                  <div className="space-y-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {stats.lowStockProducts.map((p: any) => (
                      <div key={p._id} className="flex justify-between text-sm">
                        <span className="truncate pr-4">{p.name}</span>
                        <span className="text-orange-600 font-semibold">{p.stockMode === 'single' ? p.stock : 'Var.'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
}
