import Link from "next/link";
import { Panel } from "@/components/ui/Panel/Panel";
import { projectsRepository } from "@/server/repositories/projects.repository";
import { ProjectsSortableTable } from "./ProjectsSortableTable";
import styles from "@/styles/admin-list.module.css";

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
        <ProjectsSortableTable projects={projects} />
      </Panel>
    </div>
  );
}
