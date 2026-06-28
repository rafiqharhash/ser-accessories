"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calculator, CreditCard, Settings, Package, FolderTree, LayoutDashboard, Truck, Tags } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useAdminStore } from "@/store/useAdminStore";

export function CommandPalette() {
  const router = useRouter();
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useAdminStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  const runCommand = (command: () => void) => {
    setCommandPaletteOpen(false);
    command();
  };

  return (
    <CommandDialog open={isCommandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/products/new"))}>
            <Package className="mr-2 h-4 w-4" />
            <span>Create New Product</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/orders"))}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>View Orders</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/admin"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard Home</span>
            <CommandShortcut>D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/products"))}>
            <Package className="mr-2 h-4 w-4" />
            <span>Products</span>
            <CommandShortcut>P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/categories"))}>
            <FolderTree className="mr-2 h-4 w-4" />
            <span>Categories</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/collections"))}>
            <FolderTree className="mr-2 h-4 w-4" />
            <span>Collections</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/inventory"))}>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Inventory</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/coupons"))}>
            <Tags className="mr-2 h-4 w-4" />
            <span>Coupons</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />
        
        <CommandGroup heading="Settings & Support">
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/shipping"))}>
            <Truck className="mr-2 h-4 w-4" />
            <span>Shipping Zones</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
