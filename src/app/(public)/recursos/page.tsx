import { ClipCard } from "@/components/ui/ClipCard/ClipCard";
import { resourcesRepository } from "@/server/repositories/resources.repository";
import { PlaceholderSection } from "../_components/PlaceholderSection";
import styles from "./page.module.css";

export default async function RecursosPage() {
  const resources = await resourcesRepository.findPublished();

  if (resources.length === 0) {
    return (
      <PlaceholderSection
        eyebrow="Recursos"
        title="Recursos"
        description="Todavía no hay recursos publicados."
        accent="violet"
      />
    );
  }

  return (
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
  );
}
