import Link from "next/link";
import styles from "./Sidebar.module.css";

export interface SidebarItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
}

export function Sidebar({ items }: SidebarProps) {
  return (
    <nav className={styles.side} aria-label="Navegación secundaria">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className={`hud-label ${styles.entry} ${item.active ? styles.active : ""}`}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
