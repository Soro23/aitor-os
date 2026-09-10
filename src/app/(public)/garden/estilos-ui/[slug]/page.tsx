import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/Panel/Panel";
import { uiStylesRepository } from "@/server/repositories/ui-styles.repository";
import { uiStyleImagesRepository } from "@/server/repositories/ui-style-images.repository";
import { uiStyleLinksRepository } from "@/server/repositories/ui-style-links.repository";
import { toUiStylePublicView } from "@/types/dto/ui-style.dto";
import { uiStyleCategoryLabel } from "@/lib/ui-style-labels";
import styles from "./page.module.css";

export default async function UiStyleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const style = await uiStylesRepository.findBySlug(slug);

  if (!style || !style.isPublished) {
    notFound();
  }

  const [images, links] = await Promise.all([
    uiStyleImagesRepository.findByUiStyleId(style.id),
    uiStyleLinksRepository.findByUiStyleId(style.id),
  ]);
  const view = toUiStylePublicView(style, images, links);

  return (
    <div className={styles.stack}>
      <Panel accent="violet">
        <p className="hud-label">{uiStyleCategoryLabel(view.category)}</p>
        <h1 className={styles.title}>{view.name}</h1>
        {view.summary ? <p className={styles.summary}>{view.summary}</p> : null}
        {view.coverImageUrl ? (
          <div className={styles.coverWrap}>
            <Image
              src={view.coverImageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 900px, 92vw"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        ) : null}
      </Panel>

      {view.description ? (
        <Panel>
          <p className="hud-label">Descripción</p>
          <p className={styles.text}>{view.description}</p>
        </Panel>
      ) : null}

      {view.characteristics ? (
        <Panel>
          <p className="hud-label">Características visuales</p>
          <p className={styles.text}>{view.characteristics}</p>
        </Panel>
      ) : null}

      {view.useCases ? (
        <Panel>
          <p className="hud-label">Cuándo usarlo</p>
          <p className={styles.text}>{view.useCases}</p>
        </Panel>
      ) : null}

      {view.images.length > 0 ? (
        <Panel>
          <p className="hud-label">Ejemplos</p>
          <ul className={styles.gallery}>
            {view.images.map((image) => (
              <li key={image.id} className={styles.galleryItem}>
                <div className={styles.galleryImageWrap}>
                  <Image
                    src={image.imageUrl}
                    alt={image.altText ?? ""}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                {image.altText ? <p className={styles.caption}>{image.altText}</p> : null}
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      {view.links.length > 0 ? (
        <Panel accent="violet">
          <p className="hud-label">Referencias</p>
          <ul className={styles.linkList}>
            {view.links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={styles.link}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      <Link href="/garden/estilos-ui" className={styles.backLink}>
        ← Todos los estilos
      </Link>
    </div>
  );
}
