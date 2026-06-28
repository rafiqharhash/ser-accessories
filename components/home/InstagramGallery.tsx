"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const InstagramIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width="24"
    height="24"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const galleryImages = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1434389678369-182cb12d1b11?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550614000-4b95d466f20d?q=80&w=400&auto=format&fit=crop",
];

export function InstagramGallery() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-4 text-primary">
            <InstagramIcon />
            <span className="font-semibold uppercase tracking-widest text-sm">@SER.LUXURY</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-playfair mb-4">Join The SER Community</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tag us in your photos to be featured on our official page.
          </p>
        </motion.div>
      </div>

      <div className="flex w-full overflow-hidden">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex min-w-max"
        >
          {[...galleryImages, ...galleryImages].map((img, index) => (
            <Link
              key={index}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0 group block overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                <InstagramIcon className="w-8 h-8 text-white" />
              </div>
              <Image
                src={img}
                alt="Instagram Gallery Image"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 256px, 320px"
              />
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
