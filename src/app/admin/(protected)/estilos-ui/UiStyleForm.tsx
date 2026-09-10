"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { createUiStyle, updateUiStyle } from "@/server/actions/ui-styles.actions";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor/MarkdownEditor";
import { FileUploader } from "@/components/ui/FileUploader/FileUploader";
import { UI_STYLE_CATEGORY_VALUES } from "@/lib/validation/ui-style.schema";
import { uiStyleCategoryLabel } from "@/lib/ui-style-labels";
import type { UiStyleDTO } from "@/types/dto/ui-style.dto";
import styles from "@/styles/admin-form.module.css";
import formStyles from "./UiStyleForm.module.css";

interface FormState {
  error?: string;
}

function buildInput(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? ""),
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? "minimalistas"),
    summary: String(formData.get("summary") ?? ""),
    description: String(formData.get("description") ?? ""),
    characteristics: String(formData.get("characteristics") ?? ""),
    useCases: String(formData.get("useCases") ?? ""),
    isPublished: formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

export interface UiStyleFormProps {
  style?: UiStyleDTO;
}

export function UiStyleForm({ style }: UiStyleFormProps) {
  const router = useRouter();
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(style?.coverImageUrl ?? null);

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const input = { ...buildInput(formData), coverImageFile };

      try {
        if (style) {
          await updateUiStyle(style.id, input);
        } else {
          await createUiStyle(input);
        }
      } catch (err) {
        const detail = err instanceof Error ? err.message : undefined;
        return {
          error: detail
            ? `No se pudo guardar el estilo: ${detail}`
            : "No se pudo guardar el estilo. Revisa los campos.",
        };
      }

      router.push("/admin/estilos-ui");
      return {};
    },
    {},
  );

  function handleCoverSelected(files: FileList) {
    const file = files[0];
    if (!file) return;
    setCoverImageFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.row}>
        <label className={styles.field}>
          <span className="hud-label">Nombre</span>
          <input name="name" defaultValue={style?.name} required className={styles.input} />
        </label>
        <label className={styles.field}>
          <span className="hud-label">Slug</span>
          <input name="slug" defaultValue={style?.slug} required className={styles.input} />
        </label>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className="hud-label">Categoría</span>
          <select
            name="category"
            defaultValue={style?.category ?? "minimalistas"}
            className={styles.input}
          >
            {UI_STYLE_CATEGORY_VALUES.map((category) => (
              <option key={category} value={category}>
                {uiStyleCategoryLabel(category)}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className="hud-label">Orden</span>
          <input
            type="number"
            name="sortOrder"
            defaultValue={style?.sortOrder ?? 0}
            className={styles.input}
          />
        </label>
      </div>

      <div className={formStyles.coverField}>
        <span className="hud-label">Imagen principal</span>
        {coverPreview ? (
          // eslint-disable-next-line @next/next/no-img-element -- URLs de Storage o previews locales sin loader de next/image configurado todavia
          <img src={coverPreview} alt="" className={formStyles.coverPreview} />
        ) : null}
        <FileUploader
          label="Arrastra una imagen o haz clic para seleccionarla"
          hint="PNG, JPG o WebP"
          onFilesSelected={handleCoverSelected}
        />
      </div>

      <label className={styles.field}>
        <span className="hud-label">Resumen (una línea)</span>
        <input name="summary" defaultValue={style?.summary ?? ""} className={styles.input} />
      </label>

      <MarkdownEditor
        label="Descripción"
        name="description"
        defaultValue={style?.description ?? ""}
        rows={12}
      />
      <MarkdownEditor
        label="Características visuales"
        name="characteristics"
        defaultValue={style?.characteristics ?? ""}
      />
      <MarkdownEditor
        label="Cuándo usarlo"
        name="useCases"
        defaultValue={style?.useCases ?? ""}
      />

      <div className={styles.checkboxRow}>
        <label className={styles.checkboxField}>
          <input type="checkbox" name="isPublished" defaultChecked={style?.isPublished} />
          <span className="hud-label">Publicado</span>
        </label>
        <label className={styles.checkboxField}>
          <input type="checkbox" name="isFeatured" defaultChecked={style?.isFeatured} />
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
