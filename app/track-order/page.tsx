"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    
    // Clean up input (e.g. if they pasted with spaces)
    const cleaned = orderNumber.trim().toUpperCase();
    router.push(`/track-order/${cleaned}`);
  };

  return (
    <div className="container mx-auto px-4 py-24 min-h-[70vh] flex flex-col items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-8">
          <Package className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-4xl font-playfair mb-4">Track Your Order</h1>
        <p className="text-muted-foreground mb-8">
          Enter your order number below to check the current status and tracking history of your delivery.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="e.g. SER-2026-000001"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
          </div>
          <Button type="submit" size="lg" className="h-14 uppercase tracking-widest font-semibold" disabled={!orderNumber.trim()}>
            Find Order
          </Button>
        </form>
      </div>
    </div>
  );
}
