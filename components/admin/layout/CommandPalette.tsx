"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Package, ShoppingBag, FolderTree, Percent, Settings, Activity } from "lucide-react";
import { globalAdminSearch } from "@/actions/search.actions";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = React.useState<any>({ products: [], orders: [], categories: [], collections: [], coupons: [] });
  const [isSearching, setIsSearching] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults({ products: [], orders: [], categories: [], collections: [], coupons: [] });
        return;
      }
      setIsSearching(true);
      const data = await globalAdminSearch(query);
      setResults(data);
      setIsSearching(false);
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." value={query} onValueChange={setQuery} />
      <CommandList>
        {isSearching && <div className="p-4 text-sm text-center text-muted-foreground">Searching...</div>}
        <CommandEmpty>{isSearching ? "Searching..." : "No results found."}</CommandEmpty>
        
        {/* Quick Links (Default) */}
        {!query && (
          <CommandGroup heading="Quick Links">
            <CommandItem onSelect={() => runCommand(() => router.push("/admin/products/new"))}>
              <Package className="mr-2 h-4 w-4" />
              <span>Create Product</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/admin/orders"))}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>View Orders</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/admin/settings"))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Store Settings</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/admin/audit"))}>
              <Activity className="mr-2 h-4 w-4" />
              <span>Audit Logs</span>
            </CommandItem>
          </CommandGroup>
        )}

        {/* Dynamic Search Results */}
        {results.products.length > 0 && (
          <CommandGroup heading="Products">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {results.products.map((p: any) => (
              <CommandItem key={p._id} onSelect={() => runCommand(() => router.push(`/admin/products/${p._id}`))}>
                <Package className="mr-2 h-4 w-4" />
                <span>{p.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results.orders.length > 0 && (
          <CommandGroup heading="Orders">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {results.orders.map((o: any) => (
              <CommandItem key={o._id} onSelect={() => runCommand(() => router.push(`/admin/orders/${o._id}`))}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>{o.customer.name} - EGP {o.totalAmount}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results.categories.length > 0 && (
          <CommandGroup heading="Categories">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {results.categories.map((c: any) => (
              <CommandItem key={c._id} onSelect={() => runCommand(() => router.push(`/admin/categories`))}>
                <FolderTree className="mr-2 h-4 w-4" />
                <span>{c.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results.coupons.length > 0 && (
          <CommandGroup heading="Coupons">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {results.coupons.map((c: any) => (
              <CommandItem key={c._id} onSelect={() => runCommand(() => router.push(`/admin/coupons`))}>
                <Percent className="mr-2 h-4 w-4" />
                <span>{c.code}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
