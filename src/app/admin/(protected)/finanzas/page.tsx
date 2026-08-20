import Link from "next/link";
import { DataTable } from "@/components/admin/DataTable/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { Panel } from "@/components/ui/Panel/Panel";
import { financialEntriesRepository } from "@/server/repositories/financial-entries.repository";
import { deleteFinancialEntry } from "@/server/actions/financial-entries.actions";
import type { FinancialEntryDTO } from "@/types/dto/financial-entry.dto";
import styles from "@/styles/admin-list.module.css";
import totalsStyles from "./finanzas.module.css";

export default async function AdminFinancialEntriesPage() {
  const [entries, totals] = await Promise.all([
    financialEntriesRepository.findAll(),
    financialEntriesRepository.getTotals(),
  ]);

  return (
    <div className={styles.stack}>
      <div className={styles.header}>
        <h1 className={styles.title}>Finanzas</h1>
        <Link href="/admin/finanzas/nuevo" className={styles.newLink}>
          + Nuevo
        </Link>
      </div>

      <div className={totalsStyles.totals}>
        <Panel accent="green">
          <p className={`hud-label ${totalsStyles.totalLabel}`}>Ingresos</p>
          <p className={totalsStyles.totalValue}>{totals.income.toFixed(2)} €</p>
        </Panel>
        <Panel accent="red">
          <p className={`hud-label ${totalsStyles.totalLabel}`}>Gastos</p>
          <p className={totalsStyles.totalValue}>{totals.expense.toFixed(2)} €</p>
        </Panel>
        <Panel accent={totals.balance >= 0 ? "cyan" : "amber"}>
          <p className={`hud-label ${totalsStyles.totalLabel}`}>Balance</p>
          <p className={totalsStyles.totalValue}>{totals.balance.toFixed(2)} €</p>
        </Panel>
      </div>

      <Panel accent="cyan">
        <DataTable<FinancialEntryDTO>
          rows={entries}
          getRowKey={(entry) => entry.id}
          emptyMessage="Todavía no hay movimientos."
          columns={[
            {
              header: "Tipo",
              cell: (entry) => (
                <StatusBadge
                  label={entry.type === "ingreso" ? "Ingreso" : "Gasto"}
                  tone={entry.type === "ingreso" ? "green" : "red"}
                />
              ),
            },
            { header: "Importe", cell: (entry) => `${entry.amount.toFixed(2)} €` },
            { header: "Categoría", cell: (entry) => entry.category ?? "—" },
            { header: "Descripción", cell: (entry) => entry.description },
            { header: "Fecha", cell: (entry) => entry.entryDate },
            {
              header: "Lead",
              cell: (entry) =>
                entry.leadId ? (
                  <Link href={`/admin/leads/${entry.leadId}`} className={styles.actionLink}>
                    Ver lead
                  </Link>
                ) : (
                  "—"
                ),
            },
            {
              header: "Acciones",
              cell: (entry) => (
                <div className={styles.actions}>
                  <Link href={`/admin/finanzas/${entry.id}/editar`} className={styles.actionLink}>
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteFinancialEntry(entry.id);
                    }}
                  >
                    <button type="submit" className={styles.deleteButton}>
                      Eliminar
                    </button>
                  </form>
                </div>
              ),
            },
          ]}
        />
      </Panel>
    </div>
  );
}
