import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Panel, type PanelAccent } from "@/components/ui/Panel/Panel";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar/ProgressBar";
import { Tag } from "@/components/ui/Tag/Tag";
import { projectsRepository } from "@/server/repositories/projects.repository";
import { projectScreenshotsRepository } from "@/server/repositories/project-screenshots.repository";
import { toProjectPublicView } from "@/types/dto/project.dto";
import { projectStatusLabel, projectStatusTone } from "@/lib/project-status";
import { ProjectGallery } from "./ProjectGallery";
import styles from "./page.module.css";

function SectionLabel({ number, label, accent }: { number: string; label: string; accent: PanelAccent }) {
  return (
    <p className={`hud-label ${styles.sectionLabel}`}>
      <span className={styles.sectionMarker} style={{ backgroundColor: `var(--color-accent-${accent})` }} />
      {number} — {label}
    </p>
  );
}

function ProblemIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="7" x2="12" y2="13" />
      <line x1="12" y1="16.5" x2="12.01" y2="16.5" />
    </svg>
  );
}

function SolutionIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6v.5h5.4v-.5c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3z" />
    </svg>
  );
}

function ArchitectureIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 13l9 5 9-5" />
    </svg>
  );
}

function LearningsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M4 4.5h6.5A2.5 2.5 0 0 1 13 7v13a2.5 2.5 0 0 0-2.5-2.5H4z" />
      <path d="M20 4.5h-6.5A2.5 2.5 0 0 0 11 7v13a2.5 2.5 0 0 1 2.5-2.5H20z" />
    </svg>
  );
}

function NextStepsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M5 3v18" />
      <path d="M5 4h11l-2 4 2 4H5" />
    </svg>
  );
}

function DetailPanel({
  number,
  icon,
  accentColor,
  panelAccent,
  label,
  text,
}: {
  number: string;
  icon: ReactNode;
  accentColor: string;
  panelAccent?: PanelAccent;
  label: string;
  text: string;
}) {
  return (
    <Panel accent={panelAccent}>
      <div className={styles.panelHead}>
        <span className={styles.panelIcon} style={{ color: accentColor }}>
          {icon}
        </span>
        <span className={styles.panelNum} style={{ color: accentColor }}>
          {number}
        </span>
        <p className={`hud-label ${styles.panelLabel}`}>{label}</p>
      </div>
      <p className={styles.text}>{text}</p>
    </Panel>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await projectsRepository.findBySlug(slug);

  if (!project || !project.isPublished) {
    notFound();
  }

  const screenshots = await projectScreenshotsRepository.findByProjectId(project.id);
  const view = toProjectPublicView(project, screenshots);
  const tone = projectStatusTone(view.status);

  const hasGallery = view.screenshots.length > 0;
  const hasProblemOrSolution = Boolean(view.problem || view.solution);
  const hasDetails = hasProblemOrSolution || Boolean(view.architecture);
  const hasLearnings = Boolean(view.learnings || view.nextSteps);

  let sectionIndex = 0;
  const overviewNum = String(sectionIndex++).padStart(2, "0");
  const galleryNum = hasGallery ? String(sectionIndex++).padStart(2, "0") : null;
  const detailsNum = hasDetails ? String(sectionIndex++).padStart(2, "0") : null;
  const learningsNum = hasLearnings ? String(sectionIndex++).padStart(2, "0") : null;

  const railLabels = [
    "Overview",
    hasGallery ? "Gallery" : null,
    hasDetails ? "Details" : null,
    hasLearnings ? "Learnings" : null,
  ].filter((label): label is string => label !== null);

  return (
    <div className={styles.pageWithRail}>
      <aside className={styles.rail} aria-hidden="true">
        {railLabels.map((label) => (
          <span key={label} className={`hud-label ${styles.railLabel}`}>
            {label}
          </span>
        ))}
      </aside>

      <div className={styles.content}>
        <div className={styles.mainInner}>
          <section>
            <div className={styles.sectionHeadRow}>
              <SectionLabel number={overviewNum} label="Overview" accent={tone} />
              <Link href="/proyectos" className={`hud-label ${styles.backLink}`}>
                <span className={styles.backArrow}>←</span>Volver a proyectos
              </Link>
            </div>

            <Panel accent={tone} className={view.coverImageUrl ? styles.heroGrid : undefined}>
              <div>
                <p className={`hud-label ${styles.eyebrow}`}>Proyecto</p>
                <h1 className={styles.title}>{view.name}</h1>
                <div className={styles.metaRow}>
                  <StatusBadge label={projectStatusLabel(view.status)} tone={tone} />
                  <div className={styles.progressWrap}>
                    <ProgressBar value={view.progress} label="Progreso" tone={tone} />
                  </div>
                </div>
                {view.description ? <p className={styles.description}>{view.description}</p> : null}
                {view.technologies.length > 0 ? (
                  <div className={styles.tags}>
                    {view.technologies.map((tech) => (
                      <Tag key={tech} label={tech} />
                    ))}
                  </div>
                ) : null}
                <div className={styles.links}>
                  {view.githubUrl ? (
                    <a href={view.githubUrl} target="_blank" rel="noreferrer" className={`hud-label ${styles.link}`}>
                      GitHub →
                    </a>
                  ) : null}
                  {view.demoUrl ? (
                    <a href={view.demoUrl} target="_blank" rel="noreferrer" className={`hud-label ${styles.link}`}>
                      Demo →
                    </a>
                  ) : null}
                </div>
              </div>

              {view.coverImageUrl ? (
                <div className={styles.coverWrap}>
                  <Image
                    src={view.coverImageUrl}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 480px, 92vw"
                    preload
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : null}
            </Panel>
          </section>

          {hasGallery ? (
            <section>
              <SectionLabel number={galleryNum ?? "01"} label="Gallery" accent={tone} />
              <Panel accent={tone}>
                <ProjectGallery projectName={view.name} screenshots={view.screenshots} />
              </Panel>
            </section>
          ) : null}

          {hasDetails ? (
            <section>
              <SectionLabel number={detailsNum ?? "01"} label="Details" accent="violet" />
              <div className={styles.detailsStack}>
                {hasProblemOrSolution ? (
                  <div className={view.problem && view.solution ? styles.detailsGrid : undefined}>
                    {view.problem ? (
                      <DetailPanel
                        number="01"
                        icon={<ProblemIcon />}
                        accentColor="var(--color-accent-violet)"
                        label="Problema"
                        text={view.problem}
                      />
                    ) : null}
                    {view.solution ? (
                      <DetailPanel
                        number="02"
                        icon={<SolutionIcon />}
                        accentColor="var(--color-accent-violet)"
                        label="Solución"
                        text={view.solution}
                      />
                    ) : null}
                  </div>
                ) : null}
                {view.architecture ? (
                  <DetailPanel
                    number="03"
                    icon={<ArchitectureIcon />}
                    accentColor="var(--color-accent-violet)"
                    label="Arquitectura"
                    text={view.architecture}
                  />
                ) : null}
              </div>
            </section>
          ) : null}

          {hasLearnings ? (
            <section>
              <SectionLabel number={learningsNum ?? "01"} label="Learnings" accent="green" />
              <div className={view.learnings && view.nextSteps ? styles.detailsGrid : undefined}>
                {view.learnings ? (
                  <DetailPanel
                    number="04"
                    icon={<LearningsIcon />}
                    accentColor="var(--color-accent-green)"
                    panelAccent="green"
                    label="Aprendizajes"
                    text={view.learnings}
                  />
                ) : null}
                {view.nextSteps ? (
                  <DetailPanel
                    number="05"
                    icon={<NextStepsIcon />}
                    accentColor="var(--color-accent-amber)"
                    panelAccent="amber"
                    label="Próximos pasos"
                    text={view.nextSteps}
                  />
                ) : null}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
