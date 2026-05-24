import { Skeleton } from "@/components/ui/skeleton";

interface AdminTableSkeletonProps {
  title: string;
  description?: string;
  rows?: number;
  withSearch?: boolean;
}

/** Pattern: EsterkyGalerie/components/admin/admin-table-skeleton.tsx */
export function AdminTableSkeleton({
  title,
  description,
  rows = 6,
  withSearch = true,
}: AdminTableSkeletonProps) {
  return (
    <div className="space-y-6">
      <div className="-mx-4 border-b border-border bg-card px-4 py-5 sm:-mx-6 sm:px-6">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : (
          <Skeleton className="mt-2 h-4 w-64" />
        )}
      </div>
      {withSearch ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-10 w-full sm:max-w-xs" />
        </div>
      ) : null}
      <ul className="space-y-3 md:hidden">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className="rounded-2xl border border-border bg-card p-4">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </li>
        ))}
      </ul>
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card md:block">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-border/60 px-4 py-4 last:border-0">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
