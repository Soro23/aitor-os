import { Panel } from "@/components/ui/Panel/Panel";
import { ResourceForm } from "../ResourceForm";

export default function NewResourcePage() {
  return (
    <Panel accent="violet">
      <p className="hud-label">Recursos · Nuevo</p>
      <ResourceForm />
    </Panel>
  );
}
