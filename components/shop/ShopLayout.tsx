"use client";

import { useState } from "react";
import { FilterSidebar } from "./FilterSidebar";
import { SortDropdown } from "./SortDropdown";
import { SearchBar } from "./SearchBar";
import { ActiveFilters } from "./ActiveFilters";
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export function ShopLayout({ children }: { children: React.ReactNode }) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-playfair mb-2">Shop Collection</h1>
          <p className="text-muted-foreground">Showing results for your selection.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="hidden md:block w-[300px]">
            <SearchBar />
          </div>
          <SortDropdown />
          
          {/* Mobile Filter Trigger */}
          <div className="md:hidden">
            <Drawer open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <SlidersHorizontal size={16} /> Filters
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[80vh] px-4">
                <DrawerTitle className="sr-only">Filters</DrawerTitle>
                <div className="py-4 overflow-y-auto">
                  <SearchBar />
                  <div className="mt-6">
                    <FilterSidebar />
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      <div className="md:hidden w-full mb-4">
        <SearchBar />
      </div>

      <ActiveFilters />

      <div className="flex flex-col md:flex-row gap-8 mt-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0 sticky top-24 h-[calc(100vh-100px)] overflow-y-auto pr-4 scrollbar-hide">
          <FilterSidebar />
        </aside>

        {/* Product Grid Area */}
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}
