import Link from "next/link";
import { Panel } from "@/components/ui/Panel/Panel";
import { ClipCard } from "@/components/ui/ClipCard/ClipCard";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar/ProgressBar";
import { PulseIndicator } from "@/components/ui/PulseIndicator/PulseIndicator";
import { Tag } from "@/components/ui/Tag/Tag";
import { Button, buttonClassName } from "@/components/ui/Button/Button";
import { projectsRepository } from "@/server/repositories/projects.repository";
import { gardenNotesRepository } from "@/server/repositories/garden-notes.repository";
import { labExperimentsRepository } from "@/server/repositories/lab-experiments.repository";
import { resourcesRepository } from "@/server/repositories/resources.repository";
import { stackItemsRepository } from "@/server/repositories/stack-items.repository";
import { nowItemsRepository } from "@/server/repositories/now-items.repository";
import { projectStatusLabel, projectStatusTone } from "@/lib/project-status";
import { gardenNoteCategoryLabel, gardenNoteStatusLabel } from "@/lib/garden-note-labels";
import { formatLabNumber } from "@/lib/format-lab-number";
import { nowItemCategoryLabel } from "@/lib/now-item-labels";
import { stackUsageLevelSignal } from "@/lib/stack-item-labels";
import { SOCIAL_LINKS } from "@/lib/social-links";
import styles from "./page.module.css";

const LAB_STATUS_LABELS: Record<string, string> = {
  experiment: "Experiment",
  working: "Working",
  archived: "Archived",
};

const SPECIALTIES = ["Sistemas", "Desarrollo", "Automatización", "IA"];

export default async function HomePage() {
  const [
    featuredProjects,
    latestNote,
    latestExperiment,
    nowItems,
    publishedProjects,
    gardenNotes,
    labExperiments,
    resources,
    stackItems,
  ] = await Promise.all([
    projectsRepository.findFeatured(),
    gardenNotesRepository.findLatestPublished(),
    labExperimentsRepository.findLatestPublished(),
    nowItemsRepository.findActive(),
    projectsRepository.findPublished(),
    gardenNotesRepository.findPublished(),
    labExperimentsRepository.findPublished(),
    resourcesRepository.findPublished(),
    stackItemsRepository.findVisible(),
  ]);

  const gardenCategories = Array.from(new Set(gardenNotes.map((note) => note.category))).map(
    gardenNoteCategoryLabel,
  );
  const topStackItems = [...stackItems]
    .sort((a, b) => stackUsageLevelSignal(b.usageLevel) - stackUsageLevelSignal(a.usageLevel))
    .slice(0, 3)
    .map((item) => item.name);
  const currentNowItem = nowItems[0] ?? null;
  const exampleResource = resources[0] ?? null;

  return (
    <div className={styles.stack}>
      <Panel accent="cyan">
        <p className="hud-label">Aitor OS · Boot sequence</p>
        <h1 className={styles.title}>Aitor</h1>
        <p className={styles.tagline}>
          Técnico informático y desarrollador centrado en sistemas, automatización,
          desarrollo e inteligencia artificial.
        </p>
        <div className={styles.heroTags}>
          {SPECIALTIES.map((specialty) => (
            <Tag key={specialty} label={specialty} />
          ))}
        </div>
        <div className={styles.heroActions}>
          <Button as="a" href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" variant="secondary">
            GitHub
          </Button>
          <Button as="a" href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" variant="secondary">
            LinkedIn
          </Button>
          <Link href="/contacto" className={buttonClassName("ghost")}>
            Contacto
          </Link>
        </div>
        {nowItems.length > 0 ? (
          <div className={styles.nowList}>
            {nowItems.map((item) => (
              <PulseIndicator
                key={item.id}
                label={`${nowItemCategoryLabel(item.category)}: ${item.title}`}
                tone="amber"
              />
            ))}
          </div>
        ) : (
          <PulseIndicator label="Sistema en construcción" tone="amber" />
        )}
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

      <p className={`hud-label ${styles.sectionTitle}`}>Explora Aitor OS</p>
      <div className={styles.exploreGrid}>
        <Link href="/sobre-mi" className={styles.cardLink}>
          <ClipCard eyebrow="Sobre mí" title="Quién soy" accent="cyan">
            <p className={styles.exploreText}>
              Cómo empecé, en qué estoy trabajando ahora y qué tipo de problemas me gusta resolver.
            </p>
          </ClipCard>
        </Link>

        <Link href="/proyectos" className={styles.cardLink}>
          <ClipCard eyebrow="Proyectos" title="Lo que he construido" accent="cyan">
            <p className={styles.exploreText}>
              {publishedProjects.length} proyecto{publishedProjects.length === 1 ? "" : "s"} publicado
              {publishedProjects.length === 1 ? "" : "s"}, de idea a producción.
            </p>
          </ClipCard>
        </Link>

        <Link href="/garden" className={styles.cardLink}>
          <ClipCard eyebrow="Digital Garden" title="Lo que sé" accent="violet">
            <p className={styles.exploreText}>
              {gardenNotes.length} nota{gardenNotes.length === 1 ? "" : "s"}
              {gardenCategories.length > 0 ? ` — ${gardenCategories.join(" · ")}` : ""}
            </p>
          </ClipCard>
        </Link>

        <Link href="/dashboard" className={styles.cardLink}>
          <ClipCard eyebrow="Dashboard" title="Lo que estoy haciendo" accent="cyan">
            <p className={styles.exploreText}>
              {publishedProjects.length} proyecto{publishedProjects.length === 1 ? "" : "s"} activo
              {publishedProjects.length === 1 ? "" : "s"} + actividad de GitHub.
            </p>
          </ClipCard>
        </Link>

        <Link href="/now" className={styles.cardLink}>
          <ClipCard eyebrow="Now" title="Ahora mismo" accent="green">
            <p className={styles.exploreText}>
              {currentNowItem
                ? `${nowItemCategoryLabel(currentNowItem.category)}: ${currentNowItem.title}`
                : "Qué estoy trabajando, aprendiendo y explorando esta temporada."}
            </p>
          </ClipCard>
        </Link>

        <Link href="/lab" className={styles.cardLink}>
          <ClipCard eyebrow="Lab" title="Experimentos" accent="green">
            <p className={styles.exploreText}>
              {labExperiments.length} experimento{labExperiments.length === 1 ? "" : "s"} publicado
              {labExperiments.length === 1 ? "" : "s"} — pruebas que no necesitan ser un proyecto completo.
            </p>
          </ClipCard>
        </Link>

        <Link href="/recursos" className={styles.cardLink}>
          <ClipCard eyebrow="Recursos" title="Mi biblioteca técnica" accent="violet">
            <p className={styles.exploreText}>
              {exampleResource
                ? `${resources.length} recursos — por ejemplo, ${exampleResource.name}.`
                : "Herramientas, librerías y referencias que uso."}
            </p>
          </ClipCard>
        </Link>

        <Link href="/stack" className={styles.cardLink}>
          <ClipCard eyebrow="Stack" title="Tecnologías" accent="cyan">
            <p className={styles.exploreText}>
              {topStackItems.length > 0
                ? topStackItems.join(" · ")
                : "Herramientas y tecnologías con las que trabajo."}
            </p>
          </ClipCard>
        </Link>

        <Link href="/contacto" className={styles.cardLink}>
          <ClipCard eyebrow="Contacto" title="Hablemos" accent="amber">
            <p className={styles.exploreText}>
              Desarrollo, IA, automatización o infraestructura — cuéntame en qué estás pensando.
            </p>
          </ClipCard>
        </Link>
      </div>
    </div>
  );
}
