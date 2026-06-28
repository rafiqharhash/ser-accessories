"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/ui/ProductCard";

const mockProducts = [
  {
    id: "1",
    name: "Signature Gold Watch",
    slug: "signature-gold-watch",
    price: 12500,
    featuredImage: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=600&auto=format&fit=crop",
    isBestSeller: true,
    stock: 3,
  },
  {
    id: "2",
    name: "Monogram Crossbody Bag",
    slug: "monogram-crossbody-bag",
    price: 6800,
    oldPrice: 8500,
    discountPercentage: 20,
    featuredImage: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop",
    isBestSeller: true,
    stock: 12,
  },
  {
    id: "3",
    name: "Diamond Stud Earrings",
    slug: "diamond-stud-earrings",
    price: 18000,
    featuredImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
    isBestSeller: true,
    stock: 0, // Out of stock
  },
  {
    id: "4",
    name: "Velvet Evening Pumps",
    slug: "velvet-evening-pumps",
    price: 4200,
    featuredImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop",
    isBestSeller: true,
    stock: 25,
  },
];

export function BestSellers() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-playfair mb-4">Best Sellers</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our most loved pieces, chosen by you. Experience the icons of SER.
          </p>
        </motion.div>

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
