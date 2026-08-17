import { Panel } from "@/components/ui/Panel/Panel";
import { StackItemForm } from "../StackItemForm";

export default function NewStackItemPage() {
  return (
    <Panel accent="cyan">
      <p className="hud-label">Stack · Nuevo</p>
      <StackItemForm />
    </Panel>
  );
}
