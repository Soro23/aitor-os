import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/Panel/Panel";
import { nowItemsRepository } from "@/server/repositories/now-items.repository";
import { NowItemForm } from "../../NowItemForm";

export default async function EditNowItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await nowItemsRepository.findById(id);

  if (!item) {
    notFound();
  }

  return (
    <Panel accent="green">
      <p className="hud-label">Now · Editar</p>
      <NowItemForm item={item} />
    </Panel>
  );
}
