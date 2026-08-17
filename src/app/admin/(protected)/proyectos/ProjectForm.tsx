"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createProject, updateProject } from "@/server/actions/projects.actions";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor/MarkdownEditor";
import { PROJECT_STATUS_VALUES } from "@/lib/validation/project.schema";
import type { ProjectDTO } from "@/types/dto/project.dto";
import styles from "@/styles/admin-form.module.css";

interface FormState {
  error?: string;
}

function buildInput(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    problem: String(formData.get("problem") ?? ""),
    solution: String(formData.get("solution") ?? ""),
    technologies: String(formData.get("technologies") ?? "")
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean),
    architecture: String(formData.get("architecture") ?? ""),
    status: String(formData.get("status") ?? "idea"),
    progress: Number(formData.get("progress") ?? 0),
    githubUrl: String(formData.get("githubUrl") ?? ""),
    demoUrl: String(formData.get("demoUrl") ?? ""),
    learnings: String(formData.get("learnings") ?? ""),
    nextSteps: String(formData.get("nextSteps") ?? ""),
    isPublished: formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

export interface ProjectFormProps {
  project?: ProjectDTO;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const input = buildInput(formData);

      try {
        if (project) {
          await updateProject(project.id, input);
        } else {
          await createProject(input);
        }
      } catch {
        return { error: "No se pudo guardar el proyecto. Revisa los campos." };
      }

      router.push("/admin/proyectos");
      return {};
    },
    {},
  );

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.row}>
        <label className={styles.field}>
          <span className="hud-label">Nombre</span>
          <input name="name" defaultValue={project?.name} required className={styles.input} />
        </label>
        <label className={styles.field}>
          <span className="hud-label">Slug</span>
          <input name="slug" defaultValue={project?.slug} required className={styles.input} />
        </label>
      </div>

      <MarkdownEditor
        label="Descripción"
        name="description"
        defaultValue={project?.description ?? ""}
      />
      <MarkdownEditor label="Problema" name="problem" defaultValue={project?.problem ?? ""} />
      <MarkdownEditor label="Solución" name="solution" defaultValue={project?.solution ?? ""} />
      <MarkdownEditor
        label="Arquitectura"
        name="architecture"
        defaultValue={project?.architecture ?? ""}
      />

      <label className={styles.field}>
        <span className="hud-label">Tecnologías (separadas por coma)</span>
        <input
          name="technologies"
          defaultValue={project?.technologies.join(", ")}
          className={styles.input}
        />
      </label>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className="hud-label">Estado</span>
          <select name="status" defaultValue={project?.status ?? "idea"} className={styles.input}>
            {PROJECT_STATUS_VALUES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className="hud-label">Progreso (%)</span>
          <input
            type="number"
            name="progress"
            min={0}
            max={100}
            defaultValue={project?.progress ?? 0}
            className={styles.input}
          />
        </label>
        <label className={styles.field}>
          <span className="hud-label">Orden</span>
          <input
            type="number"
            name="sortOrder"
            defaultValue={project?.sortOrder ?? 0}
            className={styles.input}
          />
        </label>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className="hud-label">GitHub URL</span>
          <input name="githubUrl" defaultValue={project?.githubUrl ?? ""} className={styles.input} />
        </label>
        <label className={styles.field}>
          <span className="hud-label">Demo URL</span>
          <input name="demoUrl" defaultValue={project?.demoUrl ?? ""} className={styles.input} />
        </label>
      </div>

      <MarkdownEditor
        label="Aprendizajes"
        name="learnings"
        defaultValue={project?.learnings ?? ""}
      />
      <MarkdownEditor
        label="Próximos pasos"
        name="nextSteps"
        defaultValue={project?.nextSteps ?? ""}
      />

      <div className={styles.checkboxRow}>
        <label className={styles.checkboxField}>
          <input type="checkbox" name="isPublished" defaultChecked={project?.isPublished} />
          <span className="hud-label">Publicado</span>
        </label>
        <label className={styles.checkboxField}>
          <input type="checkbox" name="isFeatured" defaultChecked={project?.isFeatured} />
          <span className="hud-label">Destacado</span>
        </label>
      </div>

      {state.error ? (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={isPending} className={styles.submit}>
        {isPending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
