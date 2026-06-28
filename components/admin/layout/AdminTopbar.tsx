"use client";

import { useAdminStore } from "@/store/useAdminStore";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/admin/layout/NotificationBell";

export function AdminTopbar() {
  const { toggleSidebar, setCommandPaletteOpen } = useAdminStore();

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="lg:hidden p-0 w-8 h-8" onClick={toggleSidebar}>
          <Menu className="w-5 h-5" />
        </Button>
        
        <Button 
          variant="outline" 
          className="hidden md:flex items-center gap-2 w-64 justify-start text-muted-foreground"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="w-4 h-4" />
          <span>Search...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />
      </div>
    </header>
  );
}
