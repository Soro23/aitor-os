import Link from "next/link";
import { DataTable } from "@/components/admin/DataTable/DataTable";
import { ToggleSwitch } from "@/components/admin/ToggleSwitch/ToggleSwitch";
import { Panel } from "@/components/ui/Panel/Panel";
import { proposalTemplatesRepository } from "@/server/repositories/proposal-templates.repository";
import { setProposalTemplateActive, deleteProposalTemplate } from "@/server/actions/proposal-templates.actions";
import type { ProposalTemplateDTO } from "@/types/dto/proposal-template.dto";
import styles from "@/styles/admin-list.module.css";

export default async function AdminProposalTemplatesPage() {
  const templates = await proposalTemplatesRepository.findAll();

  return (
    <div className={styles.stack}>
      <div className={styles.header}>
        <h1 className={styles.title}>Plantillas de propuesta</h1>
        <Link href="/admin/plantillas/nuevo" className={styles.newLink}>
          + Nueva
        </Link>
      </div>
      <Panel accent="violet">
        <DataTable<ProposalTemplateDTO>
          rows={templates}
          getRowKey={(template) => template.id}
          emptyMessage="Todavía no hay plantillas."
          columns={[
            { header: "Nombre", cell: (template) => template.name },
            { header: "Resumen", cell: (template) => template.summary ?? "—" },
            {
              header: "Estado",
              cell: (template) => (
                <ToggleSwitch
                  value={template.isActive}
                  onLabel="Activa"
                  offLabel="Archivada"
                  tone="violet"
                  onToggle={setProposalTemplateActive.bind(null, template.id)}
                />
              ),
            },
            {
              header: "Acciones",
              cell: (template) => (
                <div className={styles.actions}>
                  <Link href={`/admin/plantillas/${template.id}/editar`} className={styles.actionLink}>
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteProposalTemplate(template.id);
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
