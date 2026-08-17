import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/dto/database.types";
import type { GardenNoteDTO, GardenNoteCategory } from "@/types/dto/garden-note.dto";
import type {
  CreateGardenNoteInput,
  UpdateGardenNoteInput,
} from "@/lib/validation/garden-note.schema";

type GardenNoteRow = Database["asros"]["Tables"]["garden_notes"]["Row"];

function toDTO(row: GardenNoteRow): GardenNoteDTO {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    status: row.status,
    content: row.content,
    examples: row.examples,
    commands: row.commands,
    referencesText: row.references_text,
    isPublished: row.is_published,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const gardenNotesRepository = {
  async findPublished(): Promise<GardenNoteDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("garden_notes")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findLatestPublished(): Promise<GardenNoteDTO | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("garden_notes")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data ? toDTO(data) : null;
  },

  async findPublishedByCategory(category: GardenNoteCategory): Promise<GardenNoteDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("garden_notes")
      .select("*")
      .eq("is_published", true)
      .eq("category", category)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findFeatured(): Promise<GardenNoteDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("garden_notes")
      .select("*")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findAll(): Promise<GardenNoteDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("garden_notes")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findById(id: string): Promise<GardenNoteDTO | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("garden_notes")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? toDTO(data) : null;
  },

  async findBySlug(slug: string): Promise<GardenNoteDTO | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("garden_notes")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    return data ? toDTO(data) : null;
  },

  async create(input: CreateGardenNoteInput): Promise<GardenNoteDTO> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("garden_notes")
      .insert({
        slug: input.slug,
        title: input.title,
        category: input.category,
        status: input.status,
        content: input.content ?? null,
        examples: input.examples ?? null,
        commands: input.commands ?? null,
        references_text: input.referencesText ?? null,
        is_published: input.isPublished,
        is_featured: input.isFeatured,
        sort_order: input.sortOrder,
      })
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async update(id: string, input: UpdateGardenNoteInput): Promise<GardenNoteDTO> {
    const supabase = await createClient();
    const patch: Database["asros"]["Tables"]["garden_notes"]["Update"] = {};

    if (input.slug !== undefined) patch.slug = input.slug;
    if (input.title !== undefined) patch.title = input.title;
    if (input.category !== undefined) patch.category = input.category;
    if (input.status !== undefined) patch.status = input.status;
    if (input.content !== undefined) patch.content = input.content;
    if (input.examples !== undefined) patch.examples = input.examples;
    if (input.commands !== undefined) patch.commands = input.commands;
    if (input.referencesText !== undefined) patch.references_text = input.referencesText;
    if (input.isPublished !== undefined) patch.is_published = input.isPublished;
    if (input.isFeatured !== undefined) patch.is_featured = input.isFeatured;
    if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;

    const { data, error } = await supabase
      .from("garden_notes")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("garden_notes").delete().eq("id", id);
    if (error) throw error;
  },

  async setPublished(id: string, value: boolean): Promise<GardenNoteDTO> {
    return gardenNotesRepository.update(id, { isPublished: value });
  },

  async setFeatured(id: string, value: boolean): Promise<GardenNoteDTO> {
    return gardenNotesRepository.update(id, { isFeatured: value });
  },
};
