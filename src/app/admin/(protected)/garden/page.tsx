import Link from "next/link";
import { DataTable } from "@/components/admin/DataTable/DataTable";
import { PublishToggle } from "@/components/admin/PublishToggle/PublishToggle";
import { FeaturedToggle } from "@/components/admin/FeaturedToggle/FeaturedToggle";
import { Panel } from "@/components/ui/Panel/Panel";
import { gardenNotesRepository } from "@/server/repositories/garden-notes.repository";
import {
  setGardenNotePublished,
  setGardenNoteFeatured,
  deleteGardenNote,
} from "@/server/actions/garden-notes.actions";
import type { GardenNoteDTO } from "@/types/dto/garden-note.dto";
import styles from "@/styles/admin-list.module.css";

export default async function AdminGardenPage() {
  const notes = await gardenNotesRepository.findAll();

  return (
    <div className={styles.stack}>
      <div className={styles.header}>
        <h1 className={styles.title}>Garden</h1>
        <Link href="/admin/garden/nuevo" className={styles.newLink}>
          + Nueva nota
        </Link>
      </div>
      <Panel accent="violet">
        <DataTable<GardenNoteDTO>
          rows={notes}
          getRowKey={(note) => note.id}
          emptyMessage="Todavía no hay notas."
          columns={[
            { header: "Título", cell: (note) => note.title },
            { header: "Categoría", cell: (note) => note.category },
            { header: "Estado", cell: (note) => note.status },
            {
              header: "Publicado",
              cell: (note) => (
                <PublishToggle
                  isPublished={note.isPublished}
                  onToggle={setGardenNotePublished.bind(null, note.id)}
                />
              ),
            },
            {
              header: "Destacado",
              cell: (note) => (
                <FeaturedToggle
                  isFeatured={note.isFeatured}
                  onToggle={setGardenNoteFeatured.bind(null, note.id)}
                />
              ),
            },
            {
              header: "Acciones",
              cell: (note) => (
                <div className={styles.actions}>
                  <Link href={`/admin/garden/${note.id}/editar`} className={styles.actionLink}>
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteGardenNote(note.id);
                    }}
                  >
                    <button type="submit" className={styles.deleteButton}>
                      Eliminar
                    </button>
                  </form>
                </div>
              ),
            },
          ]}
        />
      </Panel>
    </div>
  );
}
