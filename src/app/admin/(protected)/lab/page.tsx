import Link from "next/link";
import { DataTable } from "@/components/admin/DataTable/DataTable";
import { PublishToggle } from "@/components/admin/PublishToggle/PublishToggle";
import { FeaturedToggle } from "@/components/admin/FeaturedToggle/FeaturedToggle";
import { Panel } from "@/components/ui/Panel/Panel";
import { labExperimentsRepository } from "@/server/repositories/lab-experiments.repository";
import {
  setLabExperimentPublished,
  setLabExperimentFeatured,
  deleteLabExperiment,
} from "@/server/actions/lab-experiments.actions";
import { formatLabNumber } from "@/lib/format-lab-number";
import type { LabExperimentDTO } from "@/types/dto/lab-experiment.dto";
import styles from "@/styles/admin-list.module.css";

export default async function AdminLabPage() {
  const experiments = await labExperimentsRepository.findAll();

  return (
    <div className={styles.stack}>
      <div className={styles.header}>
        <h1 className={styles.title}>Lab</h1>
        <Link href="/admin/lab/nuevo" className={styles.newLink}>
          + Nuevo experimento
        </Link>
      </div>
      <Panel accent="green">
        <DataTable<LabExperimentDTO>
          rows={experiments}
          getRowKey={(experiment) => experiment.id}
          emptyMessage="Todavía no hay experimentos."
          columns={[
            { header: "#", cell: (experiment) => formatLabNumber(experiment.labNumber) },
            { header: "Título", cell: (experiment) => experiment.title },
            { header: "Estado", cell: (experiment) => experiment.status },
            {
              header: "Publicado",
              cell: (experiment) => (
                <PublishToggle
                  isPublished={experiment.isPublished}
                  onToggle={setLabExperimentPublished.bind(null, experiment.id)}
                />
              ),
            },
            {
              header: "Destacado",
              cell: (experiment) => (
                <FeaturedToggle
                  isFeatured={experiment.isFeatured}
                  onToggle={setLabExperimentFeatured.bind(null, experiment.id)}
                />
              ),
            },
            {
              header: "Acciones",
              cell: (experiment) => (
                <div className={styles.actions}>
                  <Link href={`/admin/lab/${experiment.id}/editar`} className={styles.actionLink}>
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteLabExperiment(experiment.id);
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
