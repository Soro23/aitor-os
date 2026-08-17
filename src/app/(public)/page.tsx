import Link from "next/link";
import { Panel } from "@/components/ui/Panel/Panel";
import { ClipCard } from "@/components/ui/ClipCard/ClipCard";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar/ProgressBar";
import { PulseIndicator } from "@/components/ui/PulseIndicator/PulseIndicator";
import { projectsRepository } from "@/server/repositories/projects.repository";
import { projectStatusLabel, projectStatusTone } from "@/lib/project-status";
import styles from "./page.module.css";

export default async function HomePage() {
  const featuredProjects = await projectsRepository.findFeatured();

  return (
    <div className={styles.stack}>
      <Panel accent="cyan">
        <p className="hud-label">Aitor OS · Boot sequence</p>
        <h1 className={styles.title}>Aitor</h1>
        <p className={styles.tagline}>
          Técnico informático y desarrollador centrado en sistemas, automatización,
          desarrollo e inteligencia artificial.
        </p>
        <PulseIndicator label="Sistema en construcción — Fase 5: CRUD de proyectos" tone="amber" />
      </Panel>

      <div className={styles.grid}>
        {featuredProjects.length > 0 ? (
          featuredProjects.map((project) => (
            <Link key={project.id} href={`/proyectos/${project.slug}`} className={styles.cardLink}>
              <ClipCard
                eyebrow="Proyecto destacado"
                title={project.name}
                accent={projectStatusTone(project.status)}
              >
                <StatusBadge
                  label={projectStatusLabel(project.status)}
                  tone={projectStatusTone(project.status)}
                />
                <ProgressBar
                  value={project.progress}
                  label="Progreso"
                  tone={projectStatusTone(project.status)}
                />
              </ClipCard>
            </Link>
          ))
        ) : (
          <ClipCard eyebrow="Proyecto destacado" title="Todavía no hay proyectos destacados" accent="cyan" />
        )}
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
