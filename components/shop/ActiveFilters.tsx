"use client";

import { useShopFilters } from "@/hooks/useShopFilters";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ActiveFilters() {
  const { searchParams, toggleArrayFilter, setFilter, clearFilters } = useShopFilters();
  
  const activeFilters: { key: string; value: string; isArray: boolean }[] = [];
  
  // Extract specific filter keys to display
  const filterKeys = ["category", "collection"];
  const arrayFilterKeys = ["color", "size", "material"];

  filterKeys.forEach(key => {
    const val = searchParams.get(key);
    if (val) activeFilters.push({ key, value: val, isArray: false });
  });

  arrayFilterKeys.forEach(key => {
    const vals = searchParams.getAll(key);
    vals.forEach(val => activeFilters.push({ key, value: val, isArray: true }));
  });

  // Also handle boolean flags like isNew, onSale
  ["isNew", "onSale", "isBestSeller"].forEach(key => {
    if (searchParams.get(key) === "true") {
      activeFilters.push({ key, value: key, isArray: false });
    }
  });

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-4">
      <span className="text-sm text-muted-foreground mr-2">Active Filters:</span>
      {activeFilters.map(({ key, value, isArray }) => (
        <Badge key={`${key}-${value}`} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1 font-normal bg-muted">
          {key === value ? value : value}
          <button
            onClick={() => isArray ? toggleArrayFilter(key, value) : setFilter(key, "")}
            className="ml-1 hover:text-destructive focus:outline-none"
            aria-label={`Remove filter ${value}`}
          >
            <X size={14} />
          </button>
        </Badge>
      ))}
      <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm h-7 text-muted-foreground hover:text-foreground">
        Clear All
      </Button>
    </div>
  );
}
