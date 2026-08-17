import { Panel } from "@/components/ui/Panel/Panel";
import { NowItemForm } from "../NowItemForm";

export default function NewNowItemPage() {
  return (
    <Panel accent="green">
      <p className="hud-label">Now · Nuevo</p>
      <NowItemForm />
    </Panel>
  );
}
