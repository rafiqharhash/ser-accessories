import { getOrderTrackingDetails } from "@/actions/tracking.actions";
import { CheckCircle2, Circle, Clock, Package, ShieldCheck, AlertCircle, XCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const TIMELINE_STEPS = ["pending", "confirmed", "preparing", "shipped", "delivered"];

export default async function OrderTrackingDetailsPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const result = await getOrderTrackingDetails(orderNumber);

  if (!result.success || !result.order) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-16 h-16 text-destructive mb-6" />
        <h1 className="text-3xl font-playfair mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          {result.error}
        </p>
        <Link href="/track-order" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-8">
          Try Another Order Number
        </Link>
      </div>
    );
  }

  const { order } = result;

  const currentStepIndex = TIMELINE_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === "cancelled";
  const isReturned = order.orderStatus === "returned";

  const getStatusIcon = (status: string, index: number) => {
    if (isCancelled || isReturned) {
      if (status === "pending") return <CheckCircle2 className="w-6 h-6 text-primary" />;
      return <XCircle className="w-6 h-6 text-destructive" />;
    }
    if (index < currentStepIndex) return <CheckCircle2 className="w-6 h-6 text-primary" />;
    if (index === currentStepIndex) return <Clock className="w-6 h-6 text-blue-600 animate-pulse" />;
    return <Circle className="w-6 h-6 text-muted-foreground" />;
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateString));
  };

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20 min-h-screen">
      <Link href="/track-order" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
      </Link>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-playfair mb-2">Order {order.orderNumber}</h1>
          <p className="text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full border border-border">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Payment: {order.paymentStatus.toUpperCase()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Timeline & Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tracking Timeline */}
          <div className="border border-border p-6 lg:p-10 bg-background">
            <h2 className="text-xl font-playfair mb-8">Tracking Status</h2>
            
            <div className="relative">
              {!isCancelled && !isReturned && (
                <div className="absolute left-[15px] top-[15px] bottom-[15px] w-[2px] bg-border -z-10" />
              )}
              <div className="space-y-8">
                {isCancelled || isReturned ? (
                  <>
                    <div className="flex gap-6 items-start relative bg-background">
                      <div className="bg-background">{getStatusIcon("pending", 0)}</div>
                      <div>
                        <h3 className="font-semibold text-lg capitalize">Pending</h3>
                        <p className="text-sm text-muted-foreground">Order was received.</p>
                      </div>
                    </div>
                    <div className="flex gap-6 items-start relative bg-background">
                      <div className="bg-background">{getStatusIcon(order.orderStatus, 1)}</div>
                      <div>
                        <h3 className="font-semibold text-lg text-destructive capitalize">{order.orderStatus}</h3>
                        <p className="text-sm text-muted-foreground">This order has been {order.orderStatus}.</p>
                      </div>
                    </div>
                  </>
                ) : (
                  TIMELINE_STEPS.map((step, idx) => (
                    <div key={step} className="flex gap-6 items-start relative bg-background">
                      <div className="bg-background">{getStatusIcon(step, idx)}</div>
                      <div className={idx > currentStepIndex ? "opacity-50" : ""}>
                        <h3 className="font-semibold text-lg capitalize">{step}</h3>
                        {idx === currentStepIndex && (
                          <p className="text-sm text-muted-foreground mt-1">Currently being processed by our team.</p>
                        )}
                        {idx < currentStepIndex && (
                          <p className="text-sm text-muted-foreground mt-1">Completed</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* History Log (Optional: Only show if there's history) */}
          {order.history && order.history.length > 0 && (
            <div className="border border-border p-6 bg-muted/20">
              <h2 className="text-lg font-playfair mb-4">Detailed History</h2>
              <div className="space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {order.history.reverse().map((entry: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm border-b border-border/50 pb-2 last:border-0 last:pb-0">
                    <div>
                      <span className="font-medium capitalize">{entry.status}</span>
                      {entry.comment && <span className="text-muted-foreground ml-2">— {entry.comment}</span>}
                    </div>
                    <span className="text-muted-foreground text-xs whitespace-nowrap ml-4">
                      {formatDate(entry.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Items & Shipping */}
        <div className="space-y-8">
          {/* Items Snapshot */}
          <div className="border border-border p-6 bg-background">
            <h2 className="text-xl font-playfair mb-6 border-b border-border pb-4">Order Items</h2>
            <div className="space-y-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {order.products.map((product: any, idx: number) => (
                <div key={idx} className="flex gap-4">
                  <div className="relative w-16 h-20 bg-muted flex-shrink-0">
                    <Image
                      src={product.featuredImageSnapshot.secureUrl}
                      alt={product.nameSnapshot}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm leading-tight mb-1">{product.nameSnapshot}</h4>
                    <p className="text-xs text-muted-foreground mb-1">
                      {product.selectedColor} | {product.selectedSize}
                    </p>
                    <p className="text-xs font-semibold">Qty: {product.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border mt-6 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>EGP {order.shippingCost}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total</span>
                <span>EGP {order.total}</span>
              </div>
            </div>
          </div>

          {/* Shipping Destination */}
          <div className="border border-border p-6 bg-muted/20">
            <h2 className="text-lg font-playfair mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" /> Shipping Destination
            </h2>
            <p className="text-sm font-medium">{order.city}</p>
            <p className="text-sm text-muted-foreground">{order.governorate}</p>
            <p className="text-xs text-muted-foreground mt-4 italic">
              Exact delivery details are hidden for security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
