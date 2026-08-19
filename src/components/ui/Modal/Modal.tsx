"use client";

import { useEffect, type ReactNode } from "react";
import styles from "./Modal.module.css";

export interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
      >
        <span className={styles.sideBar} aria-hidden="true" />
        <h2 id="modal-title" className={styles.title}>
          {title}
        </h2>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
