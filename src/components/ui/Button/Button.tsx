import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export type ButtonProps = { variant?: ButtonVariant } & (
  | ({ as: "a" } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ as?: "button" } & ButtonHTMLAttributes<HTMLButtonElement>)
);

export function buttonClassName(variant: ButtonVariant = "primary", className?: string): string {
  return `hud-label ${[styles.button, styles[variant], className].filter(Boolean).join(" ")}`;
}

export function Button({ variant = "primary", className, as, ...rest }: ButtonProps) {
  const classNames = [styles.button, styles[variant], className].filter(Boolean).join(" ");

  if (as === "a") {
    return <a className={`hud-label ${classNames}`} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} />;
  }

  return (
    <button
      type="button"
      className={`hud-label ${classNames}`}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
}
