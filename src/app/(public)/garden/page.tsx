import Link from "next/link";
import { ClipCard } from "@/components/ui/ClipCard/ClipCard";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { gardenNotesRepository } from "@/server/repositories/garden-notes.repository";
import { GARDEN_NOTE_CATEGORY_VALUES } from "@/lib/validation/garden-note.schema";
import { gardenNoteCategoryLabel, gardenNoteStatusLabel } from "@/lib/garden-note-labels";
import { SectionIntro } from "../_components/SectionIntro";
import { EmptyNotice } from "../_components/EmptyNotice";
import styles from "./page.module.css";

const INTRO_DESCRIPTION =
  "Mi base de conocimiento pública: notas, apuntes, documentación y soluciones a problemas reales que escribo mientras aprendo. A diferencia de un blog, no son artículos cerrados — cada nota crece con el tiempo y lleva su estado (semilla, creciendo o evergreen) y su categoría.";

export default async function GardenPage() {
  const notes = await gardenNotesRepository.findPublished();

  const intro = (
    <SectionIntro
      eyebrow="Digital Garden"
      title="Garden"
      description={INTRO_DESCRIPTION}
      accent="violet"
      meta={notes.length > 0 ? `${notes.length} notas` : undefined}
    />
  );

  if (notes.length === 0) {
    return (
      <>
        {intro}
        <EmptyNotice message="Todavía no hay notas publicadas." accent="violet" />
      </>
    );
  }

  return (
    <>
      {intro}
      <div className={styles.stack}>
        {GARDEN_NOTE_CATEGORY_VALUES.map((category) => {
          const notesInCategory = notes.filter((note) => note.category === category);
          if (notesInCategory.length === 0) return null;

          return (
            <section key={category} className={styles.section}>
              <h2 className={styles.categoryTitle}>{gardenNoteCategoryLabel(category)}</h2>
              <div className={styles.grid}>
                {notesInCategory.map((note) => (
                  <Link key={note.id} href={`/garden/${note.slug}`} className={styles.cardLink}>
                    <ClipCard
                      eyebrow={gardenNoteCategoryLabel(note.category)}
                      title={note.title}
                      accent="violet"
                    >
                      <StatusBadge label={gardenNoteStatusLabel(note.status)} tone="violet" />
                    </ClipCard>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
