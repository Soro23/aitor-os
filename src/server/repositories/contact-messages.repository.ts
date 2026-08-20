import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/dto/database.types";
import type { ContactMessageDTO, LeadPipelineStatus } from "@/types/dto/contact-message.dto";
import type { CreateContactMessageInput, CreateLeadManualInput, UpdateLeadPipelineInput } from "@/lib/validation/contact-message.schema";

type ContactMessageRow = Database["public"]["Tables"]["contact_messages"]["Row"];

function toDTO(row: ContactMessageRow): ContactMessageDTO {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    interest: row.interest,
    isRead: row.is_read,
    pipelineStatus: row.pipeline_status,
    internalNotes: row.internal_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const contactMessagesRepository = {
  /**
   * Unico metodo de escritura llamado sin requireAdmin() en todo el
   * proyecto — protegido por RLS insert-only (contact_messages_insert_public)
   * y por rate limiting en la Server Action que lo invoca.
   */
  async create(input: CreateContactMessageInput): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: input.name,
      email: input.email,
      message: input.message,
      interest: input.interest || null,
    });

    if (error) throw error;
  },

  /**
   * Alta manual de un lead desde el admin (ej. un referido que no paso por
   * el formulario publico). A diferencia de create(), esta requiere admin.
   */
  async createManual(input: CreateLeadManualInput): Promise<ContactMessageDTO> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        name: input.name,
        email: input.email,
        message: input.message,
        interest: input.interest || null,
      })
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async findAll(): Promise<ContactMessageDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findById(id: string): Promise<ContactMessageDTO | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from("contact_messages").select("*").eq("id", id).maybeSingle();

    if (error) throw error;
    return data ? toDTO(data) : null;
  },

  async findByPipelineStatus(status: LeadPipelineStatus): Promise<ContactMessageDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .eq("pipeline_status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async markAsRead(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    if (error) throw error;
  },

  async updatePipeline(id: string, input: UpdateLeadPipelineInput): Promise<ContactMessageDTO> {
    const supabase = await createClient();
    const patch: Database["public"]["Tables"]["contact_messages"]["Update"] = {
      pipeline_status: input.pipelineStatus,
    };
    if (input.internalNotes !== undefined) patch.internal_notes = input.internalNotes;

    const { data, error } = await supabase
      .from("contact_messages")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) throw error;
  },
};
