import { Panel } from "@/components/ui/Panel/Panel";

export default function AdminHomePage() {
  return (
    <Panel accent="cyan">
      <p className="hud-label">Panel de administración</p>
      <h1>Bienvenido</h1>
      <p>Usa el menú superior para gestionar cada colección.</p>
    </Panel>
  );
}
