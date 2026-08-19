import styles from "./SkeletonLoader.module.css";

export interface SkeletonLoaderProps {
  lines?: number;
}

export function SkeletonLoader({ lines = 3 }: SkeletonLoaderProps) {
  return (
    <div className={styles.card} role="status" aria-label="Cargando contenido">
      {Array.from({ length: lines }, (_, index) => (
        <span key={index} className={styles.bone} style={{ width: index === 0 ? "40%" : "100%" }} />
      ))}
    </div>
  );
}
