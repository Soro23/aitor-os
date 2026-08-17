import { Panel } from "@/components/ui/Panel/Panel";
import { GardenNoteForm } from "../GardenNoteForm";

export default function NewGardenNotePage() {
  return (
    <Panel accent="violet">
      <p className="hud-label">Garden · Nueva nota</p>
      <GardenNoteForm />
    </Panel>
  );
}
