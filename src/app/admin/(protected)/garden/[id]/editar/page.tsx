import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/Panel/Panel";
import { gardenNotesRepository } from "@/server/repositories/garden-notes.repository";
import { GardenNoteForm } from "../../GardenNoteForm";

export default async function EditGardenNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const note = await gardenNotesRepository.findById(id);

  if (!note) {
    notFound();
  }

  return (
    <Panel accent="violet">
      <p className="hud-label">Garden · Editar</p>
      <GardenNoteForm note={note} />
    </Panel>
  );
}
