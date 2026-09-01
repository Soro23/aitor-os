import { ClipCard } from "@/components/ui/ClipCard/ClipCard";
import { resourcesRepository } from "@/server/repositories/resources.repository";
import { SectionIntro } from "../_components/SectionIntro";
import { EmptyNotice } from "../_components/EmptyNotice";
import styles from "./page.module.css";

const INTRO_DESCRIPTION =
  "Mi biblioteca personal de referencias: herramientas, librerías, extensiones, documentación, cursos y repositorios que uso de verdad o a los que vuelvo a menudo. Cada tarjeta abre directamente el recurso original en una pestaña nueva.";

export default async function RecursosPage() {
  const resources = await resourcesRepository.findPublished();

  const intro = (
    <SectionIntro
      eyebrow="Recursos"
      title="Recursos"
      description={INTRO_DESCRIPTION}
      accent="violet"
      meta={resources.length > 0 ? `${resources.length} recursos` : undefined}
    />
  );

  if (resources.length === 0) {
    return (
      <>
        {intro}
        <EmptyNotice message="Todavía no hay recursos publicados." accent="violet" />
      </>
    );
  }

  return (
    <>
      {intro}
      <div className={styles.grid}>
        {resources.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className={styles.cardLink}
          >
            <ClipCard eyebrow={resource.type} title={resource.name} accent="violet">
              {resource.description ? <p className={styles.description}>{resource.description}</p> : null}
            </ClipCard>
          </a>
        ))}
      </div>
    </>
  );
}
