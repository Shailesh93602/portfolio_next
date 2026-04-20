"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@/components/icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const [announcement, setAnnouncement] = React.useState("");

  const pick = (next: "light" | "dark" | "system") => {
    setTheme(next);
    setAnnouncement(`Theme set to ${next}`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label={`Change theme, current: ${resolvedTheme ?? "system"}`}
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => pick("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => pick("dark")}>Dark</DropdownMenuItem>
          <DropdownMenuItem onClick={() => pick("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <span role="status" aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </>
  );
}
