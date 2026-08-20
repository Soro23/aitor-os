"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createProposalTemplate, updateProposalTemplate } from "@/server/actions/proposal-templates.actions";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor/MarkdownEditor";
import type { ProposalTemplateDTO } from "@/types/dto/proposal-template.dto";
import styles from "@/styles/admin-form.module.css";

interface FormState {
  error?: string;
}

function buildInput(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    content: String(formData.get("content") ?? ""),
    isActive: formData.get("isActive") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

export interface ProposalTemplateFormProps {
  template?: ProposalTemplateDTO;
}

export function ProposalTemplateForm({ template }: ProposalTemplateFormProps) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const input = buildInput(formData);

      try {
        if (template) {
          await updateProposalTemplate(template.id, input);
        } else {
          await createProposalTemplate(input);
        }
      } catch {
        return { error: "No se pudo guardar la plantilla. Revisa los campos." };
      }

      router.push("/admin/plantillas");
      return {};
    },
    {},
  );

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.row}>
        <label className={styles.field}>
          <span className="hud-label">Nombre</span>
          <input name="name" defaultValue={template?.name} required className={styles.input} />
        </label>
        <label className={styles.field}>
          <span className="hud-label">Orden</span>
          <input
            type="number"
            name="sortOrder"
            defaultValue={template?.sortOrder ?? 0}
            className={styles.input}
          />
        </label>
      </div>

      <label className={styles.field}>
        <span className="hud-label">Resumen</span>
        <input name="summary" defaultValue={template?.summary ?? ""} className={styles.input} />
      </label>

      <MarkdownEditor label="Contenido" name="content" defaultValue={template?.content ?? ""} required />

      <div className={styles.checkboxRow}>
        <label className={styles.checkboxField}>
          <input type="checkbox" name="isActive" defaultChecked={template?.isActive ?? true} />
          <span className="hud-label">Activa</span>
        </label>
      </div>

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
