"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createStackItem, updateStackItem } from "@/server/actions/stack-items.actions";
import { STACK_CATEGORY_VALUES, STACK_USAGE_LEVEL_VALUES } from "@/lib/validation/stack-item.schema";
import type { StackItemDTO } from "@/types/dto/stack-item.dto";
import styles from "@/styles/admin-form.module.css";

interface FormState {
  error?: string;
}

function buildInput(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? "desarrollo"),
    usageLevel: String(formData.get("usageLevel") ?? "daily"),
    isVisible: formData.get("isVisible") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

export interface StackItemFormProps {
  item?: StackItemDTO;
}

export function StackItemForm({ item }: StackItemFormProps) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const input = buildInput(formData);

      try {
        if (item) {
          await updateStackItem(item.id, input);
        } else {
          await createStackItem(input);
        }
      } catch {
        return { error: "No se pudo guardar. Revisa los campos." };
      }

      router.push("/admin/stack");
      return {};
    },
    {},
  );

  return (
    <form action={formAction} className={styles.form}>
      <label className={styles.field}>
        <span className="hud-label">Nombre</span>
        <input name="name" defaultValue={item?.name} required className={styles.input} />
      </label>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className="hud-label">Categoría</span>
          <select
            name="category"
            defaultValue={item?.category ?? "desarrollo"}
            className={styles.input}
          >
            {STACK_CATEGORY_VALUES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className="hud-label">Nivel de uso</span>
          <select
            name="usageLevel"
            defaultValue={item?.usageLevel ?? "daily"}
            className={styles.input}
          >
            {STACK_USAGE_LEVEL_VALUES.map((level) => (
              <option key={level} value={level}>
                {level}
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

      <div className={styles.checkboxRow}>
        <label className={styles.checkboxField}>
          <input type="checkbox" name="isVisible" defaultChecked={item?.isVisible ?? true} />
          <span className="hud-label">Visible</span>
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
