"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Amina Y.",
    role: "Verified Buyer",
    content: "The silk gown I ordered exceeded my expectations. The craftsmanship is truly world-class, and the packaging felt incredibly luxurious.",
    rating: 5,
  },
  {
    id: 2,
    name: "Omar H.",
    role: "Verified Buyer",
    content: "Exceptional quality and outstanding customer service. SER has redefined what luxury e-commerce should feel like in Egypt.",
    rating: 5,
  },
  {
    id: 3,
    name: "Nour S.",
    role: "Verified Buyer",
    content: "The tailored blazer fits perfectly. I love the attention to detail. Will definitely be purchasing the summer collection soon.",
    rating: 5,
  },
];

export function Reviews() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-playfair mb-4">Client Testimonials</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover what our clients have to say about their SER experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background p-8 rounded-2xl shadow-sm border border-border"
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={18} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-lg leading-relaxed mb-6 font-playfair italic">
                &quot;{review.content}&quot;
              </p>
              <div>
                <h4 className="font-semibold">{review.name}</h4>
                <p className="text-sm text-muted-foreground">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
