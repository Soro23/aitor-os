import { Panel } from "@/components/ui/Panel/Panel";
import { ClipCard } from "@/components/ui/ClipCard/ClipCard";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar/ProgressBar";
import { PulseIndicator } from "@/components/ui/PulseIndicator/PulseIndicator";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.stack}>
      <Panel accent="cyan">
        <p className="hud-label">Aitor OS · Boot sequence</p>
        <h1 className={styles.title}>Aitor</h1>
        <p className={styles.tagline}>
          Técnico informático y desarrollador centrado en sistemas, automatización,
          desarrollo e inteligencia artificial.
        </p>
        <PulseIndicator label="Sistema en construcción — Fase 1: bootstrap" tone="amber" />
      </Panel>

      <div className={styles.grid}>
        <ClipCard eyebrow="Proyecto destacado" title="Contenido pendiente de conectar" accent="cyan">
          <StatusBadge label="En desarrollo" tone="amber" />
          <ProgressBar value={35} label="Progreso" tone="amber" />
        </ClipCard>
        <ClipCard eyebrow="Última nota — Garden" title="Contenido pendiente de conectar" accent="violet">
          <StatusBadge label="Growing" tone="violet" />
        </ClipCard>
        <ClipCard eyebrow="Último experimento — Lab" title="Contenido pendiente de conectar" accent="green">
          <StatusBadge label="Experiment" tone="green" />
        </ClipCard>
      </div>
    </div>
  );
}
