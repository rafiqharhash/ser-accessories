"use client";

import { cn } from "@/lib/utils";

interface Variant {
  id: string;
  color?: string;
  size?: string;
  stock: number;
}

interface VariantSelectorProps {
  colors?: string[];
  sizes?: string[];
  variants: Variant[];
  selectedColor: string | null;
  selectedSize: string | null;
  onColorSelect: (color: string) => void;
  onSizeSelect: (size: string) => void;
}

export function VariantSelector({
  colors,
  sizes,
  variants,
  selectedColor,
  selectedSize,
  onColorSelect,
  onSizeSelect,
}: VariantSelectorProps) {
  // Determine if a size is available for the currently selected color
  const isSizeAvailable = (size: string) => {
    if (!selectedColor) return true; // If no color selected, assume available to encourage clicking
    const variant = variants.find(v => v.color === selectedColor && v.size === size);
    return variant ? variant.stock > 0 : false;
  };

  // Determine if a color is available (has stock in ANY size)
  const isColorAvailable = (color: string) => {
    const colorVariants = variants.filter(v => v.color === color);
    return colorVariants.some(v => v.stock > 0);
  };

  return (
    <div className="space-y-6">
      {colors && colors.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold uppercase tracking-wider">Color</span>
            <span className="text-sm text-muted-foreground">{selectedColor || "Select a color"}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => {
              const isAvailable = isColorAvailable(color);
              const isSelected = selectedColor === color;
              
              return (
                <button
                  key={color}
                  onClick={() => isAvailable && onColorSelect(color)}
                  disabled={!isAvailable}
                  className={cn(
                    "relative w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center",
                    isSelected ? "border-primary scale-110" : "border-border hover:border-primary/50",
                    !isAvailable && "opacity-30 cursor-not-allowed"
                  )}
                  title={color}
                  aria-label={`Select color ${color}`}
                >
                  <span 
                    className="w-8 h-8 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: color.toLowerCase() === 'emerald' ? '#10B981' : color.toLowerCase() }} // Hack for display
                  />
                  {!isAvailable && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-full h-[2px] bg-red-500 rotate-45" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizes && sizes.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold uppercase tracking-wider">Size</span>
            <button className="text-sm underline text-muted-foreground hover:text-primary transition-colors">
              Size Guide
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {sizes.map((size) => {
              const isAvailable = isSizeAvailable(size);
              const isSelected = selectedSize === size;
              
              return (
                <button
                  key={size}
                  onClick={() => isAvailable && onSizeSelect(size)}
                  disabled={!isAvailable}
                  className={cn(
                    "py-3 text-sm font-medium border rounded-md transition-all duration-200",
                    isSelected ? "bg-black text-white border-black" : "bg-transparent text-foreground hover:border-black border-border",
                    !isAvailable && "opacity-30 cursor-not-allowed hover:border-border bg-muted/50"
                  )}
                  aria-label={`Select size ${size}`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
