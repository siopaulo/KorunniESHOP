"use client";

import { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Reply, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ReplyDialog } from "@/components/admin/ReplyDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteMessageAction,
  updateMessageStatusAction,
} from "@/features/messages/actions";
import type { ContactMessageStatus } from "@/features/messages/schema";
import { formatDateCs, cn } from "@/lib/utils";

export interface AdminContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: ContactMessageStatus;
  internal_note: string | null;
  order_number: string | null;
  created_at: string;
}

type StatusFilter = "all" | ContactMessageStatus;

const STATUS_LABELS: Record<ContactMessageStatus, string> = {
  new: "Nové",
  in_progress: "Vyřizuje se",
  resolved: "Vyřízeno",
  archived: "Archivováno",
};

function FilterPill({
  active,
  onClick,
  children,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tone?: "accent";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center rounded-full border px-3 text-sm transition-colors",
        active
          ? tone === "accent"
            ? "border-sage bg-sage text-primary-foreground"
            : "border-foreground bg-foreground text-background"
          : "border-border bg-card hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

export function MessagesTable({ messages: initial }: { messages: AdminContactMessage[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initial);
  const [open, setOpen] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("new");

  const counts = useMemo(
    () => ({
      total: messages.length,
      new: messages.filter((m) => m.status === "new").length,
      inProgress: messages.filter((m) => m.status === "in_progress").length,
      resolved: messages.filter((m) => m.status === "resolved").length,
    }),
    [messages],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter((m) => {
      if (status !== "all" && m.status !== status) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.subject ?? "").toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });
  }, [messages, search, status]);

  async function remove(id: string) {
    const res = await deleteMessageAction(id);
    if (res.error) toast.error(res.error);
    else {
      toast.success(res.success);
      setMessages((arr) => arr.filter((m) => m.id !== id));
      router.refresh();
    }
  }

  async function setStatusFor(id: string, next: ContactMessageStatus) {
    const fd = new FormData();
    fd.set("messageId", id);
    fd.set("status", next);
    const res = await updateMessageStatusAction({}, fd);
    if (res.error) toast.error(res.error);
    else {
      toast.success(res.success);
      setMessages((arr) => arr.map((m) => (m.id === id ? { ...m, status: next } : m)));
      router.refresh();
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <FilterPill active={status === "all"} onClick={() => setStatus("all")}>
            Vše <span className="ml-1 text-muted-foreground">{counts.total}</span>
          </FilterPill>
          <FilterPill active={status === "new"} tone="accent" onClick={() => setStatus("new")}>
            Nové <span className="ml-1 opacity-80">{counts.new}</span>
          </FilterPill>
          <FilterPill active={status === "in_progress"} onClick={() => setStatus("in_progress")}>
            Vyřizuje se <span className="ml-1 text-muted-foreground">{counts.inProgress}</span>
          </FilterPill>
          <FilterPill active={status === "resolved"} onClick={() => setStatus("resolved")}>
            Vyřízeno <span className="ml-1 text-muted-foreground">{counts.resolved}</span>
          </FilterPill>
        </div>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Hledat ve zprávách…"
          className="max-w-sm"
          aria-label="Hledat zprávy"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-10 text-center">
          <p className="font-display text-2xl">Žádné zprávy</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Kontaktní formulář na webu ukládá zprávy sem.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Odesílatel</th>
                <th className="hidden px-5 py-3 md:table-cell">Předmět</th>
                <th className="px-5 py-3">Stav</th>
                <th className="hidden px-5 py-3 lg:table-cell">Datum</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((m) => (
                <Fragment key={m.id}>
                  <tr
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => setOpen(open === m.id ? null : m.id)}
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </td>
                    <td className="hidden max-w-xs truncate px-5 py-3 md:table-cell">
                      {m.subject || m.message.slice(0, 60)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={m.status === "new" ? "default" : "outline"}>
                        {STATUS_LABELS[m.status]}
                      </Badge>
                    </td>
                    <td className="hidden px-5 py-3 text-muted-foreground lg:table-cell">
                      {formatDateCs(m.created_at)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpen(open === m.id ? null : m.id);
                        }}
                      >
                        Detail
                      </Button>
                    </td>
                  </tr>
                  {open === m.id ? (
                    <tr className="bg-muted/20">
                      <td colSpan={5} className="px-5 py-4">
                        <p className="whitespace-pre-wrap text-sm">{m.message}</p>
                        {m.internal_note ? (
                          <p className="mt-3 text-xs text-muted-foreground">
                            Interní poznámka: {m.internal_note}
                          </p>
                        ) : null}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <ReplyDialog
                            messageId={m.id}
                            to={m.email}
                            originalSubject={m.subject}
                            onReplied={() =>
                              setMessages((arr) =>
                                arr.map((x) =>
                                  x.id === m.id ? { ...x, status: "resolved" } : x,
                                ),
                              )
                            }
                          >
                            <Button size="sm" variant="default">
                              <Reply className="h-4 w-4" /> Odpovědět
                            </Button>
                          </ReplyDialog>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setStatusFor(m.id, "in_progress")}
                          >
                            Vyřizuje se
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setStatusFor(m.id, "resolved")}
                          >
                            <CheckCircle2 className="h-4 w-4" /> Vyřízeno
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setStatusFor(m.id, "archived")}
                          >
                            Archivovat
                          </Button>
                          <ConfirmDialog
                            title="Smazat zprávu?"
                            description="Tato akce je nevratná."
                            onConfirm={() => remove(m.id)}
                          >
                            <Button size="sm" variant="outline" className="text-destructive">
                              <Trash2 className="h-4 w-4" /> Smazat
                            </Button>
                          </ConfirmDialog>
                        </div>
                        <div className="mt-4">
                          <Label htmlFor={`note-${m.id}`} className="text-xs">
                            Interní poznámka
                          </Label>
                          <Textarea
                            id={`note-${m.id}`}
                            defaultValue={m.internal_note ?? ""}
                            rows={2}
                            className="mt-1"
                            onBlur={async (e) => {
                              const fd = new FormData();
                              fd.set("messageId", m.id);
                              fd.set("status", m.status);
                              fd.set("internalNote", e.target.value);
                              await updateMessageStatusAction({}, fd);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
