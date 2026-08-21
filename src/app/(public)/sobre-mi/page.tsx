import Link from "next/link";
import { Tag } from "@/components/ui/Tag/Tag";
import { SOCIAL_LINKS } from "@/lib/social-links";
import styles from "./page.module.css";

const EVOLUTION = [
  { year: "2024", tone: "cyan" as const, label: "init:", description: "empiezo a profundizar en sistemas" },
  { year: "2025", tone: "violet" as const, label: "feat:", description: "Active Directory / Windows Server" },
  { year: "2026", tone: "cyan" as const, label: "feat:", description: "desarrollo + IA + automatización" },
];

function SystemsIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4" width="16" height="6" />
      <rect x="4" y="14" width="16" height="6" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
      <line x1="7" y1="17" x2="7.01" y2="17" />
    </svg>
  );
}

function DevelopmentIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="8 5 3 12 8 19" />
      <polyline points="16 5 21 12 16 19" />
    </svg>
  );
}

function AutomationIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8h11v5" />
      <polyline points="12 10 15 13 18 10" />
      <path d="M20 16H9v-5" />
      <polyline points="12 14 9 11 6 14" />
    </svg>
  );
}

function AiIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="5" height="5" />
      <rect x="16" y="3" width="5" height="5" />
      <rect x="9.5" y="16" width="5" height="5" />
      <line x1="8" y1="5.5" x2="16" y2="5.5" />
      <line x1="5.5" y1="8" x2="12" y2="16" />
      <line x1="18.5" y1="8" x2="12" y2="16" />
    </svg>
  );
}

function SectionLabel({ number, label, accent }: { number: string; label: string; accent: "cyan" | "amber" | "violet" }) {
  return (
    <p className={`hud-label ${styles.sectionLabel}`}>
      <span className={styles.sectionMarker} style={{ backgroundColor: `var(--color-accent-${accent})` }} />
      {number} — {label}
    </p>
  );
}

export default function SobreMiPage() {
  return (
    <div className={styles.pageWithRail}>
      <aside className={styles.rail} aria-hidden="true">
        {["Identity", "Historia", "Cómo pienso", "Evolución"].map((label) => (
          <span key={label} className={`hud-label ${styles.railLabel}`}>
            {label}
          </span>
        ))}
      </aside>

      <div className={styles.content}>
        <div className={styles.mainInner}>
          {/* 00 — Identity */}
          <section>
            <SectionLabel number="00" label="Identity" accent="cyan" />
            <div className={styles.panel}>
              <div className={styles.identityTop}>
                <div>
                  <h1 className={styles.heroName}>
                    Aitor <span className={styles.heroNameAccent}>Solana Roca</span>
                  </h1>
                  <div className={styles.identityBio}>
                    <p className={styles.bodyText}>
                      Soy técnico informático y desarrollador, centrado en sistemas, automatización,
                      desarrollo e inteligencia artificial. Ahora mismo combino ambos mundos: construyo
                      aplicaciones y automatizaciones, y sigo aprendiendo infraestructura y arquitectura
                      backend.
                    </p>
                    <p className={styles.bodyText}>
                      Me interesan sobre todo los problemas técnicos con capas — sistemas que hay que
                      entender de arriba a abajo antes de poder mejorarlos. Prefiero publicar ideas en
                      construcción antes que esperar a tenerlas perfectas, de ahí el Digital Garden.
                    </p>
                    <p className={styles.bodyText}>
                      Esta web es mi sistema operativo personal público: un reflejo en construcción
                      constante de en qué estoy trabajando, qué estoy aprendiendo y hacia dónde voy.
                    </p>
                  </div>
                  <div className={styles.tagsRow}>
                    <Tag label="Sistemas" />
                    <Tag label="Desarrollo" />
                    <Tag label="Automatización" />
                    <Tag label="IA" />
                  </div>
                  <div className={styles.heroLinks}>
                    <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" className={`hud-label ${styles.heroLink}`}>
                      GitHub →
                    </a>
                    <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" className={`hud-label ${styles.heroLink}`}>
                      LinkedIn →
                    </a>
                    <Link href="/contacto" className={`hud-label ${styles.heroLinkMuted}`}>
                      Contacto →
                    </Link>
                  </div>
                </div>

                {/* Sin foto real todavía — placeholder explícito a sustituir por una imagen (next/image) */}
                <div className={styles.photoFrame}>
                  <div className={styles.photoInner}>
                    <span className={`${styles.photoCorner} ${styles.photoCornerTl}`} />
                    <span className={`${styles.photoCorner} ${styles.photoCornerTr}`} />
                    <span className={`${styles.photoCorner} ${styles.photoCornerBl}`} />
                    <span className={`${styles.photoCorner} ${styles.photoCornerBr}`} />
                    <svg viewBox="0 0 24 24" width="72" height="72" fill="none" stroke="var(--color-border)" strokeWidth="1.2" aria-hidden="true">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                    </svg>
                  </div>
                  <div className={styles.photoCaption}>
                    <span className="hud-label" style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                      Aitor Solana Roca
                    </span>
                    <span className={styles.photoPlaceholderTag}>Placeholder</span>
                  </div>
                </div>
              </div>

              <div className={styles.telemetryStrip}>
                <div className={styles.telemetryItem}>
                  <span className={`hud-label ${styles.telemetryKey}`}>Rol actual</span>
                  <span className={styles.telemetryValue}>Técnico + Developer</span>
                </div>
                <div className={styles.telemetryItem}>
                  <span className={`hud-label ${styles.telemetryKey}`}>Enfoque</span>
                  <span className={styles.telemetryValue}>Sistemas + Dev + IA</span>
                </div>
                <div className={styles.telemetryItem}>
                  <span className={`hud-label ${styles.telemetryKey}`}>Aprendiendo</span>
                  <span className={styles.telemetryValue}>Arquitectura backend</span>
                </div>
                <div className={styles.telemetryItem}>
                  <span className={`hud-label ${styles.telemetryKey}`}>Disponibilidad</span>
                  <span className={styles.telemetryValue}>Abierto a colaborar</span>
                </div>
                <div className={styles.telemetryItem}>
                  <span className={`hud-label ${styles.telemetryKey}`}>Estado</span>
                  <span className={`hud-label ${styles.telemetryValue} ${styles.telemetryValueOnline}`}>Online</span>
                </div>
              </div>
            </div>
          </section>

          {/* 01 — Cómo empecé */}
          <section>
            <SectionLabel number="01" label="Cómo empecé" accent="amber" />
            <div className={styles.term}>
              <div className={styles.termBar}>
                <span className={`hud-label ${styles.termPath}`}>guest@aitor-os:~$ ~/sobre-mi/historia.log</span>
                <span className={`hud-label ${styles.termTag}`}>read-only</span>
              </div>
              <div className={styles.termBody}>
                <p className={styles.termCmd}>tail -f historia.log</p>
                <p className={styles.termOut}>
                  <span className={styles.termKeyCyan}>[origen]</span> Empecé por el lado de sistemas —
                  Active Directory, Windows Server, redes — resolviendo problemas del día a día en
                  infraestructuras reales.
                </p>
                <p className={styles.termOut}>
                  <span className={styles.termKeyViolet}>[giro]</span> Desde ahí me fui moviendo hacia el
                  desarrollo y la inteligencia artificial, sin dejar atrás esa base.
                </p>
                <p className={styles.termOut}>
                  <span className={styles.termKeyGreen}>[hoy]</span> Entender cómo funciona algo de arriba
                  a abajo antes de intentar mejorarlo sigue siendo mi forma de acercarme a cualquier
                  problema técnico.
                </p>
                <p><span className={styles.termCursor} /></p>
              </div>
            </div>
          </section>

          {/* 02 — Cómo pienso */}
          <section>
            <SectionLabel number="02" label="Cómo pienso" accent="cyan" />
            <div className={styles.essay}>
              <p className={styles.essayText}>
                Me muevo entre cuatro terrenos que se solapan más de lo que parece: los{" "}
                <em className={styles.emCyan}>sistemas</em> que sostienen todo por debajo — Windows
                Server, Active Directory, redes —, el <em className={styles.emAmber}>desarrollo</em> que
                construye encima con TypeScript y React, la{" "}
                <em className={styles.emViolet}>automatización</em> que quita de en medio lo repetitivo
                con scripts y agentes, y la <em className={styles.emGreen}>inteligencia artificial</em>{" "}
                como frontera — LLMs, RAG — donde estoy aprendiendo ahora mismo.
              </p>

              <div className={styles.iconRow}>
                <div className={styles.iconItem}>
                  <span style={{ color: "var(--color-accent-cyan)" }}><SystemsIcon /></span>
                  <span className={`hud-label ${styles.iconLabel}`}>Sistemas</span>
                </div>
                <div className={styles.iconItem}>
                  <span style={{ color: "var(--color-accent-amber)" }}><DevelopmentIcon /></span>
                  <span className={`hud-label ${styles.iconLabel}`}>Desarrollo</span>
                </div>
                <div className={styles.iconItem}>
                  <span style={{ color: "var(--color-accent-violet)" }}><AutomationIcon /></span>
                  <span className={`hud-label ${styles.iconLabel}`}>Automatización</span>
                </div>
                <div className={styles.iconItem}>
                  <span style={{ color: "var(--color-accent-green)" }}><AiIcon /></span>
                  <span className={`hud-label ${styles.iconLabel}`}>IA</span>
                </div>
              </div>

              <p className={styles.essayText}>
                Ahora mismo eso significa mover a la vez una plataforma de trading y un proyecto de IA
                para e-commerce — dos problemas con capas distintas que me obligan a aplicar siempre el
                mismo principio: entender el sistema completo antes de tocar nada, publicar en
                construcción en vez de esperar a que esté perfecto, y documentar lo que aprendo por el
                camino en el Garden.
              </p>

              <p className={styles.essayClose}>
                A medio plazo quiero seguir metiéndome en Docker, arquitectura backend y agentes de IA,
                explorando SaaS y sistemas distribuidos — y que esta web sea el registro real de ese
                camino, no un portfolio que se queda quieto mientras yo sigo cambiando.
              </p>
            </div>
          </section>

          {/* 03 — Evolución */}
          <section>
            <SectionLabel number="03" label="Evolución" accent="violet" />
            <div className={styles.term}>
              <div className={styles.termBar}>
                <span className={`hud-label ${styles.termPath}`}>guest@aitor-os:~$ ~/sobre-mi/evolucion</span>
                <span className={`hud-label ${styles.termTag}`}>3 commits</span>
              </div>
              <div className={styles.termBody}>
                <p className={styles.termCmd}>git log --oneline evolucion</p>
                {EVOLUTION.map((entry) => (
                  <div key={entry.year} className={styles.logRow}>
                    <span className={styles.logHash}>{entry.year}</span>
                    <span className={styles.termOut}>
                      <span className={entry.tone === "cyan" ? styles.termKeyCyan : styles.termKeyViolet}>
                        {entry.label}
                      </span>{" "}
                      {entry.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
