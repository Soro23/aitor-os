"use client";

import { useState, type ReactNode } from "react";
import styles from "./Accordion.module.css";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className={styles.accordion}>
      {items.map((item) => {
        const isOpen = item.id === openId;
        return (
          <div key={item.id} className={styles.item}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className={`${styles.head} ${isOpen ? styles.open : ""}`}
            >
              {item.title}
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.chevron} aria-hidden="true">
                <path d="M2 4l4 4 4-4" />
              </svg>
            </button>
            {isOpen ? <div className={styles.body}>{item.content}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
