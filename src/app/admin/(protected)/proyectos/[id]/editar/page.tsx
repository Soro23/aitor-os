import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/Panel/Panel";
import { projectsRepository } from "@/server/repositories/projects.repository";
import { ProjectForm } from "../../ProjectForm";

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

  return (
    <Panel accent="cyan">
      <p className="hud-label">Proyectos · Editar</p>
      <ProjectForm project={project} />
    </Panel>
  );
}
