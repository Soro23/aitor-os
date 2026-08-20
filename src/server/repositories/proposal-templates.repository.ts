import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/dto/database.types";
import type { ProposalTemplateDTO } from "@/types/dto/proposal-template.dto";
import type {
  CreateProposalTemplateInput,
  UpdateProposalTemplateInput,
} from "@/lib/validation/proposal-template.schema";

type ProposalTemplateRow = Database["public"]["Tables"]["proposal_templates"]["Row"];

function toDTO(row: ProposalTemplateRow): ProposalTemplateDTO {
  return {
    id: row.id,
    name: row.name,
    summary: row.summary,
    content: row.content,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const proposalTemplatesRepository = {
  async findAll(): Promise<ProposalTemplateDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("proposal_templates")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findById(id: string): Promise<ProposalTemplateDTO | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("proposal_templates")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? toDTO(data) : null;
  },

  async create(input: CreateProposalTemplateInput): Promise<ProposalTemplateDTO> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("proposal_templates")
      .insert({
        name: input.name,
        summary: input.summary ?? null,
        content: input.content,
        is_active: input.isActive,
        sort_order: input.sortOrder,
      })
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async update(id: string, input: UpdateProposalTemplateInput): Promise<ProposalTemplateDTO> {
    const supabase = await createClient();
    const patch: Database["public"]["Tables"]["proposal_templates"]["Update"] = {};

    if (input.name !== undefined) patch.name = input.name;
    if (input.summary !== undefined) patch.summary = input.summary;
    if (input.content !== undefined) patch.content = input.content;
    if (input.isActive !== undefined) patch.is_active = input.isActive;
    if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;

    const { data, error } = await supabase
      .from("proposal_templates")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("proposal_templates").delete().eq("id", id);
    if (error) throw error;
  },

  async setActive(id: string, value: boolean): Promise<ProposalTemplateDTO> {
    return proposalTemplatesRepository.update(id, { isActive: value });
  },
};
