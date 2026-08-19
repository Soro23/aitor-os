"use client";

import { useId, useState, type ReactNode } from "react";
import styles from "./Tooltip.module.css";

export interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();

  return (
    <span
      className={styles.wrap}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <span aria-describedby={tooltipId}>{children}</span>
      {visible ? (
        <span role="tooltip" id={tooltipId} className={styles.bubble}>
          {content}
        </span>
      ) : null}
    </span>
  );
}
