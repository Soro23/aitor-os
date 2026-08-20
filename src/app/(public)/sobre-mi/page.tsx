import { Panel } from "@/components/ui/Panel/Panel";
import styles from "./page.module.css";

const TIMELINE = [
  { year: "2024", description: "Empiezo a profundizar en sistemas." },
  { year: "2025", description: "Active Directory / Windows Server." },
  { year: "2026", description: "Desarrollo + IA + automatización." },
];

export default function SobreMiPage() {
  return (
    <div className={styles.stack}>
      <Panel accent="cyan">
        <p className="hud-label">Sobre mí</p>
        <h1 className={styles.title}>Aitor</h1>
        <p className={styles.paragraph}>
          Técnico informático y desarrollador centrado en sistemas, automatización, desarrollo e
          inteligencia artificial. Empecé por el lado de sistemas — Active Directory, Windows Server,
          redes — y desde ahí he ido moviéndome hacia el desarrollo y la IA, sin dejar atrás esa base.
        </p>
        <p className={styles.paragraph}>
          Ahora mismo combino ambos mundos: construyo aplicaciones y automatizaciones, y sigo
          aprendiendo infraestructura y arquitectura backend. Me interesan sobre todo los problemas
          técnicos con capas — sistemas que hay que entender de arriba a abajo antes de poder mejorarlos.
        </p>
        <p className={styles.paragraph}>
          Trabajo documentando lo que aprendo por el camino (de ahí el Digital Garden) y prefiero
          publicar ideas en construcción antes que esperar a tenerlas perfectas. El objetivo a medio
          plazo es seguir profundizando en desarrollo, IA y automatización, y convertir esta web en un
          reflejo real de esa evolución.
        </p>
      </Panel>

      <Panel accent="violet">
        <p className="hud-label">Evolución</p>
        <ul className={styles.timeline}>
          {TIMELINE.map((entry) => (
            <li key={entry.year} className={styles.timelineItem}>
              <span className={`hud-label ${styles.timelineYear}`}>{entry.year}</span>
              <span className={styles.timelineDescription}>{entry.description}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
