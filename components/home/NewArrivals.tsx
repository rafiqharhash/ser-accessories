"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/ui/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const mockProducts = [
  {
    id: "1",
    name: "Silk Evening Gown",
    slug: "silk-evening-gown",
    price: 4500,
    featuredImage: "https://images.unsplash.com/photo-1566160983058-25f0ce1fc414?q=80&w=600&auto=format&fit=crop",
    isNew: true,
    stock: 10,
  },
  {
    id: "2",
    name: "Classic Leather Tote",
    slug: "classic-leather-tote",
    price: 3200,
    featuredImage: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop",
    isNew: true,
    stock: 5,
  },
  {
    id: "3",
    name: "Cashmere Turtleneck",
    slug: "cashmere-turtleneck",
    price: 2800,
    featuredImage: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop",
    isNew: true,
    stock: 15,
  },
  {
    id: "4",
    name: "Tailored Linen Blazer",
    slug: "tailored-linen-blazer",
    price: 5600,
    featuredImage: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=600&auto=format&fit=crop",
    isNew: true,
    stock: 8,
  },
];

export function NewArrivals() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-playfair mb-4">New Arrivals</h2>
            <p className="text-muted-foreground">Discover the latest additions to our luxury collection.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/new-arrivals" 
              className="group flex items-center gap-2 text-sm font-semibold tracking-wider uppercase border-b border-black pb-1 hover:text-primary hover:border-primary transition-colors"
            >
              View All 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {mockProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
