"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    // Log to an error reporting service when available
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-24 text-center">
      <div className="space-y-6">
        <h1 className="text-6xl font-bold tracking-tight sm:text-7xl">500</h1>
        <h2 className="text-2xl font-semibold text-muted-foreground">
          Something went wrong
        </h2>
        <p className="text-muted-foreground">
          An unexpected error occurred. You can try again or go back home.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button onClick={reset}>Try Again</Button>
          <Button variant="outline" asChild>
            <a href="/">Go Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
