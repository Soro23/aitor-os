import Link from "next/link";
import { DataTable } from "@/components/admin/DataTable/DataTable";
import { PublishToggle } from "@/components/admin/PublishToggle/PublishToggle";
import { FeaturedToggle } from "@/components/admin/FeaturedToggle/FeaturedToggle";
import { Panel } from "@/components/ui/Panel/Panel";
import { resourcesRepository } from "@/server/repositories/resources.repository";
import {
  setResourcePublished,
  setResourceFeatured,
  deleteResource,
} from "@/server/actions/resources.actions";
import type { ResourceDTO } from "@/types/dto/resource.dto";
import styles from "@/styles/admin-list.module.css";

export default async function AdminResourcesPage() {
  const resources = await resourcesRepository.findAll();

  return (
    <div className={styles.stack}>
      <div className={styles.header}>
        <h1 className={styles.title}>Recursos</h1>
        <Link href="/admin/recursos/nuevo" className={styles.newLink}>
          + Nuevo recurso
        </Link>
      </div>
      <Panel accent="violet">
        <DataTable<ResourceDTO>
          rows={resources}
          getRowKey={(resource) => resource.id}
          emptyMessage="Todavía no hay recursos."
          columns={[
            { header: "Nombre", cell: (resource) => resource.name },
            { header: "Tipo", cell: (resource) => resource.type },
            {
              header: "Publicado",
              cell: (resource) => (
                <PublishToggle
                  isPublished={resource.isPublished}
                  onToggle={setResourcePublished.bind(null, resource.id)}
                />
              ),
            },
            {
              header: "Destacado",
              cell: (resource) => (
                <FeaturedToggle
                  isFeatured={resource.isFeatured}
                  onToggle={setResourceFeatured.bind(null, resource.id)}
                />
              ),
            },
            {
              header: "Acciones",
              cell: (resource) => (
                <div className={styles.actions}>
                  <Link href={`/admin/recursos/${resource.id}/editar`} className={styles.actionLink}>
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteResource(resource.id);
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
