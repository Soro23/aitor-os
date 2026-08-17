import { createClient } from "@/lib/supabase/server";
import type { GardenNoteSummary } from "@/types/dto/garden-note.dto";

/**
 * Tabla de asociacion N:N auto-referenciada — no es una entidad editorial
 * propia (sin findPublished/setFeatured), solo gestiona relaciones entre
 * garden_notes ya existentes.
 */
export const gardenNoteRelationsRepository = {
  async findRelatedTo(noteId: string): Promise<GardenNoteSummary[]> {
    const supabase = await createClient();
    const { data: relations, error } = await supabase
      .from("garden_note_relations")
      .select("related_note_id")
      .eq("note_id", noteId);

    if (error) throw error;

    const relatedIds = (relations ?? []).map((relation) => relation.related_note_id);
    if (relatedIds.length === 0) return [];

    const { data: notes, error: notesError } = await supabase
      .from("garden_notes")
      .select("id, slug, title, category, status")
      .in("id", relatedIds);

    if (notesError) throw notesError;

    return (notes ?? []).map((note) => ({
      id: note.id,
      slug: note.slug,
      title: note.title,
      category: note.category,
      status: note.status,
    }));
  },

  async addRelation(noteId: string, relatedNoteId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("garden_note_relations")
      .insert({ note_id: noteId, related_note_id: relatedNoteId });

    if (error) throw error;
  },

  async removeRelation(noteId: string, relatedNoteId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("garden_note_relations")
      .delete()
      .eq("note_id", noteId)
      .eq("related_note_id", relatedNoteId);

    if (error) throw error;
  },
};
