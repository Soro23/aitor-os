import type { STACK_CATEGORY_VALUES, STACK_USAGE_LEVEL_VALUES } from "@/lib/validation/stack-item.schema";

export type StackCategory = (typeof STACK_CATEGORY_VALUES)[number];
export type StackUsageLevel = (typeof STACK_USAGE_LEVEL_VALUES)[number];

export interface StackItemDTO {
  id: string;
  name: string;
  category: StackCategory;
  usageLevel: StackUsageLevel;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
