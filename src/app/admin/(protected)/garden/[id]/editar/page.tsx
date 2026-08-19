import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/Panel/Panel";
import { gardenNotesRepository } from "@/server/repositories/garden-notes.repository";
import { gardenNoteRelationsRepository } from "@/server/repositories/garden-note-relations.repository";
import { toGardenNoteSummary } from "@/types/dto/garden-note.dto";
import { GardenNoteForm } from "../../GardenNoteForm";
import { GardenNoteRelations } from "../../GardenNoteRelations";

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

  const [relatedNotes, allNotes] = await Promise.all([
    gardenNoteRelationsRepository.findRelatedTo(note.id),
    gardenNotesRepository.findAll(),
  ]);

  const relatedIds = new Set(relatedNotes.map((related) => related.id));
  const availableNotes = allNotes
    .filter((candidate) => candidate.id !== note.id && !relatedIds.has(candidate.id))
    .map(toGardenNoteSummary);

  return (
    <Panel accent="violet">
      <p className="hud-label">Garden · Editar</p>
      <GardenNoteForm note={note} />
      <GardenNoteRelations noteId={note.id} relatedNotes={relatedNotes} availableNotes={availableNotes} />
    </Panel>
  );
}
