import { Panel } from "@/components/ui/Panel/Panel";
import { LeadForm } from "../LeadForm";

export default function NewLeadPage() {
  return (
    <Panel accent="cyan">
      <p className="hud-label">Leads · Nuevo</p>
      <LeadForm />
    </Panel>
  );
}
