"use client";

import { useActionState } from "react";
import { login, type LoginActionState } from "@/server/actions/auth.actions";
import styles from "./LoginForm.module.css";

const initialState: LoginActionState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className={styles.form}>
      <label className={styles.field}>
        <span className="hud-label">Email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className={styles.input}
        />
      </label>
      <label className={styles.field}>
        <span className="hud-label">Contraseña</span>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="current-password"
          className={styles.input}
        />
      </label>
      {state.error ? (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={isPending} className={styles.submit}>
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
