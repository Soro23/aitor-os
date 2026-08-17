import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/dto/database.types";
import type { ContactMessageDTO } from "@/types/dto/contact-message.dto";
import type { CreateContactMessageInput } from "@/lib/validation/contact-message.schema";

type ContactMessageRow = Database["asros"]["Tables"]["contact_messages"]["Row"];

function toDTO(row: ContactMessageRow): ContactMessageDTO {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    interest: row.interest,
    isRead: row.is_read,
    createdAt: row.created_at,
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

  async findAll(): Promise<ContactMessageDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async markAsRead(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) throw error;
  },
};
