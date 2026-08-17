import { Panel } from "@/components/ui/Panel/Panel";
import { LoginForm } from "./LoginForm";
import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <div className={styles.wrapper}>
      <Panel accent="cyan" className={styles.panel}>
        <p className="hud-label">Aitor OS · Acceso admin</p>
        <h1 className={styles.title}>Login</h1>
        <LoginForm />
      </Panel>
    </div>
  );
}
