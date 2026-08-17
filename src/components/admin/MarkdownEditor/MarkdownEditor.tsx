import type { TextareaHTMLAttributes } from "react";
import styles from "./MarkdownEditor.module.css";

export interface MarkdownEditorProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  label: string;
}

export function MarkdownEditor({ label, id, ...rest }: MarkdownEditorProps) {
  const textareaId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={styles.field}>
      <label htmlFor={textareaId} className="hud-label">
        {label}
      </label>
      <textarea id={textareaId} className={styles.textarea} rows={8} {...rest} />
    </div>
  );
}
