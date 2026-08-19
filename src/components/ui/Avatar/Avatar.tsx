import styles from "./Avatar.module.css";

export interface AvatarProps {
  initials: string;
  online?: boolean;
}

export function Avatar({ initials, online }: AvatarProps) {
  return (
    <span className={styles.avatar} aria-hidden="true">
      {initials}
      {online ? <span className={styles.status} /> : null}
    </span>
  );
}
