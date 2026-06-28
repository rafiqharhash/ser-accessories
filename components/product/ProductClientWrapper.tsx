"use client";

import { useState } from "react";
import { Heart, Share2, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductGallery } from "./ProductGallery";
import { VariantSelector } from "./VariantSelector";
import { QuantitySelector } from "./QuantitySelector";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

interface ProductClientWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
}

export function ProductClientWrapper({ product }: ProductClientWrapperProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Determine current stock based on variant selection
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentVariant = product.variants?.find((v: any) => v.color === selectedColor && v.size === selectedSize);
  
  // If variant mode, use variant stock, else fallback to total stock
  const currentStock = currentVariant ? currentVariant.stock : (selectedSize ? 0 : product.stock);
  const isOutOfStock = currentStock === 0;

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (product.stockMode === "variants" && (!selectedColor || !selectedSize)) {
      toast.error("Please select a color and size.");
      return;
    }

    setIsAdding(true);
    
    // Add to Zustand store
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      image: product.featuredImage,
      price: product.price,
      oldPrice: product.oldPrice,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
      quantity,
      maxStock: currentStock,
    });

    setTimeout(() => {
      toast.success(`${product.name} added to cart`, {
        description: `${quantity}x ${selectedColor || ""} ${selectedSize || ""}`.trim()
      });
      setIsAdding(false);
    }, 400); // Shorter timeout for snappier feel
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: `Check out the ${product.name} at SER Luxury`,
        url: window.location.href,
      });
    } catch (_e) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      {/* Left Column: Gallery */}
      <div className="w-full">
        <ProductGallery images={product.galleryImages} productName={product.name} />
      </div>

      {/* Right Column: Info & Actions */}
      <div className="flex flex-col pt-4 lg:pt-8">
        {/* Breadcrumb & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/category/${product.category.slug}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="flex items-center gap-2">
            {product.isNew && <Badge className="bg-primary text-primary-foreground tracking-wider uppercase rounded-sm">New</Badge>}
            {product.isBestSeller && <Badge variant="secondary" className="bg-black text-white tracking-wider uppercase rounded-sm">Best Seller</Badge>}
          </div>
        </div>

        {/* Title & Collection */}
        {product.collection && (
          <Link href={`/collection/${product.collection.slug}`} className="text-sm font-semibold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors mb-2 block">
            {product.collection.name} Collection
          </Link>
        )}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair leading-tight mb-4">{product.name}</h1>
        
        {/* Price */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-2xl font-medium">EGP {product.price.toLocaleString()}</span>
          {product.oldPrice && (
            <span className="text-xl text-muted-foreground line-through">EGP {product.oldPrice.toLocaleString()}</span>
          )}
          {product.discountPercentage && (
            <Badge variant="destructive" className="ml-2 uppercase tracking-wider rounded-sm">-{product.discountPercentage}% Off</Badge>
          )}
        </div>

        <p className="text-muted-foreground leading-relaxed mb-8">{product.shortDescription}</p>

        <hr className="border-border mb-8" />

        {/* Variant Selection */}
        {product.stockMode === "variants" && (
          <div className="mb-8">
            <VariantSelector
              colors={product.colors}
              sizes={product.sizes}
              variants={product.variants}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              onColorSelect={(color) => {
                setSelectedColor(color);
                setSelectedSize(null); // Reset size on color change
                setQuantity(1);
              }}
              onSizeSelect={(size) => {
                setSelectedSize(size);
                setQuantity(1);
              }}
            />
          </div>
        )}

        {/* Stock Indicator */}
        <div className="mb-6 h-6">
          {(selectedSize || product.stockMode !== "variants") && (
            <span className={cn("text-sm font-medium", isOutOfStock ? "text-destructive" : (currentStock < 5 ? "text-amber-500" : "text-green-600"))}>
              {isOutOfStock ? "Out of Stock" : currentStock < 5 ? `Only ${currentStock} left in stock - order soon.` : "In Stock"}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-shrink-0">
            <QuantitySelector 
              quantity={quantity} 
              maxStock={currentStock} 
              onDecrease={() => setQuantity(prev => prev - 1)} 
              onIncrease={() => setQuantity(prev => prev + 1)}
              disabled={isOutOfStock || (!selectedSize && product.stockMode === "variants")}
            />
          </div>
          <Button 
            className="flex-grow h-12 uppercase tracking-widest text-sm font-semibold rounded-none" 
            size="lg"
            disabled={isOutOfStock || (!selectedSize && product.stockMode === "variants") || isAdding}
            onClick={handleAddToCart}
          >
            {isAdding ? "Adding..." : (isOutOfStock ? "Sold Out" : "Add to Cart")}
          </Button>
          <Button variant="outline" size="icon" className="h-12 w-12 flex-shrink-0 rounded-none border-border hover:bg-muted" aria-label="Add to Wishlist">
            <Heart size={20} />
          </Button>
        </div>

        {/* Meta Actions */}
        <div className="flex items-center gap-6 mt-2 text-sm text-muted-foreground font-medium uppercase tracking-wider">
          <button onClick={handleShare} className="flex items-center gap-2 hover:text-foreground transition-colors">
            <Share2 size={16} /> Share
          </button>
          <button className="flex items-center gap-2 hover:text-foreground transition-colors">
            <Ruler size={16} /> Size Guide
          </button>
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground">
          <p><span className="font-semibold text-foreground mr-2">SKU:</span> {product.sku}</p>
        </div>

      </div>
    </div>
  );
}
