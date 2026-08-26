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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;
  const current = isOpen ? screenshots[openIndex] : null;

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        setOpenIndex((index) => (index === null ? index : (index + 1) % screenshots.length));
      } else if (event.key === "ArrowLeft") {
        setOpenIndex((index) =>
          index === null ? index : (index - 1 + screenshots.length) % screenshots.length,
        );
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, screenshots.length]);

  if (screenshots.length === 0) return null;

  return (
    <>
      <div className={styles.grid}>
        {screenshots.map((shot, index) => (
          <button
            key={shot.id}
            type="button"
            className={styles.thumbButton}
            onClick={() => setOpenIndex(index)}
            aria-label={`Ampliar captura ${index + 1} de ${screenshots.length}`}
          >
            <Image
              src={shot.imageUrl}
              alt={shot.altText || `${projectName} — captura ${index + 1}`}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className={styles.thumb}
              style={{ objectFit: "cover" }}
            />
          </button>
        ))}
      </div>

      <Modal
        title={current?.altText || `Captura ${(openIndex ?? 0) + 1} de ${screenshots.length}`}
        isOpen={isOpen}
        onClose={() => setOpenIndex(null)}
        size="lg"
      >
        {current ? (
          <div className={styles.viewer}>
            <div className={styles.fullImageWrap}>
              <Image
                src={current.imageUrl}
                alt={current.altText || `${projectName} — captura ${(openIndex ?? 0) + 1}`}
                fill
                sizes="(min-width: 640px) 1100px, 92vw"
                style={{ objectFit: "contain" }}
              />
            </div>
            {screenshots.length > 1 ? (
              <div className={styles.nav}>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() =>
                    setOpenIndex((index) =>
                      index === null ? index : (index - 1 + screenshots.length) % screenshots.length,
                    )
                  }
                  aria-label="Captura anterior"
                >
                  ← Anterior
                </button>
                <span className={styles.counter}>
                  {(openIndex ?? 0) + 1} / {screenshots.length}
                </span>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() =>
                    setOpenIndex((index) => (index === null ? index : (index + 1) % screenshots.length))
                  }
                  aria-label="Captura siguiente"
                >
                  Siguiente →
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </>
  );
}
