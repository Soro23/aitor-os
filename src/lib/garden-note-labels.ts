import type { GardenNoteCategory, GardenNoteStatus } from "@/types/dto/garden-note.dto";

const STATUS_LABELS: Record<GardenNoteStatus, string> = {
  seed: "Seed",
  growing: "Growing",
  evergreen: "Evergreen",
};

const CATEGORY_LABELS: Record<GardenNoteCategory, string> = {
  sistemas: "Sistemas",
  desarrollo: "Desarrollo",
  ia: "IA",
  ideas: "Ideas",
};

export function gardenNoteStatusLabel(status: GardenNoteStatus): string {
  return STATUS_LABELS[status];
}

export function gardenNoteCategoryLabel(category: GardenNoteCategory): string {
  return CATEGORY_LABELS[category];
}
