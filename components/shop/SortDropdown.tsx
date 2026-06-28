"use client";

import { useShopFilters } from "@/hooks/useShopFilters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SortDropdown() {
  const { searchParams, setFilter } = useShopFilters();
  const currentSort = searchParams.get("sort") || "newest";

  return (
    <Select value={currentSort} onValueChange={(value) => setFilter("sort", value as string)}>
      <SelectTrigger className="w-[180px] bg-background">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest Arrivals</SelectItem>
        <SelectItem value="price_asc">Price: Low to High</SelectItem>
        <SelectItem value="price_desc">Price: High to Low</SelectItem>
        <SelectItem value="best_seller">Best Sellers</SelectItem>
        <SelectItem value="discount">Highest Discount</SelectItem>
        <SelectItem value="alpha_asc">Alphabetical (A-Z)</SelectItem>
      </SelectContent>
    </Select>
  );
}
