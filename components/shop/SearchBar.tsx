"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useShopFilters } from "@/hooks/useShopFilters";
import { useState, useEffect, useTransition } from "react";

export function SearchBar() {
  const { searchParams, setFilter } = useShopFilters();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== initialQuery) {
        startTransition(() => {
          setFilter("q", query);
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, initialQuery, setFilter]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search products, SKUs, tags..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9 pr-9 w-full bg-muted/50 focus-visible:ring-primary"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {isPending && (
        <div className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}
