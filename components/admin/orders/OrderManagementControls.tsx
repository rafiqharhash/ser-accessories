"use client";

import { useState } from "react";
import { updateOrderStatus, updatePaymentStatus } from "@/actions/admin-order.actions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ExternalLink, Check, X, Printer, Loader2 } from "lucide-react";
import Image from "next/image";

interface OrderManagementControlsProps {
  orderId: string;
  currentStatus: string;
  paymentStatus: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentScreenshot?: any;
}

export function OrderManagementControls({ orderId, currentStatus, paymentStatus, paymentScreenshot }: OrderManagementControlsProps) {
  const [status, setStatus] = useState(currentStatus);
  const [comment, setComment] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  const handleStatusUpdate = async () => {
    setIsUpdatingStatus(true);
    const result = await updateOrderStatus(orderId, status, comment);
    if (result.success) {
      toast.success(`Order status updated to ${status}`);
      setComment("");
    } else {
      toast.error(result.error);
    }
    setIsUpdatingStatus(false);
  };

  const handlePaymentUpdate = async (newStatus: "verified" | "rejected") => {
    setIsUpdatingPayment(true);
    const result = await updatePaymentStatus(orderId, newStatus, `Admin ${newStatus} the payment`);
    if (result.success) {
      toast.success(`Payment marked as ${newStatus}`);
    } else {
      toast.error(result.error);
    }
    setIsUpdatingPayment(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 no-print">
      {/* Actions Bar */}
      <div className="flex gap-2 justify-end mb-6">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" /> Print Invoice
        </Button>
      </div>

      {/* Payment Verification Box */}
      <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">Payment Verification</h3>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-grow">
            <p className="text-sm font-medium mb-1">Current Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize mb-6 ${
              paymentStatus === "verified" ? "bg-green-100 text-green-800" :
              paymentStatus === "rejected" ? "bg-red-100 text-red-800" :
              "bg-yellow-100 text-yellow-800"
            }`}>
              {paymentStatus}
            </span>

            {paymentStatus === "pending" && paymentScreenshot && (
              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handlePaymentUpdate("verified")} disabled={isUpdatingPayment}>
                  {isUpdatingPayment ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />} Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handlePaymentUpdate("rejected")} disabled={isUpdatingPayment}>
                  {isUpdatingPayment ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <X className="w-4 h-4 mr-2" />} Reject
                </Button>
              </div>
            )}
          </div>

          {paymentScreenshot && paymentScreenshot.secureUrl ? (
            <div className="w-48 flex-shrink-0">
              <p className="text-sm font-medium mb-2">Screenshot</p>
              <div className="relative w-full aspect-[1/1.5] bg-muted rounded-md overflow-hidden border border-border group cursor-pointer" onClick={() => window.open(paymentScreenshot.secureUrl, "_blank")}>
                <Image src={paymentScreenshot.secureUrl} alt="Receipt" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ExternalLink className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-48 flex-shrink-0 text-sm text-muted-foreground flex items-center justify-center border border-dashed border-border rounded-md aspect-[1/1.5] bg-muted/20">
              No Screenshot
            </div>
          )}
        </div>
      </div>

      {/* Order Status Box */}
      <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">Update Order Status</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Status</label>
              <Select value={status} onValueChange={(val) => setStatus(val as string)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled" className="text-destructive">Cancelled (Restores Stock)</SelectItem>
                  <SelectItem value="returned" className="text-orange-600">Returned (Restores Stock)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Admin Comment / Note (Optional)</label>
            <Textarea 
              placeholder="e.g. Sent via Aramex tracking #123" 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <Button onClick={handleStatusUpdate} disabled={isUpdatingStatus || status === currentStatus} className="w-full md:w-auto">
            {isUpdatingStatus && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Status Changes
          </Button>
          
          <p className="text-xs text-muted-foreground mt-2">
            Note: Moving an order to Cancelled or Returned will automatically add the items back to inventory.
          </p>
        </div>
      </div>
    </div>
  );
}
