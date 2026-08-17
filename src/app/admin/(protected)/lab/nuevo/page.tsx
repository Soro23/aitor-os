import { Panel } from "@/components/ui/Panel/Panel";
import { LabExperimentForm } from "../LabExperimentForm";

export default function NewLabExperimentPage() {
  return (
    <Panel accent="green">
      <p className="hud-label">Lab · Nuevo experimento</p>
      <LabExperimentForm />
    </Panel>
  );
}
