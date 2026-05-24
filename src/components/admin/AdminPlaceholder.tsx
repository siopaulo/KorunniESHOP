export function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">
        Modul bude implementován ve fázi 4 (administrace).
      </p>
    </div>
  );
}
