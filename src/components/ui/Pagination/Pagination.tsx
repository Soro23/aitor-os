import styles from "./Pagination.module.css";

export interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <nav aria-label="Paginación" className={`hud-label ${styles.pager}`}>
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Página anterior" className={styles.arrow}>
        ‹
      </button>
      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onChange(pageNumber)}
          aria-current={pageNumber === page ? "page" : undefined}
          className={`${styles.pg} ${pageNumber === page ? styles.active : ""}`}
        >
          {pageNumber}
        </button>
      ))}
      <button type="button" disabled={page === pageCount} onClick={() => onChange(page + 1)} aria-label="Página siguiente" className={styles.arrow}>
        ›
      </button>
    </nav>
  );
}
