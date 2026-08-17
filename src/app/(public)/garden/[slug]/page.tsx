import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/Panel/Panel";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { gardenNotesRepository } from "@/server/repositories/garden-notes.repository";
import { gardenNoteRelationsRepository } from "@/server/repositories/garden-note-relations.repository";
import { toGardenNotePublicView } from "@/types/dto/garden-note.dto";
import { gardenNoteCategoryLabel, gardenNoteStatusLabel } from "@/lib/garden-note-labels";
import styles from "./page.module.css";

export default async function GardenNoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await gardenNotesRepository.findBySlug(slug);

  if (!note || !note.isPublished) {
    notFound();
  }

  const relatedNotes = await gardenNoteRelationsRepository.findRelatedTo(note.id);
  const view = toGardenNotePublicView(note, relatedNotes);

  return (
    <div className={styles.stack}>
      <Panel accent="violet">
        <p className="hud-label">{gardenNoteCategoryLabel(view.category)}</p>
        <h1 className={styles.title}>{view.title}</h1>
        <StatusBadge label={gardenNoteStatusLabel(view.status)} tone="violet" />
      </Panel>

      {view.content ? (
        <Panel>
          <p className="hud-label">Contenido</p>
          <p className={styles.text}>{view.content}</p>
        </Panel>
      ) : null}

      {view.examples ? (
        <Panel>
          <p className="hud-label">Ejemplos</p>
          <p className={styles.text}>{view.examples}</p>
        </Panel>
      ) : null}

      {view.commands ? (
        <Panel>
          <p className="hud-label">Comandos</p>
          <p className={styles.code}>{view.commands}</p>
        </Panel>
      ) : null}

      {view.referencesText ? (
        <Panel>
          <p className="hud-label">Referencias</p>
          <p className={styles.text}>{view.referencesText}</p>
        </Panel>
      ) : null}

      {view.relatedNotes.length > 0 ? (
        <Panel accent="violet">
          <p className="hud-label">Notas relacionadas</p>
          <ul className={styles.relatedList}>
            {view.relatedNotes.map((related) => (
              <li key={related.id}>
                <Link href={`/garden/${related.slug}`} className={styles.relatedLink}>
                  {related.title}
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
    </div>
  );
}
