import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/Panel/Panel";
import { uiStylesRepository } from "@/server/repositories/ui-styles.repository";
import { uiStyleImagesRepository } from "@/server/repositories/ui-style-images.repository";
import { uiStyleLinksRepository } from "@/server/repositories/ui-style-links.repository";
import { UiStyleForm } from "../../UiStyleForm";
import { UiStyleImages } from "../../UiStyleImages";
import { UiStyleLinks } from "../../UiStyleLinks";

export default async function EditUiStylePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const style = await uiStylesRepository.findById(id);

  if (!style) {
    notFound();
  }

  const [images, links] = await Promise.all([
    uiStyleImagesRepository.findByUiStyleId(style.id),
    uiStyleLinksRepository.findByUiStyleId(style.id),
  ]);

  return (
    <Panel accent="violet">
      <p className="hud-label">Estilos UI · Editar</p>
      <UiStyleForm style={style} />
      <UiStyleImages uiStyleId={style.id} images={images} />
      <UiStyleLinks uiStyleId={style.id} links={links} />
    </Panel>
  );
}
