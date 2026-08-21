import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Panel } from "@/components/ui/Panel/Panel";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { contactMessagesRepository } from "@/server/repositories/contact-messages.repository";
import { markMessageAsRead, deleteMessage } from "@/server/actions/contact-messages.actions";
import styles from "@/styles/admin-form.module.css";
import listStyles from "@/styles/admin-list.module.css";

export default async function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const message = await contactMessagesRepository.findById(id);

  if (!message) {
    notFound();
  }

  const receivedAt = new Date(message.createdAt).toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className={styles.form}>
      <p className="hud-label">Mensajes · {message.name}</p>

      <Panel accent="amber">
        <p>
          <strong>{message.name}</strong> · {message.email}
        </p>
        {message.interest ? <p>Interés: {message.interest}</p> : null}
        <p style={{ whiteSpace: "pre-wrap" }}>{message.message}</p>
        <p className="hud-label">Recibido el {receivedAt}</p>
        <StatusBadge label={message.isRead ? "Leído" : "Sin leer"} tone={message.isRead ? "green" : "amber"} />
      </Panel>

      <div className={listStyles.actions}>
        {!message.isRead ? (
          <form
            action={async () => {
              "use server";
              await markMessageAsRead(id);
            }}
          >
            <button type="submit" className={listStyles.actionButton}>
              Marcar como leído
            </button>
          </form>
        ) : null}

        <form
          action={async () => {
            "use server";
            await deleteMessage(id);
            redirect("/admin/mensajes");
          }}
        >
          <button type="submit" className={listStyles.deleteButton}>
            Eliminar
          </button>
        </form>

        <Link href="/admin/mensajes" className={listStyles.actionLink}>
          ← Volver a mensajes
        </Link>
      </div>
    </div>
  );
}
