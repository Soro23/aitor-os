import Link from "next/link";
import { Panel } from "@/components/ui/Panel/Panel";
import { ClipCard } from "@/components/ui/ClipCard/ClipCard";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar/ProgressBar";
import { PulseIndicator } from "@/components/ui/PulseIndicator/PulseIndicator";
import { projectsRepository } from "@/server/repositories/projects.repository";
import { gardenNotesRepository } from "@/server/repositories/garden-notes.repository";
import { labExperimentsRepository } from "@/server/repositories/lab-experiments.repository";
import { projectStatusLabel, projectStatusTone } from "@/lib/project-status";
import { gardenNoteCategoryLabel, gardenNoteStatusLabel } from "@/lib/garden-note-labels";
import { formatLabNumber } from "@/lib/format-lab-number";
import styles from "./page.module.css";

const LAB_STATUS_LABELS: Record<string, string> = {
  experiment: "Experiment",
  working: "Working",
  archived: "Archived",
};

export default async function HomePage() {
  const [featuredProjects, latestNote, latestExperiment] = await Promise.all([
    projectsRepository.findFeatured(),
    gardenNotesRepository.findLatestPublished(),
    labExperimentsRepository.findLatestPublished(),
  ]);

  return (
    <div className={styles.stack}>
      <Panel accent="cyan">
        <p className="hud-label">Aitor OS · Boot sequence</p>
        <h1 className={styles.title}>Aitor</h1>
        <p className={styles.tagline}>
          Técnico informático y desarrollador centrado en sistemas, automatización,
          desarrollo e inteligencia artificial.
        </p>
        <PulseIndicator label="Sistema en construcción — Fase 6: Digital Garden" tone="amber" />
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

        {latestNote ? (
          <Link href={`/garden/${latestNote.slug}`} className={styles.cardLink}>
            <ClipCard
              eyebrow={`Última nota — ${gardenNoteCategoryLabel(latestNote.category)}`}
              title={latestNote.title}
              accent="violet"
            >
              <StatusBadge label={gardenNoteStatusLabel(latestNote.status)} tone="violet" />
            </ClipCard>
          </Link>
        ) : (
          <ClipCard eyebrow="Última nota — Garden" title="Todavía no hay notas publicadas" accent="violet" />
        )}

        {latestExperiment ? (
          <ClipCard
            eyebrow={`Último experimento — ${formatLabNumber(latestExperiment.labNumber)}`}
            title={latestExperiment.title}
            accent="green"
          >
            <StatusBadge label={LAB_STATUS_LABELS[latestExperiment.status]} tone="green" />
          </ClipCard>
        ) : (
          <ClipCard eyebrow="Último experimento — Lab" title="Todavía no hay experimentos publicados" accent="green" />
        )}
      </div>
    </div>
  );
}
