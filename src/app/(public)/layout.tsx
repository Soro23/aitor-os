import type { ReactNode } from "react";
import { SiteNav } from "./_components/SiteNav";
import { SiteFooter } from "./_components/SiteFooter";
import styles from "./layout.module.css";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <SiteNav />
      <main className={styles.main}>{children}</main>
      <SiteFooter />
    </div>
  );
}
