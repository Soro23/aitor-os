"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal/Modal";
import type { ProjectScreenshotDTO } from "@/types/dto/project-screenshot.dto";
import styles from "./ProjectGallery.module.css";

export interface ProjectGalleryProps {
  projectName: string;
  screenshots: ProjectScreenshotDTO[];
}

export function ProjectGallery({ projectName, screenshots }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const hasMultiple = screenshots.length > 1;

  function goPrev() {
    setActiveIndex((index) => (index - 1 + screenshots.length) % screenshots.length);
  }

  function goNext() {
    setActiveIndex((index) => (index + 1) % screenshots.length);
  }

  useEffect(() => {
    if (!lightboxOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index + 1) % screenshots.length);
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((index) => (index - 1 + screenshots.length) % screenshots.length);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, screenshots.length]);

  if (screenshots.length === 0) return null;

  const active = screenshots[activeIndex];

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        {hasMultiple ? (
          <button type="button" className={`${styles.navButton} ${styles.prev}`} onClick={goPrev} aria-label="Captura anterior">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
        ) : null}

        <button
          type="button"
          className={styles.mainImageButton}
          onClick={() => setLightboxOpen(true)}
          aria-label={`Ampliar captura ${activeIndex + 1} de ${screenshots.length}`}
        >
          <Image
            src={active.imageUrl}
            alt={active.altText || `${projectName} — captura ${activeIndex + 1}`}
            fill
            sizes="(min-width: 1024px) 900px, 92vw"
            style={{ objectFit: "contain" }}
          />
        </button>

        {hasMultiple ? (
          <button type="button" className={`${styles.navButton} ${styles.next}`} onClick={goNext} aria-label="Captura siguiente">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        ) : null}

        <span className={styles.counter}>
          {activeIndex + 1} / {screenshots.length}
        </span>
      </div>

      {hasMultiple ? (
        <div className={styles.filmstrip}>
          {screenshots.map((shot, index) => (
            <button
              key={shot.id}
              type="button"
              className={`${styles.filmThumb} ${index === activeIndex ? styles.filmThumbActive : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Ir a la captura ${index + 1}`}
              aria-current={index === activeIndex}
            >
              <Image src={shot.imageUrl} alt="" fill sizes="140px" style={{ objectFit: "cover" }} />
            </button>
          ))}
        </div>
      ) : null}

      <p className={`hud-label ${styles.hint}`}>Haz clic en la imagen para ampliarla</p>

      <Modal
        title={active.altText || `Captura ${activeIndex + 1} de ${screenshots.length}`}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        size="lg"
      >
        <div className={styles.viewer}>
          <div className={styles.fullImageWrap}>
            <Image
              src={active.imageUrl}
              alt={active.altText || `${projectName} — captura ${activeIndex + 1}`}
              fill
              sizes="(min-width: 640px) 1100px, 92vw"
              style={{ objectFit: "contain" }}
            />
          </div>
          {hasMultiple ? (
            <div className={styles.modalNav}>
              <button type="button" className={styles.modalNavButton} onClick={goPrev} aria-label="Captura anterior">
                ← Anterior
              </button>
              <span className={styles.counter}>
                {activeIndex + 1} / {screenshots.length}
              </span>
              <button type="button" className={styles.modalNavButton} onClick={goNext} aria-label="Captura siguiente">
                Siguiente →
              </button>
            </div>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
