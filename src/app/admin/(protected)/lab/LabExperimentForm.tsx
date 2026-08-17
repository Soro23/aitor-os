"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createLabExperiment, updateLabExperiment } from "@/server/actions/lab-experiments.actions";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor/MarkdownEditor";
import { LAB_EXPERIMENT_STATUS_VALUES } from "@/lib/validation/lab-experiment.schema";
import { formatLabNumber } from "@/lib/format-lab-number";
import type { LabExperimentDTO } from "@/types/dto/lab-experiment.dto";
import styles from "@/styles/admin-form.module.css";

interface FormState {
  error?: string;
}

function buildInput(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    stack: String(formData.get("stack") ?? "")
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean),
    status: String(formData.get("status") ?? "experiment"),
    githubUrl: String(formData.get("githubUrl") ?? ""),
    demoUrl: String(formData.get("demoUrl") ?? ""),
    isPublished: formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

export interface LabExperimentFormProps {
  experiment?: LabExperimentDTO;
}

export function LabExperimentForm({ experiment }: LabExperimentFormProps) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const input = buildInput(formData);

      try {
        if (experiment) {
          await updateLabExperiment(experiment.id, input);
        } else {
          await createLabExperiment(input);
        }
      } catch {
        return { error: "No se pudo guardar el experimento. Revisa los campos." };
      }

      router.push("/admin/lab");
      return {};
    },
    {},
  );

  return (
    <form action={formAction} className={styles.form}>
      {experiment ? <p className="hud-label">{formatLabNumber(experiment.labNumber)}</p> : null}

      <label className={styles.field}>
        <span className="hud-label">Título</span>
        <input name="title" defaultValue={experiment?.title} required className={styles.input} />
      </label>

      <MarkdownEditor
        label="Descripción"
        name="description"
        defaultValue={experiment?.description ?? ""}
      />

      <label className={styles.field}>
        <span className="hud-label">Stack (separado por coma)</span>
        <input
          name="stack"
          defaultValue={experiment?.stack.join(", ")}
          className={styles.input}
        />
      </label>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className="hud-label">Estado</span>
          <select
            name="status"
            defaultValue={experiment?.status ?? "experiment"}
            className={styles.input}
          >
            {LAB_EXPERIMENT_STATUS_VALUES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className="hud-label">Orden</span>
          <input
            type="number"
            name="sortOrder"
            defaultValue={experiment?.sortOrder ?? 0}
            className={styles.input}
          />
        </label>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className="hud-label">GitHub URL</span>
          <input
            name="githubUrl"
            defaultValue={experiment?.githubUrl ?? ""}
            className={styles.input}
          />
        </label>
        <label className={styles.field}>
          <span className="hud-label">Demo URL</span>
          <input
            name="demoUrl"
            defaultValue={experiment?.demoUrl ?? ""}
            className={styles.input}
          />
        </label>
      </div>

      <div className={styles.checkboxRow}>
        <label className={styles.checkboxField}>
          <input type="checkbox" name="isPublished" defaultChecked={experiment?.isPublished} />
          <span className="hud-label">Publicado</span>
        </label>
        <label className={styles.checkboxField}>
          <input type="checkbox" name="isFeatured" defaultChecked={experiment?.isFeatured} />
          <span className="hud-label">Destacado</span>
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
