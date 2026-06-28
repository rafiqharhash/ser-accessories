"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useShopFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const setFilter = (name: string, value: string) => {
    router.push(pathname + "?" + createQueryString(name, value), { scroll: false });
  };

  const toggleArrayFilter = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(name);
    
    if (current.includes(value)) {
      const filtered = current.filter((v) => v !== value);
      params.delete(name);
      filtered.forEach((v) => params.append(name, v));
    } else {
      params.append(name, value);
    }
    
    // Reset page on filter change
    params.delete("page");
    
    router.push(pathname + "?" + params.toString(), { scroll: false });
  };

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  return {
    searchParams,
    setFilter,
    toggleArrayFilter,
    clearFilters,
    createQueryString,
  };
}
