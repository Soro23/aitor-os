"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createGardenNote, updateGardenNote } from "@/server/actions/garden-notes.actions";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor/MarkdownEditor";
import {
  GARDEN_NOTE_CATEGORY_VALUES,
  GARDEN_NOTE_STATUS_VALUES,
} from "@/lib/validation/garden-note.schema";
import type { GardenNoteDTO } from "@/types/dto/garden-note.dto";
import styles from "@/styles/admin-form.module.css";

interface FormState {
  error?: string;
}

function buildInput(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
    category: String(formData.get("category") ?? "ideas"),
    status: String(formData.get("status") ?? "seed"),
    content: String(formData.get("content") ?? ""),
    examples: String(formData.get("examples") ?? ""),
    commands: String(formData.get("commands") ?? ""),
    referencesText: String(formData.get("referencesText") ?? ""),
    isPublished: formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

export interface GardenNoteFormProps {
  note?: GardenNoteDTO;
}

export function GardenNoteForm({ note }: GardenNoteFormProps) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const input = buildInput(formData);

      try {
        if (note) {
          await updateGardenNote(note.id, input);
        } else {
          await createGardenNote(input);
        }
      } catch {
        return { error: "No se pudo guardar la nota. Revisa los campos." };
      }

      router.push("/admin/garden");
      return {};
    },
    {},
  );

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.row}>
        <label className={styles.field}>
          <span className="hud-label">Título</span>
          <input name="title" defaultValue={note?.title} required className={styles.input} />
        </label>
        <label className={styles.field}>
          <span className="hud-label">Slug</span>
          <input name="slug" defaultValue={note?.slug} required className={styles.input} />
        </label>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className="hud-label">Categoría</span>
          <select name="category" defaultValue={note?.category ?? "ideas"} className={styles.input}>
            {GARDEN_NOTE_CATEGORY_VALUES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className="hud-label">Estado</span>
          <select name="status" defaultValue={note?.status ?? "seed"} className={styles.input}>
            {GARDEN_NOTE_STATUS_VALUES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className="hud-label">Orden</span>
          <input
            type="number"
            name="sortOrder"
            defaultValue={note?.sortOrder ?? 0}
            className={styles.input}
          />
        </label>
      </div>

      <MarkdownEditor label="Contenido" name="content" defaultValue={note?.content ?? ""} rows={12} />
      <MarkdownEditor label="Ejemplos" name="examples" defaultValue={note?.examples ?? ""} />
      <MarkdownEditor label="Comandos" name="commands" defaultValue={note?.commands ?? ""} />
      <MarkdownEditor
        label="Referencias"
        name="referencesText"
        defaultValue={note?.referencesText ?? ""}
      />

      <div className={styles.checkboxRow}>
        <label className={styles.checkboxField}>
          <input type="checkbox" name="isPublished" defaultChecked={note?.isPublished} />
          <span className="hud-label">Publicado</span>
        </label>
        <label className={styles.checkboxField}>
          <input type="checkbox" name="isFeatured" defaultChecked={note?.isFeatured} />
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
