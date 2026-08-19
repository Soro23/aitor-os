"use client";

import { useId, useState, type DragEvent } from "react";
import styles from "./FileUploader.module.css";

export interface FileUploaderProps {
  label: string;
  hint?: string;
  onFilesSelected: (files: FileList) => void;
}

export function FileUploader({ label, hint, onFilesSelected }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputId = useId();

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length > 0) onFilesSelected(event.dataTransfer.files);
  }

  return (
    <label
      htmlFor={inputId}
      className={`${styles.drop} ${isDragging ? styles.hover : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M14 20V8M9 13l5-5 5 5" />
        <path d="M5 20v3a1 1 0 001 1h16a1 1 0 001-1v-3" />
      </svg>
      <span className={styles.text}>{label}</span>
      {hint ? <span className={styles.hint}>{hint}</span> : null}
      <input
        id={inputId}
        type="file"
        className={styles.input}
        onChange={(event) => {
          if (event.target.files) onFilesSelected(event.target.files);
        }}
      />
    </label>
  );
}
