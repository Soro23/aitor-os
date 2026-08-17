import { Panel } from "@/components/ui/Panel/Panel";
import { ContactForm } from "./ContactForm";
import styles from "./page.module.css";

export default function ContactoPage() {
  return (
    <Panel accent="amber">
      <p className="hud-label">Contacto</p>
      <h1 className={styles.title}>Hablemos</h1>
      <p className={styles.description}>
        Development, AI projects, automatización, infraestructura o cualquier otro proyecto técnico
        interesante — cuéntame en qué estás pensando.
      </p>
      <ContactForm />
    </Panel>
  );
}
