import Link from "next/link";
import { ClipCard } from "@/components/ui/ClipCard/ClipCard";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar/ProgressBar";
import { projectsRepository } from "@/server/repositories/projects.repository";
import { projectStatusLabel, projectStatusTone } from "@/lib/project-status";
import { PlaceholderSection } from "../_components/PlaceholderSection";
import styles from "./page.module.css";

export default async function ProyectosPage() {
  const projects = await projectsRepository.findPublished();

  if (projects.length === 0) {
    return (
      <PlaceholderSection
        eyebrow="Proyectos"
        title="Proyectos"
        description="Todavía no hay proyectos publicados."
        accent="cyan"
      />
    );
  }

  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <Link key={project.id} href={`/proyectos/${project.slug}`} className={styles.cardLink}>
          <ClipCard
            eyebrow={project.technologies.join(" · ") || "Proyecto"}
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
      ))}
    </div>
  );
}
