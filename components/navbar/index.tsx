"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MenuIcon, XIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../theme-toggle";

interface NavItem {
  href: string;
  name: string;
}

const navigation: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Statistics", href: "/statistics" },
  { name: "Blogs", href: "/blogs" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const toggleMenu = (): void => setMenuOpen(!menuOpen);
  const closeMenu = (): void => setMenuOpen(false);

  const isActive = (path: string): boolean => pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 border-b border-border/40 w-full fixed top-0 z-[100]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-gradient">SC</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-primary",
                  {
                    "text-primary after:absolute after:left-0 after:-bottom-4 after:h-[2px] after:w-full after:bg-gradient":
                      pathname === item.href,
                    "text-muted-foreground": pathname !== item.href,
                  }
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile menu (simple CSS-based toggle to avoid bundling framer-motion) */}
      <div
        className={`fixed inset-0 bg-background/95 backdrop-blur-sm z-[999] md:hidden border-l border-border/40 flex flex-col h-[100vh] transform transition-transform duration-300 ease-out ${
          menuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b">
          <Link href="/" className="text-xl font-bold text-gradient" onClick={closeMenu}>
            <span>SC</span>
          </Link>
            <Button
            variant="ghost"
            size="icon"
            onClick={closeMenu}
            aria-label="Close menu"
            className="hover:bg-muted"
          >
            <XIcon className="h-6 w-6" />
          </Button>
        </div>
        <nav className="flex-1 flex items-center justify-center">
          <ul className="space-y-6 w-full px-6">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block py-3 px-4 text-base font-medium transition-colors rounded-lg ${
                    isActive(item.href)
                      ? "text-primary font-bold"
                      : "text-foreground hover:text-primary hover:bg-muted/80"
                  }`}
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </nav>
  );
}
