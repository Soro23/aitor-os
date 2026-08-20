import Link from "next/link";
import { DataTable } from "@/components/admin/DataTable/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { Panel } from "@/components/ui/Panel/Panel";
import { contactMessagesRepository } from "@/server/repositories/contact-messages.repository";
import { updateLeadPipeline } from "@/server/actions/contact-messages.actions";
import { LeadStatusSelect } from "./LeadStatusSelect";
import { LEAD_STATUS_LABELS, LEAD_STATUS_TONE } from "./lead-status";
import type { ContactMessageDTO } from "@/types/dto/contact-message.dto";
import styles from "@/styles/admin-list.module.css";

export default async function AdminLeadsPage() {
  const leads = await contactMessagesRepository.findAll();

  return (
    <div className={styles.stack}>
      <div className={styles.header}>
        <h1 className={styles.title}>Leads</h1>
        <Link href="/admin/leads/nuevo" className={styles.newLink}>
          + Nuevo
        </Link>
      </div>
      <Panel accent="cyan">
        <DataTable<ContactMessageDTO>
          rows={leads}
          getRowKey={(lead) => lead.id}
          emptyMessage="Todavía no hay leads."
          columns={[
            {
              header: "Nombre",
              cell: (lead) => (
                <Link href={`/admin/leads/${lead.id}`} className={styles.actionLink}>
                  {lead.name}
                </Link>
              ),
            },
            { header: "Email", cell: (lead) => lead.email },
            { header: "Interés", cell: (lead) => lead.interest ?? "—" },
            {
              header: "Fase",
              cell: (lead) => (
                <StatusBadge label={LEAD_STATUS_LABELS[lead.pipelineStatus]} tone={LEAD_STATUS_TONE[lead.pipelineStatus]} />
              ),
            },
            {
              header: "Cambiar fase",
              cell: (lead) => (
                <LeadStatusSelect value={lead.pipelineStatus} onChange={updateLeadPipeline.bind(null, lead.id)} />
              ),
            },
          ]}
        />
      </Panel>
    </div>
  );
}
