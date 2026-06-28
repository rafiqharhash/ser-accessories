"use client";

import { useShopFilters } from "@/hooks/useShopFilters";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Mock filter options
const categories = ["Dresses", "Bags", "Shoes", "Jewelry", "Outerwear", "Accessories"];
const colors = ["Black", "White", "Red", "Blue", "Gold", "Silver"];
const sizes = ["XS", "S", "M", "L", "XL", "Free Size"];
const availability = [{ label: "In Stock", value: "in_stock" }, { label: "Out of Stock", value: "out_of_stock" }];

export function FilterSidebar() {
  const { searchParams, setFilter, toggleArrayFilter } = useShopFilters();

  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="font-playfair text-xl mb-4">Filters</h3>
        {/* @ts-expect-error Radix UI types mismatch in shadcn */}
        <Accordion type="multiple" defaultValue={["category", "color", "size"]} className="w-full">
          
          <AccordionItem value="category" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-3 text-sm uppercase tracking-widest font-semibold text-muted-foreground">
              Category
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {categories.map((cat) => {
                  const currentCat = searchParams.get("category");
                  return (
                    <div key={cat} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`cat-${cat}`} 
                        checked={currentCat === cat}
                        onCheckedChange={(checked) => setFilter("category", checked ? cat : "")}
                      />
                      <Label htmlFor={`cat-${cat}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                        {cat}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="color" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-3 text-sm uppercase tracking-widest font-semibold text-muted-foreground">
              Color
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {colors.map((color) => {
                  const isActive = searchParams.getAll("color").includes(color.toLowerCase());
                  return (
                    <div key={color} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`color-${color}`} 
                        checked={isActive}
                        onCheckedChange={() => toggleArrayFilter("color", color.toLowerCase())}
                      />
                      <Label htmlFor={`color-${color}`} className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: color.toLowerCase() }} />
                        {color}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="size" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-3 text-sm uppercase tracking-widest font-semibold text-muted-foreground">
              Size
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-3 gap-2 pt-2">
                {sizes.map((size) => {
                  const isActive = searchParams.getAll("size").includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleArrayFilter("size", size)}
                      className={`py-2 text-xs font-semibold border rounded-md transition-colors ${
                        isActive ? "bg-black text-white border-black" : "bg-transparent text-foreground hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="availability" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-3 text-sm uppercase tracking-widest font-semibold text-muted-foreground">
              Availability
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {availability.map((item) => {
                  const currentVal = searchParams.get("availability");
                  return (
                    <div key={item.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`avail-${item.value}`} 
                        checked={currentVal === item.value}
                        onCheckedChange={(checked) => setFilter("availability", checked ? item.value : "")}
                      />
                      <Label htmlFor={`avail-${item.value}`} className="text-sm font-medium leading-none cursor-pointer">
                        {item.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="special" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-3 text-sm uppercase tracking-widest font-semibold text-muted-foreground">
              Special
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="special-sale" 
                    checked={searchParams.get("onSale") === "true"}
                    onCheckedChange={(checked) => setFilter("onSale", checked ? "true" : "")}
                  />
                  <Label htmlFor="special-sale" className="text-sm text-destructive font-semibold cursor-pointer">
                    On Sale
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="special-new" 
                    checked={searchParams.get("isNew") === "true"}
                    onCheckedChange={(checked) => setFilter("isNew", checked ? "true" : "")}
                  />
                  <Label htmlFor="special-new" className="text-sm font-medium cursor-pointer">
                    New Arrivals
                  </Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </div>
  );
}
