import Link from "next/link";
import { DataTable } from "@/components/admin/DataTable/DataTable";
import { ToggleSwitch } from "@/components/admin/ToggleSwitch/ToggleSwitch";
import { Panel } from "@/components/ui/Panel/Panel";
import { nowItemsRepository } from "@/server/repositories/now-items.repository";
import { setNowItemActive, deleteNowItem } from "@/server/actions/now-items.actions";
import type { NowItemDTO } from "@/types/dto/now-item.dto";
import styles from "@/styles/admin-list.module.css";

export default async function AdminNowPage() {
  const items = await nowItemsRepository.findAll();

  return (
    <div className={styles.stack}>
      <div className={styles.header}>
        <h1 className={styles.title}>Now</h1>
        <Link href="/admin/now/nuevo" className={styles.newLink}>
          + Nuevo
        </Link>
      </div>
      <Panel accent="green">
        <DataTable<NowItemDTO>
          rows={items}
          getRowKey={(item) => item.id}
          emptyMessage="Todavía no hay elementos."
          columns={[
            { header: "Categoría", cell: (item) => item.category },
            { header: "Título", cell: (item) => item.title },
            {
              header: "Estado",
              cell: (item) => (
                <ToggleSwitch
                  value={item.isActive}
                  onLabel="Activo"
                  offLabel="Inactivo"
                  tone="green"
                  onToggle={setNowItemActive.bind(null, item.id)}
                />
              ),
            },
            {
              header: "Acciones",
              cell: (item) => (
                <div className={styles.actions}>
                  <Link href={`/admin/now/${item.id}/editar`} className={styles.actionLink}>
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteNowItem(item.id);
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
