"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../theme-toggle";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-gradient">SC</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
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
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-2">
          <ThemeToggle />
        </nav>
      </div>
    </div>
  );
}
