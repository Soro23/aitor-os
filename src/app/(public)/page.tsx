import Link from "next/link";
import { Panel, type PanelAccent } from "@/components/ui/Panel/Panel";
import { ClipCard } from "@/components/ui/ClipCard/ClipCard";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar/ProgressBar";
import { PulseIndicator } from "@/components/ui/PulseIndicator/PulseIndicator";
import { Tag } from "@/components/ui/Tag/Tag";
import { buttonClassName } from "@/components/ui/Button/Button";
import { projectsRepository } from "@/server/repositories/projects.repository";
import { gardenNotesRepository } from "@/server/repositories/garden-notes.repository";
import { labExperimentsRepository } from "@/server/repositories/lab-experiments.repository";
import { nowItemsRepository } from "@/server/repositories/now-items.repository";
import { getGithubActivity } from "@/lib/github/get-activity";
import { projectStatusLabel, projectStatusTone } from "@/lib/project-status";
import { gardenNoteStatusLabel } from "@/lib/garden-note-labels";
import { formatLabNumber } from "@/lib/format-lab-number";
import { nowItemCategoryLabel } from "@/lib/now-item-labels";
import { SOCIAL_LINKS } from "@/lib/social-links";
import type { ProjectDTO } from "@/types/dto/project.dto";
import styles from "./page.module.css";

const LAB_STATUS_LABELS: Record<string, string> = {
  experiment: "Experiment",
  working: "Working",
  archived: "Archived",
};

const SPECIALTIES = ["Sistemas", "Desarrollo", "Automatización", "IA"];

const LANGUAGE_ACCENTS: PanelAccent[] = ["cyan", "violet", "green", "amber"];

interface ActivityEntry {
  text: string;
  value: string;
  tone: PanelAccent;
  date: string;
}

const EXPLORE_ICON_PATHS: Record<string, string> = {
  garden: "M20 4c-9 0-16 6-16 15 9 0 15-6 16-15zM8 18c3-4 6-7 11-11",
  lab: "M9 3h6M10 3v6l-5.5 9.5A1.5 1.5 0 0 0 5.8 21h12.4a1.5 1.5 0 0 0 1.3-2.5L14 9V3M7.5 15h9",
  recursos: "M12 2l9 5v10l-9 5-9-5V7z M3 7l9 5 9-5 M12 12v9",
  stack: "M12 3l9 5-9 5-9-5z M3 13l9 5 9-5",
};

const EXPLORE_ACCENTS: PanelAccent[] = ["cyan", "amber", "violet", "green"];

function ExploreIcon({ name }: { name: keyof typeof EXPLORE_ICON_PATHS }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="34"
      height="34"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={EXPLORE_ICON_PATHS[name]} />
    </svg>
  );
}

function SectionLabel({
  number,
  label,
  accent,
  dark = false,
}: {
  number: string;
  label: string;
  accent: PanelAccent;
  dark?: boolean;
}) {
  return (
    <p className={`hud-label ${dark ? styles.sectionLabelDark : styles.sectionLabel}`}>
      <span
        className={styles.sectionMarker}
        style={{ backgroundColor: `var(--color-accent-${accent})` }}
      />
      {number} — {label}
    </p>
  );
}

export default async function HomePage() {
  const [
    featuredProjects,
    publishedProjects,
    latestNote,
    gardenNotes,
    latestExperiment,
    labExperiments,
    nowItems,
    githubActivity,
  ] = await Promise.all([
    projectsRepository.findFeatured(),
    projectsRepository.findPublished(),
    gardenNotesRepository.findLatestPublished(),
    gardenNotesRepository.findPublished(),
    labExperimentsRepository.findLatestPublished(),
    labExperimentsRepository.findPublished(),
    nowItemsRepository.findActive(),
    getGithubActivity(),
  ]);

  const currentNowItem = nowItems[0] ?? null;
  const highlightProject: ProjectDTO | null = featuredProjects[0] ?? publishedProjects[0] ?? null;
  const otherProjects = publishedProjects.filter((project) => project.id !== highlightProject?.id);
  const inDevelopmentCount = publishedProjects.filter((project) => project.status === "en_desarrollo").length;

  const buildItems = [
    otherProjects[0]
      ? {
          key: `project-${otherProjects[0].id}`,
          accent: projectStatusTone(otherProjects[0].status),
          status: projectStatusLabel(otherProjects[0].status),
          title: otherProjects[0].name,
          description: otherProjects[0].description ?? "Proyecto publicado.",
          progress: otherProjects[0].progress,
          href: `/proyectos/${otherProjects[0].slug}`,
          cta: "Ver proyecto",
        }
      : null,
    latestNote
      ? {
          key: `note-${latestNote.id}`,
          accent: "violet" as const,
          status: gardenNoteStatusLabel(latestNote.status),
          title: latestNote.title,
          description: "Nota del Garden.",
          progress: null,
          href: `/garden/${latestNote.slug}`,
          cta: "Ver nota",
        }
      : null,
    latestExperiment
      ? {
          key: `experiment-${latestExperiment.id}`,
          accent: "green" as const,
          status: `${LAB_STATUS_LABELS[latestExperiment.status]} · ${formatLabNumber(latestExperiment.labNumber)}`,
          title: latestExperiment.title,
          description: latestExperiment.description ?? "Experimento del Lab.",
          progress: null,
          href: "/lab",
          cta: "Ver experimento",
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  const activity: ActivityEntry[] = [
    ...otherProjects.map((project) => ({
      text: `Progreso actualizado — ${project.name}`,
      value: `${project.progress}%`,
      tone: projectStatusTone(project.status),
      date: project.updatedAt,
    })),
    ...gardenNotes.map((note) => ({
      text: `Nota publicada — ${note.title}`,
      value: gardenNoteStatusLabel(note.status),
      tone: "violet" as const,
      date: note.createdAt,
    })),
    ...labExperiments.map((experiment) => ({
      text: `Experimento publicado — ${experiment.title}`,
      value: LAB_STATUS_LABELS[experiment.status],
      tone: "green" as const,
      date: experiment.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  const languageCounts = (githubActivity?.recentRepos ?? []).reduce<Record<string, number>>((acc, repo) => {
    if (repo.language) acc[repo.language] = (acc[repo.language] ?? 0) + 1;
    return acc;
  }, {});
  const languageEntries = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]);
  const languageTotal = languageEntries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className={styles.pageWithRail}>
      <aside className={styles.rail} aria-hidden="true">
        {["Identity", "Highlight", "Build", "Activity", "Explore", "Contact"].map((label) => (
          <span key={label} className={`hud-label ${styles.railLabel}`}>
            {label}
          </span>
        ))}
      </aside>

      <div className={styles.content}>
        <div className={styles.mainInner}>
        <section>
          <SectionLabel number="00" label="Identity" accent="cyan" />
          <Panel accent="cyan" className={styles.heroGrid}>
            <div>
              <div className={styles.wordmark}>
                <span>AITOR</span>
                <span className={styles.wordmarkAccent}>OS</span>
              </div>
              <p className={styles.tagline}>
                Técnico informático y desarrollador centrado en sistemas, automatización,
                desarrollo e inteligencia artificial.
              </p>
              <div className={styles.tagsRow}>
                {SPECIALTIES.map((specialty) => (
                  <Tag key={specialty} label={specialty} />
                ))}
              </div>
              <div className={styles.heroLinks}>
                <Link href="/sobre-mi" className={`hud-label ${styles.heroLink}`}>
                  Sobre mí →
                </Link>
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noreferrer"
                  className={`hud-label ${styles.heroLink}`}
                >
                  GitHub →
                </a>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className={`hud-label ${styles.heroLink}`}
                >
                  LinkedIn →
                </a>
                <Link href="/contacto" className={`hud-label ${styles.heroLinkMuted}`}>
                  Contacto →
                </Link>
              </div>
            </div>

            <div className={styles.statusPanel}>
              <p className="hud-label">&gt; Status</p>
              <div className={styles.statusList}>
                <div className={styles.statusRow}>
                  <span className="hud-label">Nombre</span>
                  <span className="hud-label">Aitor Solana Roca</span>
                </div>
                <div className={styles.statusRow}>
                  <span className="hud-label">Enfoque</span>
                  <span className="hud-label">Sistemas + Desarrollo + IA</span>
                </div>
                <div className={styles.statusRow}>
                  <span className="hud-label">Stack</span>
                  <span className="hud-label">Next.js · Supabase · Coolify</span>
                </div>
                <div className={styles.statusRow}>
                  <span className="hud-label">Foco actual</span>
                  <span className="hud-label">
                    {currentNowItem
                      ? `${nowItemCategoryLabel(currentNowItem.category)}: ${currentNowItem.title}`
                      : "Sin foco activo"}
                  </span>
                </div>
              </div>
              <p className={`hud-label ${styles.statusDivider}`}>Sensores del sistema</p>
              <div className={styles.statusList}>
                <div className={styles.statusRow}>
                  <span className="hud-label">Proyectos</span>
                  <span className="hud-label">{publishedProjects.length}</span>
                </div>
                <div className={styles.statusRow}>
                  <span className="hud-label">En desarrollo</span>
                  <span className="hud-label">{inDevelopmentCount}</span>
                </div>
                <div className={styles.statusRow}>
                  <span className="hud-label">Notas Garden</span>
                  <span className="hud-label">{gardenNotes.length}</span>
                </div>
                <div className={styles.statusRow}>
                  <span className={`hud-label ${styles.statusOnline}`}>Estado</span>
                  <span className={`hud-label ${styles.statusOnline}`}>Online</span>
                </div>
              </div>
            </div>
          </Panel>
        </section>

        <section>
          <SectionLabel number="01" label="Highlight" accent="amber" />
          {highlightProject ? (
            <>
              <div className={styles.highlightGrid}>
                <div className={styles.highlightLeft}>
                  <p className="hud-label">Proyecto destacado</p>
                  <h2 className={styles.highlightTitle}>{highlightProject.name}</h2>
                  <p className={styles.bodyText}>
                    {highlightProject.description ?? "Proyecto publicado en Aitor OS."}
                  </p>
                  <Link
                    href={`/proyectos/${highlightProject.slug}`}
                    className={buttonClassName("secondary", styles.highlightCta)}
                  >
                    Ver proyecto →
                  </Link>
                </div>
                <div className={styles.highlightRight}>
                  <span className={styles.highlightPct}>{highlightProject.progress}%</span>
                  <span className="hud-label">Progreso global</span>
                  <div className={styles.highlightTrack}>
                    <div
                      className={styles.highlightFill}
                      style={{ width: `${highlightProject.progress}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.statsRow}>
                <div className={styles.statTile}>
                  <span className={styles.statNumber}>{publishedProjects.length}</span>
                  <span className="hud-label">Proyectos publicados</span>
                </div>
                <div className={styles.statTile}>
                  <span className={styles.statNumber}>{gardenNotes.length}</span>
                  <span className="hud-label">Notas en el Garden</span>
                </div>
                <div className={styles.statTile}>
                  <span className={styles.statNumber}>{labExperiments.length}</span>
                  <span className="hud-label">Experimentos en Lab</span>
                </div>
              </div>
            </>
          ) : (
            <ClipCard eyebrow="Proyecto destacado" title="Todavía no hay proyectos publicados" accent="cyan" />
          )}
        </section>

        <section>
          <SectionLabel number="02" label="Builds" accent="cyan" />
          {buildItems.length > 0 ? (
            <div className={styles.buildsGrid}>
              {buildItems.map((item) => (
                <ClipCard
                  key={item.key}
                  eyebrow={item.status}
                  title={item.title}
                  accent={item.accent}
                  footer={
                    <Link href={item.href} className={styles.buildCta}>
                      {item.cta} →
                    </Link>
                  }
                >
                  <p className={styles.bodyText}>{item.description}</p>
                  {item.progress !== null ? (
                    <ProgressBar value={item.progress} label="Progreso" tone={item.accent} />
                  ) : (
                    <StatusBadge label={item.status} tone={item.accent} />
                  )}
                </ClipCard>
              ))}
            </div>
          ) : (
            <ClipCard eyebrow="Builds" title="Todavía no hay más contenido publicado" accent="cyan" />
          )}
          <Link href="/proyectos" className={`hud-label ${styles.viewAll}`}>
            Ver todos los proyectos →
          </Link>
        </section>

        <section className={styles.midGrid}>
          <div>
            <SectionLabel number="03" label="Actividad reciente" accent="green" />
            {activity.length > 0 ? (
              <div className={styles.feedList}>
                {activity.map((entry) => (
                  <div key={`${entry.text}-${entry.date}`} className={styles.feedRow}>
                    <PulseIndicator label={entry.text} tone={entry.tone} active={false} />
                    <span className={`hud-label ${styles.feedValue}`}>{entry.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.bodyText}>Todavía no hay actividad publicada.</p>
            )}
            <Link href="/dashboard" className={`hud-label ${styles.viewAll}`}>
              Ver dashboard →
            </Link>
          </div>

          <div>
            <SectionLabel number="04" label="Código público" accent="violet" />
            {githubActivity && languageTotal > 0 ? (
              <>
                <div className={styles.langBar}>
                  {languageEntries.map(([language, count], index) => (
                    <span
                      key={language}
                      className={styles.langSegment}
                      style={{
                        width: `${(count / languageTotal) * 100}%`,
                        backgroundColor: `var(--color-accent-${LANGUAGE_ACCENTS[index % LANGUAGE_ACCENTS.length]})`,
                      }}
                    />
                  ))}
                </div>
                <div className={styles.repoList}>
                  {githubActivity.recentRepos.map((repo) => (
                    <a
                      key={repo.url}
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.repoRow}
                    >
                      <span className={styles.repoName}>{repo.name}</span>
                      {repo.language ? (
                        <span className={`hud-label ${styles.repoLang}`}>{repo.language}</span>
                      ) : null}
                    </a>
                  ))}
                </div>
                <p className={`hud-label ${styles.githubNote}`}>
                  @{githubActivity.username} · {githubActivity.publicRepos} repositorios públicos en total
                </p>
              </>
            ) : (
              <p className={styles.bodyText}>
                Actividad de GitHub no disponible ahora mismo — se conecta a la API pública.
              </p>
            )}
          </div>
        </section>
        </div>

        <div className={styles.exploreBand}>
          <div className={styles.exploreInner}>
            <SectionLabel number="05" label="Explora el sistema" accent="cyan" dark />
            <div className={styles.exploreGrid}>
              {[
                {
                  href: "/garden",
                  icon: "garden" as const,
                  title: "Garden",
                  desc: "Notas, ideas y aprendizajes organizados por área.",
                },
                {
                  href: "/lab",
                  icon: "lab" as const,
                  title: "Lab",
                  desc: "Experimentos y pruebas con nuevas tecnologías.",
                },
                {
                  href: "/recursos",
                  icon: "recursos" as const,
                  title: "Recursos",
                  desc: "Herramientas, guías y material de referencia.",
                },
                {
                  href: "/stack",
                  icon: "stack" as const,
                  title: "Stack",
                  desc: "Tecnologías y herramientas con las que trabajo.",
                },
              ].map((item, index) => {
                const accent = EXPLORE_ACCENTS[index % EXPLORE_ACCENTS.length];
                const color = `var(--color-accent-${accent})`;
                return (
                  <Link key={item.href} href={item.href} className={styles.exploreItem}>
                    <span className={styles.exploreNum} style={{ color }}>
                      0{index + 1}
                    </span>
                    <span className={styles.exploreIcon} style={{ color }}>
                      <ExploreIcon name={item.icon} />
                    </span>
                    <p className={styles.exploreTitle}>{item.title}</p>
                    <p className={styles.exploreDesc}>{item.desc}</p>
                    <span className={`hud-label ${styles.exploreLink}`} style={{ color }}>
                      Explorar →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.contactBand}>
          <SectionLabel number="06" label="Contacto" accent="amber" />
          <h2 className={styles.contactHeadline}>Hablemos de tu próximo proyecto técnico.</h2>
          <p className={styles.bodyText}>
            Desarrollo, IA, automatización o infraestructura — cuéntame en qué estás pensando y te
            respondo por el formulario de contacto.
          </p>
          <Link href="/contacto" className={buttonClassName("primary", styles.contactCta)}>
            Ir a contacto →
          </Link>
        </div>
      </div>
    </div>
  );
}
