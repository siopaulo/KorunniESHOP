import type { Metadata } from "next";

interface PageShellProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <div className="section-padding px-4 sm:px-0">
      <div className="container-narrow">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}

export function createPageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: { title, description },
  };
}
