import Link from "next/link";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.bar}>
        <p className={styles.copyright}>Aitor Solana Roca © 2026</p>
        <Link href="/admin" className={styles.adminLink}>
          Admin
        </Link>
      </div>
    </footer>
  );
}
