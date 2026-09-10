import { Panel } from "@/components/ui/Panel/Panel";
import { UiStyleForm } from "../UiStyleForm";

export default function NewUiStylePage() {
  return (
    <Panel accent="violet">
      <p className="hud-label">Estilos UI · Nuevo estilo</p>
      <UiStyleForm />
    </Panel>
  );
}
