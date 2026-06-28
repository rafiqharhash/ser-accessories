"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

interface CartItemComponentProps {
  cartItemId: string;
}

export function CartItem({ cartItemId }: CartItemComponentProps) {
  const item = useCartStore(state => state.items.find(i => i.cartItemId === cartItemId));
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);

  if (!item) return null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-6 border-b border-border gap-4 sm:gap-6">
      {/* Product Image */}
      <Link href={`/product/${item.slug}`} className="relative w-24 h-32 flex-shrink-0 bg-muted">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-grow flex flex-col justify-between h-full space-y-2 sm:space-y-0">
        <div className="flex justify-between items-start gap-4">
          <div>
            <Link href={`/product/${item.slug}`} className="font-playfair text-lg sm:text-xl hover:text-primary transition-colors">
              {item.name}
            </Link>
            <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
              {item.selectedColor && <p>Color: {item.selectedColor}</p>}
              {item.selectedSize && <p>Size: {item.selectedSize}</p>}
              {item.selectedMaterial && <p>Material: {item.selectedMaterial}</p>}
            </div>
          </div>
          
          <button 
            onClick={() => removeItem(item.cartItemId)}
            className="text-muted-foreground hover:text-destructive transition-colors p-1"
            aria-label="Remove item"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Quantity and Price */}
        <div className="flex justify-between items-end mt-4">
          <div className="flex items-center border border-border rounded-md w-28 h-10">
            <button
              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="flex-1 flex items-center justify-center h-full hover:bg-muted transition-colors disabled:opacity-50"
            >
              <Minus size={14} />
            </button>
            <div className="flex-1 flex items-center justify-center font-medium border-x border-border h-full text-sm">
              {item.quantity}
            </div>
            <button
              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
              disabled={item.quantity >= item.maxStock}
              className="flex-1 flex items-center justify-center h-full hover:bg-muted transition-colors disabled:opacity-50"
            >
              <Plus size={14} />
            </button>
          </div>
          
          <div className="text-right">
            <p className="font-medium">EGP {(item.price * item.quantity).toLocaleString()}</p>
            {item.quantity > 1 && (
              <p className="text-xs text-muted-foreground mt-1">EGP {item.price.toLocaleString()} each</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
