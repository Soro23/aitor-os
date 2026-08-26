import { notFound } from "next/navigation";
import Image from "next/image";
import { Panel } from "@/components/ui/Panel/Panel";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar/ProgressBar";
import { Tag } from "@/components/ui/Tag/Tag";
import { projectsRepository } from "@/server/repositories/projects.repository";
import { projectScreenshotsRepository } from "@/server/repositories/project-screenshots.repository";
import { toProjectPublicView } from "@/types/dto/project.dto";
import { projectStatusLabel, projectStatusTone } from "@/lib/project-status";
import { ProjectGallery } from "./ProjectGallery";
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
  const tone = projectStatusTone(view.status);

  return (
    <div className={styles.stack}>
      {view.coverImageUrl ? (
        <div className={styles.hero}>
          <Image
            src={view.coverImageUrl}
            alt=""
            fill
            sizes="100vw"
            preload
            style={{ objectFit: "cover" }}
          />
          <div className={styles.heroOverlay}>
            <p className="hud-label">Proyecto</p>
            <h1 className={styles.heroTitle}>{view.name}</h1>
          </div>
        </div>
      ) : null}

      <Panel accent={tone}>
        {!view.coverImageUrl ? (
          <>
            <p className="hud-label">Proyecto</p>
            <h1 className={styles.title}>{view.name}</h1>
          </>
        ) : null}
        <div className={styles.meta}>
          <StatusBadge label={projectStatusLabel(view.status)} tone={tone} />
          <ProgressBar value={view.progress} label="Progreso" tone={tone} />
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

      {view.screenshots.length > 0 ? (
        <Panel accent={tone}>
          <p className="hud-label">Galería</p>
          <ProjectGallery projectName={view.name} screenshots={view.screenshots} />
        </Panel>
      ) : null}

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
    </div>
  );
}
