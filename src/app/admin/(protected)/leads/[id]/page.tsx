import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/Panel/Panel";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { Stepper } from "@/components/ui/Stepper/Stepper";
import { contactMessagesRepository } from "@/server/repositories/contact-messages.repository";
import { LeadDetailForm } from "../LeadDetailForm";
import { LEAD_STATUS_LABELS } from "../lead-status";
import styles from "@/styles/admin-form.module.css";

const PIPELINE_STEPS = ["Nuevo", "Contactado", "Propuesta enviada", "Ganado"];
const STEP_INDEX: Record<string, number> = {
  nuevo: 1,
  contactado: 2,
  propuesta_enviada: 3,
  ganado: 4,
};

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await contactMessagesRepository.findById(id);

  if (!lead) {
    notFound();
  }

  return (
    <div className={styles.form}>
      <p className="hud-label">Leads · {lead.name}</p>

      <Panel accent="cyan">
        <p>
          <strong>{lead.name}</strong> · {lead.email}
        </p>
        {lead.interest ? <p>Interés: {lead.interest}</p> : null}
        <p>{lead.message}</p>
      </Panel>

      <Panel accent="violet">
        {lead.pipelineStatus === "perdido" ? (
          <StatusBadge label={LEAD_STATUS_LABELS.perdido} tone="red" />
        ) : (
          <Stepper steps={PIPELINE_STEPS} currentStep={STEP_INDEX[lead.pipelineStatus]} />
        )}
      </Panel>

      <LeadDetailForm lead={lead} />
    </div>
  );
}
