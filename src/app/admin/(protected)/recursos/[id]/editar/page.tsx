import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/Panel/Panel";
import { resourcesRepository } from "@/server/repositories/resources.repository";
import { ResourceForm } from "../../ResourceForm";

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resource = await resourcesRepository.findById(id);

  if (!resource) {
    notFound();
  }

  return (
    <Panel accent="violet">
      <p className="hud-label">Recursos · Editar</p>
      <ResourceForm resource={resource} />
    </Panel>
  );
}
