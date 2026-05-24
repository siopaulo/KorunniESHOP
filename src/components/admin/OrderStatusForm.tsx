"use client";

import { useActionState } from "react";
import { toast } from "sonner";

import { updateOrderStatusAction, type ActionResult } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { OrderStatus } from "@/types/database";

const initial: ActionResult = {};

const statuses: { value: OrderStatus; label: string }[] = [
  { value: "awaiting_payment", label: "Čeká na platbu" },
  { value: "paid", label: "Zaplaceno" },
  { value: "processing", label: "Připravuje se" },
  { value: "shipped", label: "Odesláno" },
  { value: "completed", label: "Dokončeno" },
  { value: "cancelled", label: "Zrušeno" },
  { value: "returned", label: "Reklamace" },
];

export function OrderStatusForm({
  orderId,
  currentStatus,
  adminNote,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  adminNote?: string | null;
}) {
  const [state, action, pending] = useActionState(updateOrderStatusAction, initial);
  if (state.success) toast.success(state.success);
  if (state.error) toast.error(state.error);

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <input type="hidden" name="orderId" value={orderId} />
      <div className="space-y-2">
        <Label htmlFor="status">Stav objednávky</Label>
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="adminNote">Poznámka admina</Label>
        <Textarea id="adminNote" name="adminNote" defaultValue={adminNote ?? ""} />
      </div>
      <Button type="submit" disabled={pending}>
        Aktualizovat stav
      </Button>
    </form>
  );
}
