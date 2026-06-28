"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    oldPrice?: number;
    featuredImage: string;
    hoverImage?: string;
    isNew?: boolean;
    isBestSeller?: boolean;
    discountPercentage?: number;
    stock: number;
  };
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("group flex flex-col relative", className)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-sm uppercase tracking-wider">
            New
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-black text-white text-xs font-semibold px-2 py-1 rounded-sm uppercase tracking-wider">
            Best Seller
          </span>
        )}
        {product.discountPercentage && product.discountPercentage > 0 && (
          <span className="bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1 rounded-sm uppercase tracking-wider">
            -{product.discountPercentage}%
          </span>
        )}
      </div>

      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-muted rounded-md mb-4">
        <Image
          src={product.featuredImage}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-opacity duration-500 ease-in-out",
            product.hoverImage ? "group-hover:opacity-0" : ""
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {product.hoverImage && (
          <Image
            src={product.hoverImage}
            alt={`${product.name} alternate view`}
            fill
            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        )}
        
        {/* Quick Actions (Hover) */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex justify-center gap-2 z-20">
          <button 
            className="bg-white/90 backdrop-blur text-black p-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
            aria-label="Add to Wishlist"
          >
            <Heart size={18} />
          </button>
          <button 
            className="bg-white/90 backdrop-blur text-black p-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
            aria-label="Quick View"
          >
            <Eye size={18} />
          </button>
          <button 
            className="bg-white/90 backdrop-blur text-black flex-grow flex items-center justify-center gap-2 rounded-full font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
            aria-label="Add to Cart"
            disabled={product.stock === 0}
          >
            <ShoppingBag size={18} />
            {product.stock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
          </button>
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-col flex-grow">
        <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors">
          <h3 className="font-playfair text-lg line-clamp-1">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <span className="font-medium text-base">EGP {product.price.toLocaleString()}</span>
          {product.oldPrice && (
            <span className="text-muted-foreground line-through text-sm">
              EGP {product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
