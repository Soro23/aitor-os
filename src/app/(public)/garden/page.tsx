import Link from "next/link";
import { ClipCard } from "@/components/ui/ClipCard/ClipCard";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { gardenNotesRepository } from "@/server/repositories/garden-notes.repository";
import { GARDEN_NOTE_CATEGORY_VALUES } from "@/lib/validation/garden-note.schema";
import { gardenNoteCategoryLabel, gardenNoteStatusLabel } from "@/lib/garden-note-labels";
import { PlaceholderSection } from "../_components/PlaceholderSection";
import styles from "./page.module.css";

export default async function GardenPage() {
  const notes = await gardenNotesRepository.findPublished();

  if (notes.length === 0) {
    return (
      <PlaceholderSection
        eyebrow="Digital Garden"
        title="Garden"
        description="Todavía no hay notas publicadas."
        accent="violet"
      />
    );
  }

  return (
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
  );
}
