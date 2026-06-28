"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/store/useAdminStore";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Tags, 
  FolderTree, 
  Calculator, 
  Star, 
  Megaphone,
  X,
  Image as ImageIcon
} from "lucide-react";

const mainNavItems = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Products", href: "/admin/products", icon: Package },
  { title: "Categories", href: "/admin/categories", icon: FolderTree },
  { title: "Collections", href: "/admin/collections", icon: FolderTree },
  { title: "Inventory", href: "/admin/inventory", icon: Calculator },
];

const marketingItems = [
  { title: "Coupons", href: "/admin/coupons", icon: Tags },
  { title: "Reviews", href: "/admin/reviews", icon: Star },
  { title: "Announcements", href: "/admin/announcements", icon: Megaphone },
];

const systemItems = [
  { title: "Media Library", href: "/admin/media", icon: ImageIcon },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

const NavGroup = ({ title, items, pathname, closeSidebar }: { title: string, items: typeof mainNavItems, pathname: string, closeSidebar: () => void }) => (
  <div className="mb-6">
    <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
      {title}
    </h3>
    <ul className="space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={closeSidebar}
              className={cn(
                "flex items-center gap-3 px-4 py-2 mx-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  </div>
);

export function AdminSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useAdminStore();

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={closeSidebar} 
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border flex-shrink-0">
          <span className="font-playfair text-xl font-bold tracking-widest">SER ADMIN</span>
          <button onClick={closeSidebar} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          <NavGroup title="Store" items={mainNavItems} pathname={pathname} closeSidebar={closeSidebar} />
          <NavGroup title="Marketing" items={marketingItems} pathname={pathname} closeSidebar={closeSidebar} />
          <NavGroup title="System" items={systemItems} pathname={pathname} closeSidebar={closeSidebar} />
        </div>

        <div className="p-4 border-t border-border flex-shrink-0">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-medium">Administrator</p>
              <p className="text-xs text-muted-foreground">admin@serluxury.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
