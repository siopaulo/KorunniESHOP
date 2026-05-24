"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";

import { replyToMessageAction } from "@/features/messages/actions";
import { MAIL_TEMPLATES, type MailTemplateKey } from "@/features/messages/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ReplyDialogProps {
  messageId: string;
  to: string;
  originalSubject?: string | null;
  onReplied?: () => void;
  children: React.ReactNode;
}

function buildReplySubject(original: string | null | undefined): string {
  const subject = (original ?? "").trim();
  if (!subject) return "Re: Vaše zpráva";
  return /^re:/i.test(subject) ? subject : `Re: ${subject}`;
}

export function ReplyDialog({
  messageId,
  to,
  originalSubject,
  onReplied,
  children,
}: ReplyDialogProps) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(() => buildReplySubject(originalSubject));
  const [body, setBody] = useState("");
  const [templateKey, setTemplateKey] = useState<MailTemplateKey>("customer_reply");
  const [pending, startTransition] = useTransition();

  function applyTemplate(key: MailTemplateKey) {
    const tpl = MAIL_TEMPLATES[key];
    setTemplateKey(key);
    setSubject(buildReplySubject(originalSubject || tpl.subject));
    setBody(tpl.body);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await replyToMessageAction({
        messageId,
        subject: subject.trim(),
        body: body.trim(),
        templateKey,
      });
      if (res.ok) {
        if (res.providerWarning) toast.warning(res.providerWarning);
        else toast.success("Odpověď byla odeslána.");
        setOpen(false);
        onReplied?.();
      } else {
        toast.error(res.error ?? "Odeslání se nezdařilo.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !pending && setOpen(v)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Odpovědět na zprávu</DialogTitle>
          <DialogDescription>
            E-mail bude odeslán z odesílací adresy obchodu. Bez RESEND_API_KEY se uloží pouze
            draft.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(MAIL_TEMPLATES) as MailTemplateKey[]).map((key) => (
              <Button
                key={key}
                type="button"
                size="sm"
                variant={templateKey === key ? "default" : "outline"}
                onClick={() => applyTemplate(key)}
              >
                {MAIL_TEMPLATES[key].label}
              </Button>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reply-to">Příjemce</Label>
            <Input id="reply-to" value={to} readOnly disabled />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reply-subject">Předmět</Label>
            <Input
              id="reply-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reply-body">Text odpovědi</Label>
            <Textarea
              id="reply-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              <Send className="h-4 w-4" />
              {pending ? "Odesílám…" : "Odeslat odpověď"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
