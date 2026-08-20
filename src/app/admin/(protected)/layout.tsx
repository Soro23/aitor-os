import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdminOrRedirect } from "@/lib/auth/requireAdmin";
import { logout } from "@/server/actions/auth.actions";
import { ThemeToggle } from "@/components/ui/ThemeToggle/ThemeToggle";
import styles from "./layout.module.css";

const NAV_LINKS = [
  { href: "/admin/proyectos", label: "Proyectos" },
  { href: "/admin/garden", label: "Garden" },
  { href: "/admin/lab", label: "Lab" },
  { href: "/admin/recursos", label: "Recursos" },
  { href: "/admin/now", label: "Now" },
  { href: "/admin/stack", label: "Stack" },
  { href: "/admin/mensajes", label: "Mensajes" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminOrRedirect();

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link href="/admin" className={`hud-label ${styles.brand}`}>
          Aitor OS · Admin
        </Link>
        <div className="hud-actions-row">
          <ThemeToggle />
          <form action={logout}>
            <button type="submit" className={styles.logout}>
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>
      <nav aria-label="Navegación admin" className={styles.nav}>
        <ul className={styles.navList}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
