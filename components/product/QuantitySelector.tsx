"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  maxStock: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
}

export function QuantitySelector({ quantity, maxStock, onIncrease, onDecrease, disabled }: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-border rounded-md w-32 h-12">
      <button
        onClick={onDecrease}
        disabled={disabled || quantity <= 1}
        className="flex-1 flex items-center justify-center h-full hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <div className="flex-1 flex items-center justify-center font-medium border-x border-border h-full">
        {quantity}
      </div>
      <button
        onClick={onIncrease}
        disabled={disabled || quantity >= maxStock}
        className="flex-1 flex items-center justify-center h-full hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
