import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/dto/database.types";
import type { UiStyleDTO } from "@/types/dto/ui-style.dto";
import type { CreateUiStyleInput, UpdateUiStyleInput } from "@/lib/validation/ui-style.schema";

type UiStyleRow = Database["public"]["Tables"]["ui_styles"]["Row"];

function toDTO(row: UiStyleRow): UiStyleDTO {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    summary: row.summary,
    description: row.description,
    characteristics: row.characteristics,
    useCases: row.use_cases,
    coverImageUrl: row.cover_image_url,
    isPublished: row.is_published,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const uiStylesRepository = {
  async findPublished(): Promise<UiStyleDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ui_styles")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findFeatured(): Promise<UiStyleDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ui_styles")
      .select("*")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findAll(): Promise<UiStyleDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ui_styles")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findById(id: string): Promise<UiStyleDTO | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ui_styles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? toDTO(data) : null;
  },

  async findBySlug(slug: string): Promise<UiStyleDTO | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ui_styles")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    return data ? toDTO(data) : null;
  },

  async create(input: CreateUiStyleInput): Promise<UiStyleDTO> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ui_styles")
      .insert({
        slug: input.slug,
        name: input.name,
        category: input.category,
        summary: input.summary ?? null,
        description: input.description ?? null,
        characteristics: input.characteristics ?? null,
        use_cases: input.useCases ?? null,
        cover_image_url: input.coverImageUrl ?? null,
        is_published: input.isPublished,
        is_featured: input.isFeatured,
        sort_order: input.sortOrder,
      })
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async update(id: string, input: UpdateUiStyleInput): Promise<UiStyleDTO> {
    const supabase = await createClient();
    const patch: Database["public"]["Tables"]["ui_styles"]["Update"] = {};

    if (input.slug !== undefined) patch.slug = input.slug;
    if (input.name !== undefined) patch.name = input.name;
    if (input.category !== undefined) patch.category = input.category;
    if (input.summary !== undefined) patch.summary = input.summary;
    if (input.description !== undefined) patch.description = input.description;
    if (input.characteristics !== undefined) patch.characteristics = input.characteristics;
    if (input.useCases !== undefined) patch.use_cases = input.useCases;
    if (input.coverImageUrl !== undefined) patch.cover_image_url = input.coverImageUrl;
    if (input.isPublished !== undefined) patch.is_published = input.isPublished;
    if (input.isFeatured !== undefined) patch.is_featured = input.isFeatured;
    if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;

    const { data, error } = await supabase
      .from("ui_styles")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("ui_styles").delete().eq("id", id);
    if (error) throw error;
  },

  async setPublished(id: string, value: boolean): Promise<UiStyleDTO> {
    return uiStylesRepository.update(id, { isPublished: value });
  },

  async setFeatured(id: string, value: boolean): Promise<UiStyleDTO> {
    return uiStylesRepository.update(id, { isFeatured: value });
  },
};
