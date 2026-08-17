import Link from "next/link";
import { DataTable } from "@/components/admin/DataTable/DataTable";
import { PublishToggle } from "@/components/admin/PublishToggle/PublishToggle";
import { FeaturedToggle } from "@/components/admin/FeaturedToggle/FeaturedToggle";
import { Panel } from "@/components/ui/Panel/Panel";
import { projectsRepository } from "@/server/repositories/projects.repository";
import {
  setProjectPublished,
  setProjectFeatured,
  deleteProject,
} from "@/server/actions/projects.actions";
import type { ProjectDTO } from "@/types/dto/project.dto";
import styles from "./page.module.css";

export default async function AdminProjectsPage() {
  const projects = await projectsRepository.findAll();

  return (
    <div className={styles.stack}>
      <div className={styles.header}>
        <h1 className={styles.title}>Proyectos</h1>
        <Link href="/admin/proyectos/nuevo" className={styles.newLink}>
          + Nuevo proyecto
        </Link>
      </div>
      <Panel accent="cyan">
        <DataTable<ProjectDTO>
          rows={projects}
          getRowKey={(project) => project.id}
          emptyMessage="Todavía no hay proyectos."
          columns={[
            { header: "Nombre", cell: (project) => project.name },
            { header: "Estado", cell: (project) => project.status },
            {
              header: "Publicado",
              cell: (project) => (
                <PublishToggle
                  isPublished={project.isPublished}
                  onToggle={setProjectPublished.bind(null, project.id)}
                />
              ),
            },
            {
              header: "Destacado",
              cell: (project) => (
                <FeaturedToggle
                  isFeatured={project.isFeatured}
                  onToggle={setProjectFeatured.bind(null, project.id)}
                />
              ),
            },
            {
              header: "Acciones",
              cell: (project) => (
                <div className={styles.actions}>
                  <Link href={`/admin/proyectos/${project.id}/editar`} className={styles.actionLink}>
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteProject(project.id);
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
