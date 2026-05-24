"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-2xl font-semibold">Chyba načítání</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Stránku se nepodařilo načíst. Zkuste to prosím znovu.
      </p>
      <Button className="mt-6" onClick={() => reset()}>
        Zkusit znovu
      </Button>
    </div>
  );
}
