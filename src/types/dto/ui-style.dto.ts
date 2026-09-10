import type { UI_STYLE_CATEGORY_VALUES } from "@/lib/validation/ui-style.schema";
import type { UiStyleImageDTO } from "./ui-style-image.dto";
import type { UiStyleLinkDTO } from "./ui-style-link.dto";

export type UiStyleCategory = (typeof UI_STYLE_CATEGORY_VALUES)[number];

/** Server -> admin UI. Forma completa, incluye campos de gestión interna. */
export interface UiStyleDTO {
  id: string;
  slug: string;
  name: string;
  category: UiStyleCategory;
  summary: string | null;
  description: string | null;
  characteristics: string | null;
  useCases: string | null;
  coverImageUrl: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Server -> página pública. Subset de UiStyleDTO sin campos de gestión interna. */
export interface UiStylePublicView {
  id: string;
  slug: string;
  name: string;
  category: UiStyleCategory;
  summary: string | null;
  description: string | null;
  characteristics: string | null;
  useCases: string | null;
  coverImageUrl: string | null;
  images: UiStyleImageDTO[];
  links: UiStyleLinkDTO[];
}

/** Resumen usado en listados y en la tarjeta de entrada del Garden. */
export interface UiStyleSummary {
  id: string;
  slug: string;
  name: string;
  category: UiStyleCategory;
  summary: string | null;
  coverImageUrl: string | null;
}

export function toUiStyleSummary(style: UiStyleDTO): UiStyleSummary {
  return {
    id: style.id,
    slug: style.slug,
    name: style.name,
    category: style.category,
    summary: style.summary,
    coverImageUrl: style.coverImageUrl,
  };
}

export function toUiStylePublicView(
  style: UiStyleDTO,
  images: UiStyleImageDTO[] = [],
  links: UiStyleLinkDTO[] = [],
): UiStylePublicView {
  return {
    id: style.id,
    slug: style.slug,
    name: style.name,
    category: style.category,
    summary: style.summary,
    description: style.description,
    characteristics: style.characteristics,
    useCases: style.useCases,
    coverImageUrl: style.coverImageUrl,
    images,
    links,
  };
}
