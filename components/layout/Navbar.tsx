"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart, Search, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Mobile Menu & Search */}
        <div className="flex items-center gap-4 lg:hidden">
          <button aria-label="Menu">
            <Menu className="w-6 h-6" />
          </button>
          <button aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">
            SHOP
          </Link>
          <Link href="/new-arrivals" className="text-sm font-medium hover:text-primary transition-colors">
            NEW ARRIVALS
          </Link>
          <Link href="/sale" className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors">
            SALE
          </Link>
        </nav>

        {/* Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <div className="relative w-24 h-12 lg:w-32 lg:h-16">
            <Image
              src="/logo.png"
              alt="SER Luxury"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Actions */}
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden lg:flex items-center gap-6">
            <button aria-label="Search" className="hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <ThemeToggle />
          </div>
          
          <Link href="/wishlist" aria-label="Wishlist" className="hover:text-primary transition-colors">
            <Heart className="w-5 h-5" />
          </Link>
          <Link href="/cart" aria-label="Cart" className="hover:text-primary transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
