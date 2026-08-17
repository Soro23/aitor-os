import { Panel } from "@/components/ui/Panel/Panel";
import { ProjectForm } from "../ProjectForm";

export default function NewProjectPage() {
  return (
    <Panel accent="cyan">
      <p className="hud-label">Proyectos · Nuevo</p>
      <ProjectForm />
    </Panel>
  );
}
