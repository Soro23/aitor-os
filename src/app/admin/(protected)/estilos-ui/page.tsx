import Link from "next/link";
import { DataTable } from "@/components/admin/DataTable/DataTable";
import { PublishToggle } from "@/components/admin/PublishToggle/PublishToggle";
import { FeaturedToggle } from "@/components/admin/FeaturedToggle/FeaturedToggle";
import { Panel } from "@/components/ui/Panel/Panel";
import { uiStylesRepository } from "@/server/repositories/ui-styles.repository";
import {
  setUiStylePublished,
  setUiStyleFeatured,
  deleteUiStyle,
} from "@/server/actions/ui-styles.actions";
import { uiStyleCategoryLabel } from "@/lib/ui-style-labels";
import type { UiStyleDTO } from "@/types/dto/ui-style.dto";
import styles from "@/styles/admin-list.module.css";

export default async function AdminUiStylesPage() {
  const uiStyles = await uiStylesRepository.findAll();

  return (
    <div className={styles.stack}>
      <div className={styles.header}>
        <h1 className={styles.title}>Estilos UI</h1>
        <Link href="/admin/estilos-ui/nuevo" className={styles.newLink}>
          + Nuevo estilo
        </Link>
      </div>
      <Panel accent="violet">
        <DataTable<UiStyleDTO>
          rows={uiStyles}
          getRowKey={(style) => style.id}
          emptyMessage="Todavía no hay estilos."
          columns={[
            { header: "Nombre", cell: (style) => style.name },
            { header: "Categoría", cell: (style) => uiStyleCategoryLabel(style.category) },
            { header: "Orden", cell: (style) => style.sortOrder },
            {
              header: "Publicado",
              cell: (style) => (
                <PublishToggle
                  isPublished={style.isPublished}
                  onToggle={setUiStylePublished.bind(null, style.id)}
                />
              ),
            },
            {
              header: "Destacado",
              cell: (style) => (
                <FeaturedToggle
                  isFeatured={style.isFeatured}
                  onToggle={setUiStyleFeatured.bind(null, style.id)}
                />
              ),
            },
            {
              header: "Acciones",
              cell: (style) => (
                <div className={styles.actions}>
                  <Link href={`/admin/estilos-ui/${style.id}/editar`} className={styles.actionLink}>
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteUiStyle(style.id);
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
