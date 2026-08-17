import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/dto/database.types";
import type { ProjectDTO } from "@/types/dto/project.dto";
import type { CreateProjectInput, UpdateProjectInput } from "@/lib/validation/project.schema";

type ProjectRow = Database["asros"]["Tables"]["projects"]["Row"];

function toDTO(row: ProjectRow): ProjectDTO {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    problem: row.problem,
    solution: row.solution,
    technologies: row.technologies,
    architecture: row.architecture,
    status: row.status,
    progress: row.progress,
    githubUrl: row.github_url,
    demoUrl: row.demo_url,
    learnings: row.learnings,
    nextSteps: row.next_steps,
    isPublished: row.is_published,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const projectsRepository = {
  async findPublished(): Promise<ProjectDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findFeatured(): Promise<ProjectDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findAll(): Promise<ProjectDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findById(id: string): Promise<ProjectDTO | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? toDTO(data) : null;
  },

  async findBySlug(slug: string): Promise<ProjectDTO | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    return data ? toDTO(data) : null;
  },

  async create(input: CreateProjectInput): Promise<ProjectDTO> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .insert({
        slug: input.slug,
        name: input.name,
        description: input.description ?? null,
        problem: input.problem ?? null,
        solution: input.solution ?? null,
        technologies: input.technologies,
        architecture: input.architecture ?? null,
        status: input.status,
        progress: input.progress,
        github_url: input.githubUrl || null,
        demo_url: input.demoUrl || null,
        learnings: input.learnings ?? null,
        next_steps: input.nextSteps ?? null,
        is_published: input.isPublished,
        is_featured: input.isFeatured,
        sort_order: input.sortOrder,
      })
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async update(id: string, input: UpdateProjectInput): Promise<ProjectDTO> {
    const supabase = await createClient();
    const patch: Database["asros"]["Tables"]["projects"]["Update"] = {};

    if (input.slug !== undefined) patch.slug = input.slug;
    if (input.name !== undefined) patch.name = input.name;
    if (input.description !== undefined) patch.description = input.description;
    if (input.problem !== undefined) patch.problem = input.problem;
    if (input.solution !== undefined) patch.solution = input.solution;
    if (input.technologies !== undefined) patch.technologies = input.technologies;
    if (input.architecture !== undefined) patch.architecture = input.architecture;
    if (input.status !== undefined) patch.status = input.status;
    if (input.progress !== undefined) patch.progress = input.progress;
    if (input.githubUrl !== undefined) patch.github_url = input.githubUrl || null;
    if (input.demoUrl !== undefined) patch.demo_url = input.demoUrl || null;
    if (input.learnings !== undefined) patch.learnings = input.learnings;
    if (input.nextSteps !== undefined) patch.next_steps = input.nextSteps;
    if (input.isPublished !== undefined) patch.is_published = input.isPublished;
    if (input.isFeatured !== undefined) patch.is_featured = input.isFeatured;
    if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;

    const { data, error } = await supabase
      .from("projects")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
  },

  async setPublished(id: string, value: boolean): Promise<ProjectDTO> {
    return projectsRepository.update(id, { isPublished: value });
  },

  async setFeatured(id: string, value: boolean): Promise<ProjectDTO> {
    return projectsRepository.update(id, { isFeatured: value });
  },
};
