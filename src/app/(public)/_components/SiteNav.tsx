"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./SiteNav.module.css";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/garden", label: "Garden" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/now", label: "Now" },
  { href: "/lab", label: "Lab" },
  { href: "/recursos", label: "Recursos" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link href="/" className={`hud-label ${styles.brand}`}>
          Aitor OS
        </Link>
        <button
          type="button"
          className={`hud-label ${styles.toggle}`}
          aria-expanded={open}
          aria-controls="site-nav-list"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Cerrar" : "Menú"}
        </button>
      </div>
      <nav aria-label="Navegación principal">
        <ul id="site-nav-list" className={`${styles.list} ${open ? styles.listOpen : ""}`}>
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={`hud-label ${styles.link}`} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
