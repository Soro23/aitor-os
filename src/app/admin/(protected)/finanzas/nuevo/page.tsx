import { Panel } from "@/components/ui/Panel/Panel";
import { contactMessagesRepository } from "@/server/repositories/contact-messages.repository";
import { FinancialEntryForm } from "../FinancialEntryForm";

export default async function NewFinancialEntryPage() {
  const leads = await contactMessagesRepository.findAll();

  return (
    <Panel accent="cyan">
      <p className="hud-label">Finanzas · Nuevo</p>
      <FinancialEntryForm leads={leads} />
    </Panel>
  );
}
