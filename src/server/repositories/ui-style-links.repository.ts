import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/dto/database.types";
import type { UiStyleLinkDTO } from "@/types/dto/ui-style-link.dto";
import type {
  CreateUiStyleLinkInput,
  UpdateUiStyleLinkInput,
} from "@/lib/validation/ui-style-link.schema";

type UiStyleLinkRow = Database["public"]["Tables"]["ui_style_links"]["Row"];

function toDTO(row: UiStyleLinkRow): UiStyleLinkDTO {
  return {
    id: row.id,
    uiStyleId: row.ui_style_id,
    label: row.label,
    url: row.url,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export const uiStyleLinksRepository = {
  async findById(id: string): Promise<UiStyleLinkDTO | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ui_style_links")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? toDTO(data) : null;
  },

  async findByUiStyleId(uiStyleId: string): Promise<UiStyleLinkDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ui_style_links")
      .select("*")
      .eq("ui_style_id", uiStyleId)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async create(input: CreateUiStyleLinkInput): Promise<UiStyleLinkDTO> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ui_style_links")
      .insert({
        ui_style_id: input.uiStyleId,
        label: input.label,
        url: input.url,
        sort_order: input.sortOrder,
      })
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async update(id: string, input: UpdateUiStyleLinkInput): Promise<UiStyleLinkDTO> {
    const supabase = await createClient();
    const patch: Database["public"]["Tables"]["ui_style_links"]["Update"] = {};

    if (input.label !== undefined) patch.label = input.label;
    if (input.url !== undefined) patch.url = input.url;
    if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;

    const { data, error } = await supabase
      .from("ui_style_links")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("ui_style_links").delete().eq("id", id);
    if (error) throw error;
  },
};
