import { CheckCircle2, ChevronRight, Package, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <div className="container mx-auto px-4 py-20 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-playfair mb-4">Thank You for Your Order!</h1>
        <p className="text-lg text-muted-foreground">
          Your order has been placed successfully and is currently pending review.
        </p>
      </div>

      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        <Card className="border-border shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col items-center border-b border-border pb-6 mb-6">
              <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-2">Order Number</span>
              <span className="text-3xl font-mono tracking-tight">{orderId}</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Order Status</h4>
                  <p className="text-muted-foreground">Pending Review</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Payment Status</h4>
                  <p className="text-muted-foreground">Verifying Screenshot</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-muted/30 rounded-md text-sm text-center text-muted-foreground">
              <p>We will email you a confirmation once your payment screenshot has been verified by our team. This usually takes less than 24 hours.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Link href={`/account/orders/${orderId}`} className="inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 w-full h-14 uppercase tracking-widest font-semibold rounded-none">
            Track Order <Package className="w-5 h-5 ml-2" />
          </Link>
          <Link href="/shop" className="inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-full h-14 uppercase tracking-widest font-semibold rounded-none">
            Continue Shopping <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
