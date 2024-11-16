"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/portfolio", label: "Portfolio" },
  { path: "/blogs", label: "Blogs" },
  { path: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-background shadow-custom">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-text-primary hover:text-accent-blue transition-colors"
          >
            <span className="font-mono">SC</span>
          </Link>
          <ul className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-accent-blue text-text-primary"
                      : "text-text-secondary hover:text-accent-blue hover:bg-background"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            className="md:hidden text-text-secondary hover:text-accent-blue focus:outline-none transition-colors"
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background absolute top-full left-0 w-full shadow-custom z-50"
          >
            <ul className="py-4 px-6 space-y-2">
              {navItems.map((item) => (
                <motion.li
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={item.path}
                    className={`block py-2 px-4 rounded-md text-base font-medium transition-colors ${
                      isActive(item.path)
                        ? "bg-accent-blue text-text-primary"
                        : "text-text-secondary hover:text-accent-blue hover:bg-background-light"
                    }`}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
