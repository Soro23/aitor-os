"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createNowItem, updateNowItem } from "@/server/actions/now-items.actions";
import { NOW_ITEM_CATEGORY_VALUES } from "@/lib/validation/now-item.schema";
import type { NowItemDTO } from "@/types/dto/now-item.dto";
import styles from "@/styles/admin-form.module.css";

interface FormState {
  error?: string;
}

function buildInput(formData: FormData) {
  return {
    category: String(formData.get("category") ?? "building"),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    isActive: formData.get("isActive") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

export interface NowItemFormProps {
  item?: NowItemDTO;
}

export function NowItemForm({ item }: NowItemFormProps) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const input = buildInput(formData);

      try {
        if (item) {
          await updateNowItem(item.id, input);
        } else {
          await createNowItem(input);
        }
      } catch {
        return { error: "No se pudo guardar. Revisa los campos." };
      }

      router.push("/admin/now");
      return {};
    },
    {},
  );

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.row}>
        <label className={styles.field}>
          <span className="hud-label">Categoría</span>
          <select name="category" defaultValue={item?.category ?? "building"} className={styles.input}>
            {NOW_ITEM_CATEGORY_VALUES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className="hud-label">Orden</span>
          <input
            type="number"
            name="sortOrder"
            defaultValue={item?.sortOrder ?? 0}
            className={styles.input}
          />
        </label>
      </div>

      <label className={styles.field}>
        <span className="hud-label">Título</span>
        <input name="title" defaultValue={item?.title} required className={styles.input} />
      </label>

      <label className={styles.field}>
        <span className="hud-label">Descripción</span>
        <input name="description" defaultValue={item?.description ?? ""} className={styles.input} />
      </label>

      <div className={styles.checkboxRow}>
        <label className={styles.checkboxField}>
          <input type="checkbox" name="isActive" defaultChecked={item?.isActive ?? true} />
          <span className="hud-label">Activo</span>
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
