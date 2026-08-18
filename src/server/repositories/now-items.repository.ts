import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/dto/database.types";
import type { NowItemDTO } from "@/types/dto/now-item.dto";
import type { CreateNowItemInput, UpdateNowItemInput } from "@/lib/validation/now-item.schema";

type NowItemRow = Database["public"]["Tables"]["now_items"]["Row"];

function toDTO(row: NowItemRow): NowItemDTO {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    description: row.description,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const nowItemsRepository = {
  async findActive(): Promise<NowItemDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("now_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findAll(): Promise<NowItemDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("now_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findById(id: string): Promise<NowItemDTO | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from("now_items").select("*").eq("id", id).maybeSingle();

    if (error) throw error;
    return data ? toDTO(data) : null;
  },

  async create(input: CreateNowItemInput): Promise<NowItemDTO> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("now_items")
      .insert({
        category: input.category,
        title: input.title,
        description: input.description ?? null,
        is_active: input.isActive,
        sort_order: input.sortOrder,
      })
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async update(id: string, input: UpdateNowItemInput): Promise<NowItemDTO> {
    const supabase = await createClient();
    const patch: Database["public"]["Tables"]["now_items"]["Update"] = {};

    if (input.category !== undefined) patch.category = input.category;
    if (input.title !== undefined) patch.title = input.title;
    if (input.description !== undefined) patch.description = input.description;
    if (input.isActive !== undefined) patch.is_active = input.isActive;
    if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;

    const { data, error } = await supabase
      .from("now_items")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("now_items").delete().eq("id", id);
    if (error) throw error;
  },

  async setActive(id: string, value: boolean): Promise<NowItemDTO> {
    return nowItemsRepository.update(id, { isActive: value });
  },
};
