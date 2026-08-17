import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/Panel/Panel";
import { labExperimentsRepository } from "@/server/repositories/lab-experiments.repository";
import { LabExperimentForm } from "../../LabExperimentForm";

export default async function EditLabExperimentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const experiment = await labExperimentsRepository.findById(id);

  if (!experiment) {
    notFound();
  }

  return (
    <Panel accent="green">
      <p className="hud-label">Lab · Editar</p>
      <LabExperimentForm experiment={experiment} />
    </Panel>
  );
}
