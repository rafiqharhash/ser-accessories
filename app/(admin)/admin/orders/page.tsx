import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/order.model";
import Link from "next/link";
import { Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Force dynamic to ensure orders are always up-to-date
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = (await searchParams).q as string;
  
  await connectToDatabase();

  // Search by orderNumber or phone
  const filter = query
    ? {
        $or: [
          { orderNumber: { $regex: query, $options: "i" } },
          { phone: { $regex: query, $options: "i" } },
        ],
      }
    : {};

  // Find orders, sort by newest first. Limit to 100 for this iteration (Pagination would be standard here).
  const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(100).lean();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "preparing": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "shipped": return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      case "returned": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "verified": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "refunded": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-playfair">Orders Management</h1>
      </div>

      <div className="bg-background border border-border rounded-lg shadow-sm">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
          <form className="relative w-72 flex gap-2" method="GET">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              name="q"
              placeholder="Search by Order # or Phone..." 
              className="pl-9 bg-background h-9"
              defaultValue={query || ""}
            />
            <Button type="submit" size="sm" variant="secondary" className="h-9">Search</Button>
          </form>
          <div className="text-sm text-muted-foreground font-medium">
            Showing latest 100 orders
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                orders.map((order: any) => (
                  <tr key={order._id.toString()} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{order.customerName}</div>
                      <div className="text-muted-foreground text-xs">{order.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      EGP {order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.orderStatus)} capitalize`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentColor(order.paymentStatus)} capitalize`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/orders/${order._id}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
                        <Eye className="w-4 h-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
