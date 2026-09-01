import Link from "next/link";
import Image from "next/image";
import { ClipCard } from "@/components/ui/ClipCard/ClipCard";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar/ProgressBar";
import { projectsRepository } from "@/server/repositories/projects.repository";
import { projectStatusLabel, projectStatusTone } from "@/lib/project-status";
import { SectionIntro } from "../_components/SectionIntro";
import { EmptyNotice } from "../_components/EmptyNotice";
import styles from "./page.module.css";

const INTRO_DESCRIPTION =
  "Todo lo que he construido, en cualquier estado: terminado, en desarrollo, en beta, en idea o pausado. Cada ficha entra en el problema que resolvía, la solución planteada, las tecnologías usadas y qué aprendí por el camino — no solo el resultado final.";

export default async function ProyectosPage() {
  const projects = await projectsRepository.findPublished();

  const intro = (
    <SectionIntro
      eyebrow="Proyectos"
      title="Proyectos"
      description={INTRO_DESCRIPTION}
      accent="cyan"
      meta={projects.length > 0 ? `${projects.length} publicados` : undefined}
    />
  );

  if (projects.length === 0) {
    return (
      <>
        {intro}
        <EmptyNotice message="Todavía no hay proyectos publicados." accent="cyan" />
      </>
    );
  }

  return (
    <>
      {intro}
      <div className={styles.grid}>
        {projects.map((project) => (
          <Link key={project.id} href={`/proyectos/${project.slug}`} className={styles.cardLink}>
            <ClipCard
              eyebrow={project.technologies.join(" · ") || "Proyecto"}
              title={project.name}
              accent={projectStatusTone(project.status)}
            >
              {project.coverImageUrl ? (
                <div className={styles.coverWrap}>
                  <Image
                    src={project.coverImageUrl}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : null}
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
        ))}
      </div>
    </>
  );
}
