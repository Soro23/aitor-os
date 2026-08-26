import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/Panel/Panel";
import { projectsRepository } from "@/server/repositories/projects.repository";
import { projectScreenshotsRepository } from "@/server/repositories/project-screenshots.repository";
import { ProjectForm } from "../../ProjectForm";
import { ProjectScreenshots } from "../../ProjectScreenshots";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await projectsRepository.findById(id);

  if (!project) {
    notFound();
  }

  const screenshots = await projectScreenshotsRepository.findByProjectId(project.id);

  return (
    <Panel accent="cyan">
      <p className="hud-label">Proyectos · Editar</p>
      <ProjectForm project={project} />
      <ProjectScreenshots projectId={project.id} screenshots={screenshots} />
    </Panel>
  );
}
