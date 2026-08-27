"use client";

import { useState, useTransition, type DragEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublishToggle } from "@/components/admin/PublishToggle/PublishToggle";
import { FeaturedToggle } from "@/components/admin/FeaturedToggle/FeaturedToggle";
import {
  deleteProject,
  reorderProjects,
  setProjectFeatured,
  setProjectPublished,
} from "@/server/actions/projects.actions";
import type { ProjectDTO } from "@/types/dto/project.dto";
import listStyles from "@/styles/admin-list.module.css";
import styles from "./ProjectsSortableTable.module.css";

export interface ProjectsSortableTableProps {
  projects: ProjectDTO[];
}

export function ProjectsSortableTable({ projects }: ProjectsSortableTableProps) {
  const [rows, setRows] = useState(projects);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function persistOrder(nextRows: ProjectDTO[]) {
    setRows(nextRows);
    startTransition(async () => {
      await reorderProjects(nextRows.map((row, index) => ({ id: row.id, sortOrder: index })));
      router.refresh();
    });
  }

  function moveRow(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= rows.length || fromIndex === toIndex) return;
    const next = [...rows];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setAnnouncement(`${moved.name} ahora en posición ${toIndex + 1} de ${next.length}.`);
    persistOrder(next);
  }

  function handleDragStart(event: DragEvent<HTMLTableRowElement>, id: string) {
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
    setDraggingId(id);
  }

  function handleDragOver(event: DragEvent<HTMLTableRowElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function handleDrop(event: DragEvent<HTMLTableRowElement>, targetIndex: number) {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData("text/plain");
    const fromIndex = rows.findIndex((row) => row.id === draggedId);
    setDraggingId(null);
    if (fromIndex === -1) return;
    moveRow(fromIndex, targetIndex);
  }

  if (rows.length === 0) {
    return <p className={styles.empty}>Todavía no hay proyectos.</p>;
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.srOnly} role="status" aria-live="polite">
        {announcement}
      </p>
      <table className={styles.table} aria-busy={isPending}>
        <thead>
          <tr>
            <th className={`hud-label ${styles.th}`}>Orden</th>
            <th className={`hud-label ${styles.th}`}>Nombre</th>
            <th className={`hud-label ${styles.th}`}>Estado</th>
            <th className={`hud-label ${styles.th}`}>Publicado</th>
            <th className={`hud-label ${styles.th}`}>Destacado</th>
            <th className={`hud-label ${styles.th}`}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((project, index) => (
            <tr
              key={project.id}
              className={`${styles.row} ${draggingId === project.id ? styles.dragging : ""}`}
              draggable={!isPending}
              onDragStart={(event) => handleDragStart(event, project.id)}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, index)}
              onDragEnd={() => setDraggingId(null)}
            >
              <td className={styles.td}>
                <div className={styles.orderCell}>
                  <span className={styles.dragHandle} aria-hidden="true">
                    ⠿
                  </span>
                  <div className={styles.reorderButtons}>
                    <button
                      type="button"
                      className={styles.reorderButton}
                      disabled={isPending || index === 0}
                      aria-label={`Subir ${project.name}`}
                      onClick={() => moveRow(index, index - 1)}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className={styles.reorderButton}
                      disabled={isPending || index === rows.length - 1}
                      aria-label={`Bajar ${project.name}`}
                      onClick={() => moveRow(index, index + 1)}
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </td>
              <td className={styles.td}>{project.name}</td>
              <td className={styles.td}>{project.status}</td>
              <td className={styles.td}>
                <PublishToggle
                  isPublished={project.isPublished}
                  onToggle={setProjectPublished.bind(null, project.id)}
                />
              </td>
              <td className={styles.td}>
                <FeaturedToggle
                  isFeatured={project.isFeatured}
                  onToggle={setProjectFeatured.bind(null, project.id)}
                />
              </td>
              <td className={styles.td}>
                <div className={listStyles.actions}>
                  <Link href={`/admin/proyectos/${project.id}/editar`} className={listStyles.actionLink}>
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      await deleteProject(project.id);
                      router.refresh();
                    }}
                  >
                    <button type="submit" className={listStyles.deleteButton}>
                      Eliminar
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
