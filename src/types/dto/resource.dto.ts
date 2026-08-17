import type { RESOURCE_TYPE_VALUES } from "@/lib/validation/resource.schema";

export type ResourceType = (typeof RESOURCE_TYPE_VALUES)[number];

/** Server -> admin UI. Forma completa, incluye campos de gestión interna. */
export interface ResourceDTO {
  id: string;
  name: string;
  description: string | null;
  type: ResourceType;
  url: string;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Server -> página pública. Subset de ResourceDTO sin campos de gestión interna. */
export interface ResourcePublicView {
  id: string;
  name: string;
  description: string | null;
  type: ResourceType;
  url: string;
}

export function toResourcePublicView(resource: ResourceDTO): ResourcePublicView {
  return {
    id: resource.id,
    name: resource.name,
    description: resource.description,
    type: resource.type,
    url: resource.url,
  };
}
