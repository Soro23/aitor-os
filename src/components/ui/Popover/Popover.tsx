"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Popover.module.css";

export interface PopoverProps {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
}

export function Popover({ trigger, title, children }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className={styles.triggerButton}>
        {trigger}
      </button>
      {open ? (
        <div role="dialog" className={styles.pop}>
          <p className={styles.title}>{title}</p>
          <div className={styles.body}>{children}</div>
        </div>
      ) : null}
    </div>
  );
}
