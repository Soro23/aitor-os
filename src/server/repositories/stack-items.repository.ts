import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/dto/database.types";
import type { StackItemDTO } from "@/types/dto/stack-item.dto";
import type { CreateStackItemInput, UpdateStackItemInput } from "@/lib/validation/stack-item.schema";

type StackItemRow = Database["asros"]["Tables"]["stack_items"]["Row"];

function toDTO(row: StackItemRow): StackItemDTO {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    usageLevel: row.usage_level,
    isVisible: row.is_visible,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const stackItemsRepository = {
  async findVisible(): Promise<StackItemDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stack_items")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findAll(): Promise<StackItemDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stack_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findById(id: string): Promise<StackItemDTO | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stack_items")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? toDTO(data) : null;
  },

  async create(input: CreateStackItemInput): Promise<StackItemDTO> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stack_items")
      .insert({
        name: input.name,
        category: input.category,
        usage_level: input.usageLevel,
        is_visible: input.isVisible,
        sort_order: input.sortOrder,
      })
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async update(id: string, input: UpdateStackItemInput): Promise<StackItemDTO> {
    const supabase = await createClient();
    const patch: Database["asros"]["Tables"]["stack_items"]["Update"] = {};

    if (input.name !== undefined) patch.name = input.name;
    if (input.category !== undefined) patch.category = input.category;
    if (input.usageLevel !== undefined) patch.usage_level = input.usageLevel;
    if (input.isVisible !== undefined) patch.is_visible = input.isVisible;
    if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;

    const { data, error } = await supabase
      .from("stack_items")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("stack_items").delete().eq("id", id);
    if (error) throw error;
  },

  async setVisible(id: string, value: boolean): Promise<StackItemDTO> {
    return stackItemsRepository.update(id, { isVisible: value });
  },
};
