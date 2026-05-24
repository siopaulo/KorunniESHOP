import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl font-semibold text-sage">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold">Stránka nenalezena</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Omlouváme se, ale hledaná stránka neexistuje nebo byla přesunuta.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Zpět na úvod</Link>
      </Button>
    </div>
  );
}
