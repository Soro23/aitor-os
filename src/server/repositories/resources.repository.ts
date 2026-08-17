import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/dto/database.types";
import type { ResourceDTO } from "@/types/dto/resource.dto";
import type { CreateResourceInput, UpdateResourceInput } from "@/lib/validation/resource.schema";

type ResourceRow = Database["asros"]["Tables"]["resources"]["Row"];

function toDTO(row: ResourceRow): ResourceDTO {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    type: row.type,
    url: row.url,
    isPublished: row.is_published,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const resourcesRepository = {
  async findPublished(): Promise<ResourceDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findFeatured(): Promise<ResourceDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findAll(): Promise<ResourceDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findById(id: string): Promise<ResourceDTO | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? toDTO(data) : null;
  },

  async create(input: CreateResourceInput): Promise<ResourceDTO> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("resources")
      .insert({
        name: input.name,
        description: input.description ?? null,
        type: input.type,
        url: input.url,
        is_published: input.isPublished,
        is_featured: input.isFeatured,
        sort_order: input.sortOrder,
      })
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async update(id: string, input: UpdateResourceInput): Promise<ResourceDTO> {
    const supabase = await createClient();
    const patch: Database["asros"]["Tables"]["resources"]["Update"] = {};

    if (input.name !== undefined) patch.name = input.name;
    if (input.description !== undefined) patch.description = input.description;
    if (input.type !== undefined) patch.type = input.type;
    if (input.url !== undefined) patch.url = input.url;
    if (input.isPublished !== undefined) patch.is_published = input.isPublished;
    if (input.isFeatured !== undefined) patch.is_featured = input.isFeatured;
    if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;

    const { data, error } = await supabase
      .from("resources")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) throw error;
  },

  async setPublished(id: string, value: boolean): Promise<ResourceDTO> {
    return resourcesRepository.update(id, { isPublished: value });
  },

  async setFeatured(id: string, value: boolean): Promise<ResourceDTO> {
    return resourcesRepository.update(id, { isFeatured: value });
  },
};
