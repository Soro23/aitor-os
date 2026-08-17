import Link from "next/link";
import { DataTable } from "@/components/admin/DataTable/DataTable";
import { ToggleSwitch } from "@/components/admin/ToggleSwitch/ToggleSwitch";
import { Panel } from "@/components/ui/Panel/Panel";
import { stackItemsRepository } from "@/server/repositories/stack-items.repository";
import { setStackItemVisible, deleteStackItem } from "@/server/actions/stack-items.actions";
import type { StackItemDTO } from "@/types/dto/stack-item.dto";
import styles from "@/styles/admin-list.module.css";

export default async function AdminStackPage() {
  const items = await stackItemsRepository.findAll();

  return (
    <div className={styles.stack}>
      <div className={styles.header}>
        <h1 className={styles.title}>Stack</h1>
        <Link href="/admin/stack/nuevo" className={styles.newLink}>
          + Nuevo
        </Link>
      </div>
      <Panel accent="cyan">
        <DataTable<StackItemDTO>
          rows={items}
          getRowKey={(item) => item.id}
          emptyMessage="Todavía no hay tecnologías."
          columns={[
            { header: "Nombre", cell: (item) => item.name },
            { header: "Categoría", cell: (item) => item.category },
            { header: "Nivel", cell: (item) => item.usageLevel },
            {
              header: "Estado",
              cell: (item) => (
                <ToggleSwitch
                  value={item.isVisible}
                  onLabel="Visible"
                  offLabel="Oculto"
                  tone="cyan"
                  onToggle={setStackItemVisible.bind(null, item.id)}
                />
              ),
            },
            {
              header: "Acciones",
              cell: (item) => (
                <div className={styles.actions}>
                  <Link href={`/admin/stack/${item.id}/editar`} className={styles.actionLink}>
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteStackItem(item.id);
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
