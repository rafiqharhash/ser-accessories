"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 top-0 z-50 bg-background border-b shadow-lg p-6"
          >
            <div className="container mx-auto max-w-3xl relative">
              <form onSubmit={handleSearch} className="relative flex items-center">
                <Search className="absolute left-4 h-6 w-6 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  type="search"
                  placeholder="Search products, categories, or collections..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-14 pr-14 h-16 text-lg rounded-full bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-4 p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </form>
              <div className="mt-8">
                <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider font-semibold">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {["Summer Collection", "Luxury Watches", "Leather Bags", "Evening Dresses"].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        router.push(`/shop?q=${encodeURIComponent(term)}`);
                        onClose();
                      }}
                      className="px-4 py-2 bg-muted/50 hover:bg-muted rounded-full text-sm transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
