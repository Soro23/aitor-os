import Link from "next/link";
import styles from "./Navbar.module.css";

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavbarProps {
  brand: string;
  links: NavLink[];
}

export function Navbar({ brand, links }: NavbarProps) {
  return (
    <nav className={styles.nav}>
      <span className={`hud-label ${styles.brand}`}>{brand}</span>
      <ul className={styles.links}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={`hud-label ${styles.link} ${link.active ? styles.active : ""}`}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
