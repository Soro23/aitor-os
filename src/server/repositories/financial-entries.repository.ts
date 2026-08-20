import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/dto/database.types";
import type { FinancialEntryDTO, FinancialTotals } from "@/types/dto/financial-entry.dto";
import type {
  CreateFinancialEntryInput,
  UpdateFinancialEntryInput,
} from "@/lib/validation/financial-entry.schema";

type FinancialEntryRow = Database["public"]["Tables"]["financial_entries"]["Row"];

export interface FinancialEntryFilters {
  from?: string;
  to?: string;
  type?: "ingreso" | "gasto";
}

function toDTO(row: FinancialEntryRow): FinancialEntryDTO {
  return {
    id: row.id,
    type: row.type,
    amount: row.amount,
    category: row.category,
    description: row.description,
    entryDate: row.entry_date,
    leadId: row.lead_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const financialEntriesRepository = {
  async findAll(filters: FinancialEntryFilters = {}): Promise<FinancialEntryDTO[]> {
    const supabase = await createClient();
    let query = supabase.from("financial_entries").select("*").order("entry_date", { ascending: false });

    if (filters.from) query = query.gte("entry_date", filters.from);
    if (filters.to) query = query.lte("entry_date", filters.to);
    if (filters.type) query = query.eq("type", filters.type);

    const { data, error } = await query;

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async findById(id: string): Promise<FinancialEntryDTO | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("financial_entries")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? toDTO(data) : null;
  },

  async findByLead(leadId: string): Promise<FinancialEntryDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("financial_entries")
      .select("*")
      .eq("lead_id", leadId)
      .order("entry_date", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(toDTO);
  },

  async create(input: CreateFinancialEntryInput): Promise<FinancialEntryDTO> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("financial_entries")
      .insert({
        type: input.type,
        amount: input.amount,
        category: input.category ?? null,
        description: input.description,
        entry_date: input.entryDate,
        lead_id: input.leadId ?? null,
      })
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async update(id: string, input: UpdateFinancialEntryInput): Promise<FinancialEntryDTO> {
    const supabase = await createClient();
    const patch: Database["public"]["Tables"]["financial_entries"]["Update"] = {};

    if (input.type !== undefined) patch.type = input.type;
    if (input.amount !== undefined) patch.amount = input.amount;
    if (input.category !== undefined) patch.category = input.category;
    if (input.description !== undefined) patch.description = input.description;
    if (input.entryDate !== undefined) patch.entry_date = input.entryDate;
    if (input.leadId !== undefined) patch.lead_id = input.leadId;

    const { data, error } = await supabase
      .from("financial_entries")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return toDTO(data);
  },

  async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("financial_entries").delete().eq("id", id);
    if (error) throw error;
  },

  async getTotals(from?: string, to?: string): Promise<FinancialTotals> {
    const entries = await financialEntriesRepository.findAll({ from, to });

    const totals = entries.reduce(
      (acc, entry) => {
        if (entry.type === "ingreso") acc.income += entry.amount;
        else acc.expense += entry.amount;
        return acc;
      },
      { income: 0, expense: 0 },
    );

    return { ...totals, balance: totals.income - totals.expense };
  },
};
