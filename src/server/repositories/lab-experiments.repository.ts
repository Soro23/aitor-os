import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/dto/database.types";
import type { LabExperimentDTO } from "@/types/dto/lab-experiment.dto";
import type {
  CreateLabExperimentInput,
  UpdateLabExperimentInput,
} from "@/lib/validation/lab-experiment.schema";

type LabExperimentRow = Database["asros"]["Tables"]["lab_experiments"]["Row"];

function toDTO(row: LabExperimentRow): LabExperimentDTO {
  return {
    id: row.id,
    labNumber: row.lab_number,
    title: row.title,
    description: row.description,
    stack: row.stack,
    status: row.status,
    githubUrl: row.github_url,
    demoUrl: row.demo_url,
    isPublished: row.is_published,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const labExperimentsRepository = {
  async findPublished(): Promise<LabExperimentDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lab_experiments")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findFeatured(): Promise<LabExperimentDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lab_experiments")
      .select("*")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findLatestPublished(): Promise<LabExperimentDTO | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lab_experiments")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data ? toDTO(data) : null;
  },

  async findAll(): Promise<LabExperimentDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lab_experiments")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findById(id: string): Promise<LabExperimentDTO | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lab_experiments")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? toDTO(data) : null;
  },

  async create(input: CreateLabExperimentInput): Promise<LabExperimentDTO> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lab_experiments")
      .insert({
        title: input.title,
        description: input.description ?? null,
        stack: input.stack,
        status: input.status,
        github_url: input.githubUrl || null,
        demo_url: input.demoUrl || null,
        is_published: input.isPublished,
        is_featured: input.isFeatured,
        sort_order: input.sortOrder,
      })
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async update(id: string, input: UpdateLabExperimentInput): Promise<LabExperimentDTO> {
    const supabase = await createClient();
    const patch: Database["asros"]["Tables"]["lab_experiments"]["Update"] = {};

    if (input.title !== undefined) patch.title = input.title;
    if (input.description !== undefined) patch.description = input.description;
    if (input.stack !== undefined) patch.stack = input.stack;
    if (input.status !== undefined) patch.status = input.status;
    if (input.githubUrl !== undefined) patch.github_url = input.githubUrl || null;
    if (input.demoUrl !== undefined) patch.demo_url = input.demoUrl || null;
    if (input.isPublished !== undefined) patch.is_published = input.isPublished;
    if (input.isFeatured !== undefined) patch.is_featured = input.isFeatured;
    if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;

    const { data, error } = await supabase
      .from("lab_experiments")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("lab_experiments").delete().eq("id", id);
    if (error) throw error;
  },

  async setPublished(id: string, value: boolean): Promise<LabExperimentDTO> {
    return labExperimentsRepository.update(id, { isPublished: value });
  },

  async setFeatured(id: string, value: boolean): Promise<LabExperimentDTO> {
    return labExperimentsRepository.update(id, { isFeatured: value });
  },
};
