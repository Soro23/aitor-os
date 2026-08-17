import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/Panel/Panel";
import { stackItemsRepository } from "@/server/repositories/stack-items.repository";
import { StackItemForm } from "../../StackItemForm";

export default async function EditStackItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await stackItemsRepository.findById(id);

  if (!item) {
    notFound();
  }

  return (
    <Panel accent="cyan">
      <p className="hud-label">Stack · Editar</p>
      <StackItemForm item={item} />
    </Panel>
  );
}
