export const ORDER_STATUS_LABELS: Record<string, string> = {
  new: "Nová",
  awaiting_payment: "Čeká na platbu",
  paid: "Zaplaceno",
  processing: "Připravuje se",
  shipped: "Odesláno",
  completed: "Dokončeno",
  cancelled: "Zrušeno",
  returned: "Reklamace",
};

export function orderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}
