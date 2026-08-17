import { Panel } from "@/components/ui/Panel/Panel";

export default function AdminHomePage() {
  return (
    <Panel accent="cyan">
      <p className="hud-label">Panel de administración</p>
      <h1>Bienvenido</h1>
      <p>El CRUD de cada colección se conecta a partir de la Fase 5.</p>
    </Panel>
  );
}
