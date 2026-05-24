import { AdminContentContainer } from "@/components/admin/AdminContentContainer";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MessagesTable } from "@/components/admin/MessagesTable";
import { getAdminContactMessages } from "@/lib/data/admin-messages";
import { isEmailConfigured } from "@/lib/email/send";

export default async function AdminMessagesPage() {
  const messages = await getAdminContactMessages();
  const emailReady = isEmailConfigured();

  return (
    <>
      <AdminPageHeader
        title="Zprávy"
        description={`${messages.length} kontaktních zpráv z webu`}
      />

      {!emailReady ? (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          E-mail provider není nakonfigurován (RESEND_API_KEY). Odpovědi se ukládají jako draft v
          logu, ale neodesílají se.
        </p>
      ) : null}

      <AdminContentContainer width="wide">
        {messages.length === 0 ? (
          <AdminEmptyState
            title="Zatím žádné zprávy"
            description="Zprávy z kontaktního formuláře se zobrazí zde po uložení do databáze."
          />
        ) : (
          <MessagesTable messages={messages} />
        )}
      </AdminContentContainer>
    </>
  );
}
