"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, Clock, RefreshCcw } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck size={32} className="text-primary" />,
    title: "Premium Quality",
    description: "Every piece is crafted with the highest attention to detail and materials.",
  },
  {
    icon: <Truck size={32} className="text-primary" />,
    title: "Express Delivery",
    description: "Complimentary express shipping on all orders over EGP 2,000.",
  },
  {
    icon: <RefreshCcw size={32} className="text-primary" />,
    title: "Easy Returns",
    description: "Enjoy a hassle-free 14-day return and exchange policy.",
  },
  {
    icon: <Clock size={32} className="text-primary" />,
    title: "24/7 Support",
    description: "Our luxury concierge team is available around the clock.",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="mb-6 p-4 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-playfair mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[250px]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
