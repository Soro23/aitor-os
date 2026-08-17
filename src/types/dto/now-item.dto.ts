import type { NOW_ITEM_CATEGORY_VALUES } from "@/lib/validation/now-item.schema";

export type NowItemCategory = (typeof NOW_ITEM_CATEGORY_VALUES)[number];

export interface NowItemDTO {
  id: string;
  category: NowItemCategory;
  title: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
