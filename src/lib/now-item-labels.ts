import type { NowItemCategory } from "@/types/dto/now-item.dto";

const CATEGORY_LABELS: Record<NowItemCategory, string> = {
  building: "Trabajando en",
  learning: "Aprendiendo",
  exploring: "Explorando",
};

export function nowItemCategoryLabel(category: NowItemCategory): string {
  return CATEGORY_LABELS[category];
}
