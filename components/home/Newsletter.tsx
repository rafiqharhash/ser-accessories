"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      toast.success("Welcome to SER!", {
        description: "You've successfully subscribed to our newsletter.",
      });
      setEmail("");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <section className="py-32 bg-black text-white relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-playfair mb-6">Become an Insider</h2>
          <p className="text-white/70 mb-10 text-lg font-light leading-relaxed">
            Subscribe to receive exclusive access to new collections, private sales, and the latest editorial stories from the world of SER.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent border-white/20 text-white placeholder:text-white/40 h-14 rounded-none focus-visible:ring-1 focus-visible:ring-white focus-visible:border-white"
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-14 px-8 rounded-none bg-white text-black hover:bg-white/90 uppercase tracking-widest text-xs font-semibold"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
