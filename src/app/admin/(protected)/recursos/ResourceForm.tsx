"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createResource, updateResource } from "@/server/actions/resources.actions";
import { RESOURCE_TYPE_VALUES } from "@/lib/validation/resource.schema";
import type { ResourceDTO } from "@/types/dto/resource.dto";
import styles from "@/styles/admin-form.module.css";

interface FormState {
  error?: string;
}

function buildInput(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    type: String(formData.get("type") ?? "herramienta"),
    url: String(formData.get("url") ?? ""),
    isPublished: formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

export interface ResourceFormProps {
  resource?: ResourceDTO;
}

export function ResourceForm({ resource }: ResourceFormProps) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const input = buildInput(formData);

      try {
        if (resource) {
          await updateResource(resource.id, input);
        } else {
          await createResource(input);
        }
      } catch {
        return { error: "No se pudo guardar el recurso. Revisa los campos." };
      }

      router.push("/admin/recursos");
      return {};
    },
    {},
  );

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.row}>
        <label className={styles.field}>
          <span className="hud-label">Nombre</span>
          <input name="name" defaultValue={resource?.name} required className={styles.input} />
        </label>
        <label className={styles.field}>
          <span className="hud-label">Tipo</span>
          <select name="type" defaultValue={resource?.type ?? "herramienta"} className={styles.input}>
            {RESOURCE_TYPE_VALUES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={styles.field}>
        <span className="hud-label">URL</span>
        <input name="url" defaultValue={resource?.url} required className={styles.input} />
      </label>

      <label className={styles.field}>
        <span className="hud-label">Descripción</span>
        <input name="description" defaultValue={resource?.description ?? ""} className={styles.input} />
      </label>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className="hud-label">Orden</span>
          <input
            type="number"
            name="sortOrder"
            defaultValue={resource?.sortOrder ?? 0}
            className={styles.input}
          />
        </label>
      </div>

      <div className={styles.checkboxRow}>
        <label className={styles.checkboxField}>
          <input type="checkbox" name="isPublished" defaultChecked={resource?.isPublished} />
          <span className="hud-label">Publicado</span>
        </label>
        <label className={styles.checkboxField}>
          <input type="checkbox" name="isFeatured" defaultChecked={resource?.isFeatured} />
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
