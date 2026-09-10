import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/dto/database.types";
import type { UiStyleImageDTO } from "@/types/dto/ui-style-image.dto";
import type {
  CreateUiStyleImageInput,
  UpdateUiStyleImageInput,
} from "@/lib/validation/ui-style-image.schema";

type UiStyleImageRow = Database["public"]["Tables"]["ui_style_images"]["Row"];

function toDTO(row: UiStyleImageRow): UiStyleImageDTO {
  return {
    id: row.id,
    uiStyleId: row.ui_style_id,
    imageUrl: row.image_url,
    altText: row.alt_text,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export const uiStyleImagesRepository = {
  async findById(id: string): Promise<UiStyleImageDTO | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ui_style_images")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? toDTO(data) : null;
  },

  async findByUiStyleId(uiStyleId: string): Promise<UiStyleImageDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ui_style_images")
      .select("*")
      .eq("ui_style_id", uiStyleId)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async create(input: CreateUiStyleImageInput): Promise<UiStyleImageDTO> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ui_style_images")
      .insert({
        ui_style_id: input.uiStyleId,
        image_url: input.imageUrl,
        alt_text: input.altText ?? null,
        sort_order: input.sortOrder,
      })
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async update(id: string, input: UpdateUiStyleImageInput): Promise<UiStyleImageDTO> {
    const supabase = await createClient();
    const patch: Database["public"]["Tables"]["ui_style_images"]["Update"] = {};

    if (input.altText !== undefined) patch.alt_text = input.altText;
    if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;

    const { data, error } = await supabase
      .from("ui_style_images")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("ui_style_images").delete().eq("id", id);
    if (error) throw error;
  },
};
