import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/dto/database.types";
import type { ProjectScreenshotDTO } from "@/types/dto/project-screenshot.dto";
import type {
  CreateProjectScreenshotInput,
  UpdateProjectScreenshotInput,
} from "@/lib/validation/project-screenshot.schema";

type ProjectScreenshotRow = Database["asros"]["Tables"]["project_screenshots"]["Row"];

function toDTO(row: ProjectScreenshotRow): ProjectScreenshotDTO {
  return {
    id: row.id,
    projectId: row.project_id,
    imageUrl: row.image_url,
    altText: row.alt_text,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export const projectScreenshotsRepository = {
  async findByProjectId(projectId: string): Promise<ProjectScreenshotDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("project_screenshots")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async create(input: CreateProjectScreenshotInput): Promise<ProjectScreenshotDTO> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("project_screenshots")
      .insert({
        project_id: input.projectId,
        image_url: input.imageUrl,
        alt_text: input.altText ?? null,
        sort_order: input.sortOrder,
      })
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async update(id: string, input: UpdateProjectScreenshotInput): Promise<ProjectScreenshotDTO> {
    const supabase = await createClient();
    const patch: Database["asros"]["Tables"]["project_screenshots"]["Update"] = {};

    if (input.altText !== undefined) patch.alt_text = input.altText;
    if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;

    const { data, error } = await supabase
      .from("project_screenshots")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("project_screenshots").delete().eq("id", id);
    if (error) throw error;
  },
};
