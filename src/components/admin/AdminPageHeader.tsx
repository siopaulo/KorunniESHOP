import Link from "next/link";
import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

/** Pattern: EsterkyGalerie/components/admin/page-header.tsx — e-shop varianta s font-display. */
export function AdminPageHeader({ title, description, actions, breadcrumbs }: AdminPageHeaderProps) {
  return (
    <header className="-mx-4 -mt-4 mb-6 border-b border-border bg-card sm:-mx-6 sm:-mt-6">
      <div className="px-4 py-5 sm:px-6 sm:py-6">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Drobečková navigace" className="mb-3 text-xs text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              {breadcrumbs.map((b, i) => (
                <li key={i} className="flex items-center gap-2">
                  {b.href ? (
                    <Link href={b.href} className="hover:text-foreground">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-foreground/80">{b.label}</span>
                  )}
                  {i < breadcrumbs.length - 1 ? <span aria-hidden="true">/</span> : null}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h1>
            {description ? (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">{actions}</div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
