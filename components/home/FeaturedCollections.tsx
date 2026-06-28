"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const collections = [
  {
    id: "1",
    title: "Summer Breeze",
    slug: "summer-breeze",
    image: "https://images.unsplash.com/photo-1515347619152-16bda968038b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Midnight Gala",
    slug: "midnight-gala",
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Everyday Luxury",
    slug: "everyday-luxury",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
  },
];

export function FeaturedCollections() {
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
          <h2 className="text-3xl md:text-5xl font-playfair mb-4">Curated Collections</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our thoughtfully assembled collections, each telling a unique story through fabric, cut, and silhouette.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Link
                href={`/collections/${collection.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-lg"
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 z-10" />
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="text-white text-2xl md:text-3xl font-playfair mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {collection.title}
                  </h3>
                  <span className="text-white/90 text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 border-b border-white pb-1">
                    Discover
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
