import type { ReactNode } from "react";
import { requireAdminOrRedirect } from "@/lib/auth/requireAdmin";
import { logout } from "@/server/actions/auth.actions";
import styles from "./layout.module.css";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminOrRedirect();

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <span className="hud-label">Aitor OS · Admin</span>
        <form action={logout}>
          <button type="submit" className={styles.logout}>
            Cerrar sesión
          </button>
        </form>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
