"use client";

import { useActionState } from "react";
import {
  submitContactMessage,
  type SubmitContactMessageState,
} from "@/server/actions/contact-messages.actions";
import styles from "./ContactForm.module.css";

const initialState: SubmitContactMessageState = {};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactMessage, initialState);

  if (state.success) {
    return (
      <p className={styles.success} role="status">
        Mensaje enviado. Gracias por escribir — te responderé lo antes posible.
      </p>
    );
  }

  return (
    <form action={formAction} className={styles.form}>
      {/* Honeypot anti-spam: invisible para personas, los bots que rellenan
          todos los inputs del formulario caen en la trampa. Ver
          submitContactMessage, que descarta el envío en silencio si llega relleno. */}
      <label className={styles.honeypot} aria-hidden="true">
        Web
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className={styles.field}>
        <span className="hud-label">Nombre</span>
        <input name="name" required maxLength={120} className={styles.input} />
      </label>

      <label className={styles.field}>
        <span className="hud-label">Email</span>
        <input type="email" name="email" required className={styles.input} />
      </label>

      <label className={styles.field}>
        <span className="hud-label">Tipo de proyecto (opcional)</span>
        <input name="interest" maxLength={200} className={styles.input} />
      </label>

      <label className={styles.field}>
        <span className="hud-label">Mensaje</span>
        <textarea name="message" required minLength={10} maxLength={2000} rows={6} className={styles.textarea} />
      </label>

      {state.error ? (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={isPending} className={styles.submit}>
        {isPending ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}
