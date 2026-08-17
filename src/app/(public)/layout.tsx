import type { ReactNode } from "react";
import { SiteNav } from "./_components/SiteNav";
import styles from "./layout.module.css";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteNav />
      <main className={styles.main}>{children}</main>
    </>
  );
}
