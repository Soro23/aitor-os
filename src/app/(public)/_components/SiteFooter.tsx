import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/social-links";
import styles from "./SiteFooter.module.css";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/now", label: "Now" },
  { href: "/contacto", label: "Contacto" },
];

const EXPLORE_LINKS = [
  { href: "/garden", label: "Garden" },
  { href: "/lab", label: "Lab" },
  { href: "/recursos", label: "Recursos" },
  { href: "/stack", label: "Stack" },
];

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M6.94 8.5H3.56V20.5H6.94V8.5ZM5.25 3.5A1.97 1.97 0 1 0 5.27 7.44 1.97 1.97 0 0 0 5.25 3.5ZM20.44 20.5H17.06V14.3C17.06 12.8 16.5 11.78 15.16 11.78C14.14 11.78 13.55 12.47 13.29 13.13C13.19 13.37 13.17 13.71 13.17 14.05V20.5H9.79S9.83 9.4 9.79 8.5H13.17V9.94C13.62 9.24 14.43 8.24 16.48 8.24C19.02 8.24 20.44 9.9 20.44 13.47V20.5Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="M3 6l9 7 9-7" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <Link href="/" className={`hud-label ${styles.brand}`}>
            Aitor OS
          </Link>
          <p className={styles.description}>
            Técnico informático y desarrollador centrado en sistemas, automatización e IA.
          </p>
          <div className={styles.social}>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noreferrer"
              className={styles.socialIcon}
              aria-label="GitHub"
            >
              <GithubIcon />
            </a>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noreferrer"
              className={styles.socialIcon}
              aria-label="LinkedIn"
            >
              <LinkedinIcon />
            </a>
            <Link href="/contacto" className={styles.socialIcon} aria-label="Contacto">
              <MailIcon />
            </Link>
          </div>
        </div>

        <div>
          <p className={`hud-label ${styles.colTitle}`}>Navegación</p>
          <ul className={styles.linkList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={`hud-label ${styles.colTitle}`}>Explora</p>
          <ul className={styles.linkList}>
            {EXPLORE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={`hud-label ${styles.copyright}`}>2026 <span>©</span> Aitor Solana Roca</p>
        <Link href="/admin" className={styles.adminLink}>
          Admin
        </Link>
      </div>
    </footer>
  );
}
