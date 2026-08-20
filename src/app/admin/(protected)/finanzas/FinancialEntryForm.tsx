"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createFinancialEntry, updateFinancialEntry } from "@/server/actions/financial-entries.actions";
import { FINANCIAL_ENTRY_TYPE_VALUES } from "@/lib/validation/financial-entry.schema";
import type { FinancialEntryDTO } from "@/types/dto/financial-entry.dto";
import type { ContactMessageDTO } from "@/types/dto/contact-message.dto";
import styles from "@/styles/admin-form.module.css";

interface FormState {
  error?: string;
}

function buildInput(formData: FormData) {
  const leadId = String(formData.get("leadId") ?? "");
  return {
    type: String(formData.get("type") ?? "ingreso"),
    amount: Number(formData.get("amount") ?? 0),
    category: String(formData.get("category") ?? "") || undefined,
    description: String(formData.get("description") ?? ""),
    entryDate: String(formData.get("entryDate") ?? ""),
    leadId: leadId || undefined,
  };
}

export interface FinancialEntryFormProps {
  entry?: FinancialEntryDTO;
  leads: ContactMessageDTO[];
}

export function FinancialEntryForm({ entry, leads }: FinancialEntryFormProps) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const input = buildInput(formData);

      try {
        if (entry) {
          await updateFinancialEntry(entry.id, input);
        } else {
          await createFinancialEntry(input);
        }
      } catch {
        return { error: "No se pudo guardar el movimiento. Revisa los campos." };
      }

      router.push("/admin/finanzas");
      return {};
    },
    {},
  );

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.row}>
        <label className={styles.field}>
          <span className="hud-label">Tipo</span>
          <select name="type" defaultValue={entry?.type ?? "ingreso"} className={styles.input}>
            {FINANCIAL_ENTRY_TYPE_VALUES.map((type) => (
              <option key={type} value={type}>
                {type === "ingreso" ? "Ingreso" : "Gasto"}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className="hud-label">Importe (€)</span>
          <input
            type="number"
            name="amount"
            step="0.01"
            min="0.01"
            defaultValue={entry?.amount}
            required
            className={styles.input}
          />
        </label>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className="hud-label">Categoría</span>
          <input name="category" defaultValue={entry?.category ?? ""} className={styles.input} />
        </label>
        <label className={styles.field}>
          <span className="hud-label">Fecha</span>
          <input
            type="date"
            name="entryDate"
            defaultValue={entry?.entryDate ?? new Date().toISOString().slice(0, 10)}
            required
            className={styles.input}
          />
        </label>
      </div>

      <label className={styles.field}>
        <span className="hud-label">Descripción</span>
        <textarea name="description" rows={3} defaultValue={entry?.description} required className={styles.input} />
      </label>

      <label className={styles.field}>
        <span className="hud-label">Lead vinculado</span>
        <select name="leadId" defaultValue={entry?.leadId ?? ""} className={styles.input}>
          <option value="">Sin lead vinculado</option>
          {leads.map((lead) => (
            <option key={lead.id} value={lead.id}>
              {lead.name} ({lead.email})
            </option>
          ))}
        </select>
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
