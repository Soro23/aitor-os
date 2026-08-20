export type FinancialEntryType = "ingreso" | "gasto";

export interface FinancialEntryDTO {
  id: string;
  type: FinancialEntryType;
  amount: number;
  category: string | null;
  description: string;
  entryDate: string;
  leadId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialTotals {
  income: number;
  expense: number;
  balance: number;
}
