"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { updateLeadPipeline } from "@/server/actions/contact-messages.actions";
import { LEAD_PIPELINE_STATUS_VALUES } from "@/lib/validation/contact-message.schema";
import { LEAD_STATUS_LABELS } from "./lead-status";
import type { ContactMessageDTO } from "@/types/dto/contact-message.dto";
import styles from "@/styles/admin-form.module.css";

interface FormState {
  error?: string;
}

function buildInput(formData: FormData) {
  return {
    pipelineStatus: String(formData.get("pipelineStatus") ?? "nuevo"),
    internalNotes: String(formData.get("internalNotes") ?? ""),
  };
}

export interface LeadDetailFormProps {
  lead: ContactMessageDTO;
}

export function LeadDetailForm({ lead }: LeadDetailFormProps) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const input = buildInput(formData);

      try {
        await updateLeadPipeline(lead.id, input);
      } catch {
        return { error: "No se pudo guardar. Revisa los campos." };
      }

      router.refresh();
      return {};
    },
    {},
  );

  return (
    <form action={formAction} className={styles.form}>
      <label className={styles.field}>
        <span className="hud-label">Fase</span>
        <select name="pipelineStatus" defaultValue={lead.pipelineStatus} className={styles.input}>
          {LEAD_PIPELINE_STATUS_VALUES.map((status) => (
            <option key={status} value={status}>
              {LEAD_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className="hud-label">Notas internas</span>
        <textarea name="internalNotes" defaultValue={lead.internalNotes ?? ""} rows={5} className={styles.input} />
      </label>

      {state.error ? (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={isPending} className={styles.submit}>
        {isPending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
