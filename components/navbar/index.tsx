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
  { name: "Engineering", href: "/engineering" },
  { name: "Statistics", href: "/statistics" },
  { name: "Blogs", href: "/blogs" },
  { name: "What I do", href: "/services" },
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
    <nav
      aria-label="Main navigation"
      className="fixed top-0 z-[100] w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/85"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            aria-label="Shailesh Chaudhari — home"
            className="flex min-h-11 min-w-11 items-center space-x-2"
          >
            <span
              className="text-gradient text-xl font-bold"
              aria-hidden="true"
            >
              SC
            </span>
          </Link>
          <div className="hidden items-center space-x-6 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-primary",
                  {
                    "after:bg-gradient text-primary after:absolute after:-bottom-4 after:left-0 after:h-[2px] after:w-full":
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
      {/* `inert` when closed removes the whole subtree from the focus order —
          prevents axe aria-hidden-focus failures that used to fire because the
          close button + nav links remained tab-reachable inside an aria-hidden region. */}
      {/* The drawer sits inside a fixed, viewport-sized clipping wrapper.

          Why the wrapper exists: the drawer is parked at `translate-x-full` when
          closed, i.e. exactly one viewport to the right. A `position: fixed`
          element is attached to the viewport rather than to any ancestor, so no
          amount of `overflow-x: clip` on html/body could clip it — and the
          document's scrollWidth came out at exactly 2x the viewport, which made
          every page on the site swipe sideways on a phone.

          Making the wrapper `fixed` and the drawer `absolute` inside it means
          the wrapper is now the drawer's containing block, so `overflow-x: clip`
          on the wrapper actually contains it. The slide transition is unchanged.

          `pointer-events-none` on the wrapper with `pointer-events-auto` on the
          open drawer keeps the rest of the page clickable through it. */}
      <div className="pointer-events-none fixed inset-0 z-[999] overflow-x-clip md:hidden">
        <div
          className={`absolute inset-0 flex h-full transform flex-col border-l border-border/40 bg-background/95 backdrop-blur-sm transition-transform duration-300 ease-out ${
            menuOpen
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "pointer-events-none translate-x-full opacity-0"
          }`}
          aria-hidden={!menuOpen}
          inert={!menuOpen}
        >
          <div className="flex items-center justify-between border-b px-6 py-5">
            <Link
              href="/"
              className="text-gradient text-xl font-bold"
              onClick={closeMenu}
            >
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
          <nav className="flex flex-1 items-center justify-center">
            <ul className="w-full space-y-6 px-6">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? "font-bold text-primary"
                        : "text-foreground hover:bg-muted/80 hover:text-primary"
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
      </div>
    </nav>
  );
}
