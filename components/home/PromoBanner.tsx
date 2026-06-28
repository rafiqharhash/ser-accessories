"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Image from "next/image";

export function PromoBanner() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop"
          alt="SER Promotional Banner"
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="container relative z-20 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto bg-black/40 backdrop-blur-md p-10 md:p-16 rounded-xl border border-white/20"
        >
          <span className="text-primary-foreground/90 uppercase tracking-[0.2em] text-sm mb-4 block font-semibold">
            Limited Time Offer
          </span>
          <h2 className="text-4xl md:text-6xl font-playfair text-white mb-6 leading-tight">
            The Winter Archive Sale
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Enjoy up to 50% off on selected luxury pieces. Elevate your wardrobe before the season ends.
          </p>
          <Link
            href="/sale"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full hover:bg-white/90 transition-colors font-medium tracking-wide uppercase text-sm"
          >
            Shop The Sale
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
