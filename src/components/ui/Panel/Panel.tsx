import type { ElementType, HTMLAttributes, ReactNode } from "react";
import styles from "./Panel.module.css";

export type PanelAccent = "cyan" | "violet" | "green" | "amber" | "red";

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  accent?: PanelAccent;
  as?: ElementType;
}

export function Panel({
  children,
  accent,
  as: Component = "div",
  className,
  ...rest
}: PanelProps) {
  const classNames = [styles.panel, accent ? styles[`accent-${accent}`] : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classNames} {...rest}>
      {children}
    </Component>
  );
}
