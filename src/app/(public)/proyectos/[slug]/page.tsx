import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/Panel/Panel";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar/ProgressBar";
import { projectsRepository } from "@/server/repositories/projects.repository";
import { projectScreenshotsRepository } from "@/server/repositories/project-screenshots.repository";
import { toProjectPublicView } from "@/types/dto/project.dto";
import { projectStatusLabel, projectStatusTone } from "@/lib/project-status";
import styles from "./page.module.css";

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

  return (
    <div className={styles.stack}>
      <Panel accent={projectStatusTone(view.status)}>
        <p className="hud-label">Proyecto</p>
        <h1 className={styles.title}>{view.name}</h1>
        <div className={styles.meta}>
          <StatusBadge label={projectStatusLabel(view.status)} tone={projectStatusTone(view.status)} />
          <ProgressBar value={view.progress} label="Progreso" tone={projectStatusTone(view.status)} />
        </div>
        {view.description ? <p className={styles.description}>{view.description}</p> : null}
        <div className={styles.links}>
          {view.githubUrl ? (
            <a href={view.githubUrl} target="_blank" rel="noreferrer" className={styles.link}>
              GitHub
            </a>
          ) : null}
          {view.demoUrl ? (
            <a href={view.demoUrl} target="_blank" rel="noreferrer" className={styles.link}>
              Demo
            </a>
          ) : null}
        </div>
      </Panel>

      {view.problem ? (
        <Panel>
          <p className="hud-label">Problema</p>
          <p className={styles.text}>{view.problem}</p>
        </Panel>
      ) : null}

      {view.solution ? (
        <Panel>
          <p className="hud-label">Solución</p>
          <p className={styles.text}>{view.solution}</p>
        </Panel>
      ) : null}

      {view.architecture ? (
        <Panel>
          <p className="hud-label">Arquitectura</p>
          <p className={styles.text}>{view.architecture}</p>
        </Panel>
      ) : null}

      {view.technologies.length > 0 ? (
        <Panel>
          <p className="hud-label">Tecnologías</p>
          <p className={styles.text}>{view.technologies.join(" · ")}</p>
        </Panel>
      ) : null}

      {view.learnings ? (
        <Panel accent="green">
          <p className="hud-label">Aprendizajes</p>
          <p className={styles.text}>{view.learnings}</p>
        </Panel>
      ) : null}

      {view.nextSteps ? (
        <Panel accent="amber">
          <p className="hud-label">Próximos pasos</p>
          <p className={styles.text}>{view.nextSteps}</p>
        </Panel>
      ) : null}

      {view.screenshots.length > 0 ? (
        <div className={styles.screenshots}>
          {view.screenshots.map((shot) => (
            // eslint-disable-next-line @next/next/no-img-element -- URLs externas de Storage, sin loader de next/image configurado todavia
            <img
              key={shot.id}
              src={shot.imageUrl}
              alt={shot.altText ?? view.name}
              className={styles.screenshot}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
