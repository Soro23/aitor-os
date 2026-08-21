import Link from "next/link";
import { DataTable } from "@/components/admin/DataTable/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { Panel } from "@/components/ui/Panel/Panel";
import { contactMessagesRepository } from "@/server/repositories/contact-messages.repository";
import { markMessageAsRead, deleteMessage } from "@/server/actions/contact-messages.actions";
import type { ContactMessageDTO } from "@/types/dto/contact-message.dto";
import styles from "@/styles/admin-list.module.css";

export default async function AdminMessagesPage() {
  const messages = await contactMessagesRepository.findAll();

  return (
    <div className={styles.stack}>
      <div className={styles.header}>
        <h1 className={styles.title}>Mensajes</h1>
      </div>
      <Panel accent="amber">
        <DataTable<ContactMessageDTO>
          rows={messages}
          getRowKey={(message) => message.id}
          emptyMessage="Todavía no hay mensajes."
          columns={[
            {
              header: "Nombre",
              cell: (message) => (
                <Link href={`/admin/mensajes/${message.id}`} className={styles.actionLink}>
                  {message.name}
                </Link>
              ),
            },
            { header: "Email", cell: (message) => message.email },
            { header: "Interés", cell: (message) => message.interest ?? "—" },
            {
              header: "Mensaje",
              cell: (message) =>
                message.message.length > 80 ? `${message.message.slice(0, 80)}…` : message.message,
            },
            {
              header: "Estado",
              cell: (message) => (
                <StatusBadge
                  label={message.isRead ? "Leído" : "Sin leer"}
                  tone={message.isRead ? "green" : "amber"}
                />
              ),
            },
            {
              header: "Acciones",
              cell: (message) => (
                <div className={styles.actions}>
                  {!message.isRead ? (
                    <form
                      action={async () => {
                        "use server";
                        await markMessageAsRead(message.id);
                      }}
                    >
                      <button type="submit" className={styles.actionButton}>
                        Marcar como leído
                      </button>
                    </form>
                  ) : null}
                  <form
                    action={async () => {
                      "use server";
                      await deleteMessage(message.id);
                    }}
                  >
                    <button type="submit" className={styles.deleteButton}>
                      Eliminar
                    </button>
                  </form>
                </div>
              ),
            },
          ]}
        />
      </Panel>
    </div>
  );
}
