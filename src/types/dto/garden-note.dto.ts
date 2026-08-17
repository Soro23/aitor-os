import type { GARDEN_NOTE_CATEGORY_VALUES, GARDEN_NOTE_STATUS_VALUES } from "@/lib/validation/garden-note.schema";

export type GardenNoteCategory = (typeof GARDEN_NOTE_CATEGORY_VALUES)[number];
export type GardenNoteStatus = (typeof GARDEN_NOTE_STATUS_VALUES)[number];

/** Server -> admin UI. Forma completa, incluye campos de gestión interna. */
export interface GardenNoteDTO {
  id: string;
  slug: string;
  title: string;
  category: GardenNoteCategory;
  status: GardenNoteStatus;
  content: string | null;
  examples: string | null;
  commands: string | null;
  referencesText: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Server -> página pública. Subset de GardenNoteDTO sin campos de gestión interna. */
export interface GardenNotePublicView {
  id: string;
  slug: string;
  title: string;
  category: GardenNoteCategory;
  status: GardenNoteStatus;
  content: string | null;
  examples: string | null;
  commands: string | null;
  referencesText: string | null;
  relatedNotes: GardenNoteSummary[];
}

/** Resumen usado en listados y en "notas relacionadas". */
export interface GardenNoteSummary {
  id: string;
  slug: string;
  title: string;
  category: GardenNoteCategory;
  status: GardenNoteStatus;
}

export function toGardenNoteSummary(note: GardenNoteDTO): GardenNoteSummary {
  return {
    id: note.id,
    slug: note.slug,
    title: note.title,
    category: note.category,
    status: note.status,
  };
}

export function toGardenNotePublicView(
  note: GardenNoteDTO,
  relatedNotes: GardenNoteSummary[] = [],
): GardenNotePublicView {
  return {
    id: note.id,
    slug: note.slug,
    title: note.title,
    category: note.category,
    status: note.status,
    content: note.content,
    examples: note.examples,
    commands: note.commands,
    referencesText: note.referencesText,
    relatedNotes,
  };
}
