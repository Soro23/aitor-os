"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createLead } from "@/server/actions/contact-messages.actions";
import styles from "@/styles/admin-form.module.css";

interface FormState {
  error?: string;
}

function buildInput(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
    interest: String(formData.get("interest") ?? "") || undefined,
  };
}

export function LeadForm() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const input = buildInput(formData);

      try {
        await createLead(input);
      } catch {
        return { error: "No se pudo guardar. Revisa los campos." };
      }

      router.push("/admin/leads");
      return {};
    },
    {},
  );

  return (
    <form action={formAction} className={styles.form}>
      <label className={styles.field}>
        <span className="hud-label">Nombre</span>
        <input name="name" required className={styles.input} />
      </label>

      <label className={styles.field}>
        <span className="hud-label">Email</span>
        <input type="email" name="email" required className={styles.input} />
      </label>

      <label className={styles.field}>
        <span className="hud-label">Interés</span>
        <input name="interest" className={styles.input} />
      </label>

      <label className={styles.field}>
        <span className="hud-label">Notas / mensaje inicial</span>
        <textarea name="message" rows={4} className={styles.input} />
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
