"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
    void import("@sentry/nextjs").then((Sentry) => {
      Sentry.captureException(error);
    });
  }, [error]);

  return (
    <html lang="cs">
      <body className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
        <h1 className="font-display text-2xl font-semibold">Něco se pokazilo</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          Omlouváme se za potíže. Zkuste stránku načíst znovu.
        </p>
        <Button className="mt-6" onClick={() => reset()}>
          Zkusit znovu
        </Button>
      </body>
    </html>
  );
}
