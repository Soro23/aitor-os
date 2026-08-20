import { Panel } from "@/components/ui/Panel/Panel";
import { ProposalTemplateForm } from "../ProposalTemplateForm";

export default function NewProposalTemplatePage() {
  return (
    <Panel accent="violet">
      <p className="hud-label">Plantillas · Nueva</p>
      <ProposalTemplateForm />
    </Panel>
  );
}
