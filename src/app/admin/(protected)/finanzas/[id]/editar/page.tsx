import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/Panel/Panel";
import { financialEntriesRepository } from "@/server/repositories/financial-entries.repository";
import { contactMessagesRepository } from "@/server/repositories/contact-messages.repository";
import { FinancialEntryForm } from "../../FinancialEntryForm";

export default async function EditFinancialEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [entry, leads] = await Promise.all([
    financialEntriesRepository.findById(id),
    contactMessagesRepository.findAll(),
  ]);

  if (!entry) {
    notFound();
  }

  return (
    <Panel accent="cyan">
      <p className="hud-label">Finanzas · Editar</p>
      <FinancialEntryForm entry={entry} leads={leads} />
    </Panel>
  );
}
