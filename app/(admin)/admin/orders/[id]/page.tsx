import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/order.model";
import { OrderManagementControls } from "@/components/admin/orders/OrderManagementControls";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, User, Calendar, Receipt } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  await connectToDatabase();
  const order = await Order.findById(id).lean();

  if (!order) {
    return <div className="p-8">Order not found.</div>;
  }

  // Convert for serialization
  const safeOrder = JSON.parse(JSON.stringify(order));

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto printable-area">
      <Link href="/admin/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 no-print">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Details & Items */}
        <div className="flex-grow space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background p-6 rounded-lg border border-border shadow-sm">
            <div>
              <h1 className="text-2xl font-bold font-mono">Order {safeOrder.orderNumber}</h1>
              <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" /> {new Date(safeOrder.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase border ${
                safeOrder.orderStatus === "delivered" ? "bg-green-100 text-green-800 border-green-200" :
                safeOrder.orderStatus === "cancelled" ? "bg-red-100 text-red-800 border-red-200" :
                "bg-blue-100 text-blue-800 border-blue-200"
              }`}>
                {safeOrder.orderStatus}
              </span>
            </div>
          </div>

          {/* Customer & Shipping Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Customer Info
              </h3>
              <p className="font-medium">{safeOrder.customerName}</p>
              <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                <Phone className="w-4 h-4" /> {safeOrder.phone}
              </p>
            </div>

            <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Shipping Address
              </h3>
              <p className="font-medium">{safeOrder.address}</p>
              <p className="text-muted-foreground text-sm mt-1">{safeOrder.city}, {safeOrder.governorate}</p>
              {safeOrder.notes && (
                <div className="mt-3 p-3 bg-yellow-50 text-yellow-800 rounded text-sm border border-yellow-200">
                  <strong>Notes:</strong> {safeOrder.notes}
                </div>
              )}
            </div>
          </div>

          {/* Products Snapshot */}
          <div className="bg-background border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Receipt className="w-5 h-5" /> Order Items
              </h3>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Variant</th>
                  <th className="px-6 py-3 font-medium text-right">Price</th>
                  <th className="px-6 py-3 font-medium text-right">Qty</th>
                  <th className="px-6 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {safeOrder.products.map((item: any, i: number) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-16 bg-muted rounded overflow-hidden">
                          {item.featuredImageSnapshot && (
                            <Image src={item.featuredImageSnapshot.secureUrl} alt={item.nameSnapshot} fill className="object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{item.nameSnapshot}</p>
                          <p className="text-xs text-muted-foreground font-mono">{item.skuSnapshot}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {item.selectedColor || "-"} / {item.selectedSize || "-"}
                    </td>
                    <td className="px-6 py-4 text-right">EGP {item.unitPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">{item.quantity}</td>
                    <td className="px-6 py-4 text-right font-medium">EGP {item.lineTotal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-6 bg-muted/10 border-t border-border flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>EGP {safeOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>EGP {safeOrder.shippingCost.toLocaleString()}</span>
                </div>
                {safeOrder.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>- EGP {safeOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                  <span>Grand Total</span>
                  <span>EGP {safeOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* History Log */}
          {safeOrder.history && safeOrder.history.length > 0 && (
            <div className="bg-background border border-border rounded-lg shadow-sm overflow-hidden mt-8 no-print">
              <div className="p-6 border-b border-border bg-muted/20">
                <h3 className="text-lg font-semibold">Activity History</h3>
              </div>
              <div className="p-6 space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {safeOrder.history.reverse().map((entry: any, i: number) => (
                  <div key={i} className="flex gap-4 border-l-2 border-primary pl-4 py-1">
                    <div className="text-sm text-muted-foreground w-32 flex-shrink-0">
                      {new Date(entry.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                    <div>
                      <p className="font-semibold capitalize text-sm">{entry.status}</p>
                      {entry.comment && <p className="text-sm text-muted-foreground mt-1">{entry.comment}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Controls */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <OrderManagementControls 
            orderId={safeOrder._id}
            currentStatus={safeOrder.orderStatus}
            paymentStatus={safeOrder.paymentStatus}
            paymentScreenshot={safeOrder.paymentScreenshot}
          />
        </div>
      </div>
    </div>
  );
}
