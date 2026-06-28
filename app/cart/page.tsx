"use client";

import { useCartStore } from "@/store/useCartStore";
import { CartItem } from "@/components/checkout/CartItem";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const clearCart = useCartStore((state) => state.clearCart);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-[60vh] flex items-center justify-center">
        <EmptyState
          title="Your Cart is Empty"
          description="Discover our latest collections and find something you love."
          icon={<ShoppingBag size={48} className="text-muted-foreground" />}
          action={
            <Link href="/shop">
              <Button size="lg" className="mt-8 uppercase tracking-widest font-semibold rounded-none">
                Continue Shopping
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20 min-h-[70vh]">
      <h1 className="text-4xl font-playfair mb-10">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Cart Items List */}
        <div className="flex-grow">
          <div className="flex justify-between items-center border-b border-border pb-4 mb-4">
            <span className="text-sm uppercase tracking-wider font-semibold text-muted-foreground">Product</span>
            <button 
              onClick={clearCart}
              className="text-sm underline text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear Cart
            </button>
          </div>
          
          <div className="flex flex-col">
            {items.map((item) => (
              <CartItem key={item.cartItemId} cartItemId={item.cartItemId} />
            ))}
          </div>
        </div>

        {/* Order Summary sidebar */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-muted/30 p-8 border border-border sticky top-24">
            <h2 className="text-xl font-playfair mb-6 border-b border-border pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">EGP {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground italic">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t border-border pt-4 mb-8 flex justify-between items-center">
              <span className="font-semibold uppercase tracking-wider">Estimated Total</span>
              <span className="text-2xl font-medium">EGP {subtotal.toLocaleString()}</span>
            </div>
            
            <Link href="/checkout" className="w-full block">
              <Button className="w-full h-14 uppercase tracking-widest text-sm font-semibold rounded-none flex items-center justify-between px-6" size="lg">
                Proceed to Checkout
                <ArrowRight size={18} />
              </Button>
            </Link>

            <div className="mt-6 text-center">
              <Link href="/shop" className="text-sm underline text-muted-foreground hover:text-foreground transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
