import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/Panel/Panel";
import { proposalTemplatesRepository } from "@/server/repositories/proposal-templates.repository";
import { ProposalTemplateForm } from "../../ProposalTemplateForm";

export default async function EditProposalTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = await proposalTemplatesRepository.findById(id);

  if (!template) {
    notFound();
  }

  return (
    <Panel accent="violet">
      <p className="hud-label">Plantillas · Editar</p>
      <ProposalTemplateForm template={template} />
    </Panel>
  );
}
