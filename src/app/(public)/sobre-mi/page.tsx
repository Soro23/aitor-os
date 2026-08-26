import Link from "next/link";
import { Tag } from "@/components/ui/Tag/Tag";
import { SOCIAL_LINKS } from "@/lib/social-links";
import styles from "./page.module.css";

const EVOLUTION = [
  { year: "2012", tone: "violet" as const, label: "chore:", description: "hostelería + formación + proyectos personales por mi cuenta" },
  { year: "2019", tone: "cyan" as const, label: "feat:", description: "bootcamp DevOps en Netmind — arranco en Interdigital como front-end" },
  { year: "2024", tone: "violet" as const, label: "feat:", description: "Preico Jurídicos — CRM legal, automatizaciones y la WebApp de Moto2" },
  { year: "2025", tone: "cyan" as const, label: "feat:", description: "lidero un equipo de programadores en apps privadas de uso interno" },
];

function IntegrationsIcon() {
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

function ProductIcon() {
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
                      Soy Aitor, desarrollador full-stack con más de 7 años currando en proyectos reales:
                      ecommerce, integraciones con ERPs, CRMs a medida, automatizaciones. Ahora mismo
                      trabajo en Preico Jurídicos, donde he montado desde cero el CRM interno del
                      despacho, una API para sincronizar datos con fuera y hasta una WebApp para
                      gestionar los patrocinadores de un equipo de Moto2. En paralelo, estos dos últimos
                      años también he liderado un equipo de programadores en el desarrollo de
                      aplicaciones privadas de uso interno.
                    </p>
                    <p className={styles.bodyText}>
                      Antes pasé cinco años en Interdigital como desarrollador front-end, muy metido en
                      el mundo Magento: módulos para sincronizar tiendas con Dynamics 365 y Sage,
                      auditorías de seguridad, APIs para conectar frontend y backend. Y antes de eso hubo
                      un tramo largo, de 2012 a 2019, compaginando trabajos en hostelería con seguir
                      formándome y sacar adelante proyectos personales por mi cuenta — hasta que un
                      bootcamp de DevOps me metió de lleno en el stack con el que trabajo hoy.
                    </p>
                    <p className={styles.bodyText}>
                      Esta web es mi sistema operativo personal público: la uso para documentar en qué
                      estoy trabajando y qué estoy aprendiendo ahora mismo — en este caso, Next.js,
                      Supabase self-hosted y despliegue con Docker — en vez de esperar a tenerlo todo
                      perfecto antes de enseñarlo.
                    </p>
                  </div>
                  <div className={styles.tagsRow}>
                    <Tag label="Full-Stack" />
                    <Tag label="Integraciones" />
                    <Tag label="Automatización" />
                    <Tag label="Producto" />
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
                  <span className={styles.telemetryValue}>Full-Stack Developer</span>
                </div>
                <div className={styles.telemetryItem}>
                  <span className={`hud-label ${styles.telemetryKey}`}>Enfoque</span>
                  <span className={styles.telemetryValue}>Sistemas completos + integraciones</span>
                </div>
                <div className={styles.telemetryItem}>
                  <span className={`hud-label ${styles.telemetryKey}`}>Aprendiendo</span>
                  <span className={styles.telemetryValue}>IA + modelos personalizados</span>
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
                  <span className={styles.termKeyCyan}>[origen]</span> Estudié Sistemas Microinformáticos
                  y Redes y después el Grado Superior de Desarrollo de Aplicaciones — ahí programé mi
                  primera app de verdad, conectada a un TPV, y aprendí SOLID casi sin darme cuenta.
                </p>
                <p className={styles.termOut}>
                  <span className={styles.termKeyViolet}>[giro]</span> Los primeros años curré en cosas
                  muy distintas — comunicación en tiempo real para una app de spinning en INRETI,
                  inventario para una concesionaria online en ebuga — y después vino un tramo largo, de
                  2012 a 2019, compaginando hostelería con formación y proyectos propios, hasta que un
                  bootcamp de DevOps en Netmind me metió de lleno en el stack con el que trabajo hoy.
                </p>
                <p className={styles.termOut}>
                  <span className={styles.termKeyGreen}>[hoy]</span> Desde entonces no he dejado de
                  meterme en proyectos con muchas piezas moviéndose a la vez — y en los últimos años
                  también en liderar equipo — pero sigo con la misma costumbre: entender el sistema
                  completo antes de tocar nada.
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
                Me muevo entre cuatro terrenos que en la práctica están todo el rato pisándose: el{" "}
                <em className={styles.emCyan}>desarrollo full-stack</em> — Next.js, React, Node, PHP —
                que es la base de casi todo lo que he hecho, las{" "}
                <em className={styles.emAmber}>integraciones y APIs</em> que conectan sistemas que no
                nacieron pensados para hablar entre sí — ERPs, pasarelas de pago, TPVs —, la{" "}
                <em className={styles.emViolet}>automatización</em> de lo repetitivo — pagos,
                facturación, sincronización de stock — y construir{" "}
                <em className={styles.emGreen}>producto propio</em> desde cero, que es lo que más me
                llena cuando se da la oportunidad.
              </p>

              <div className={styles.iconRow}>
                <div className={styles.iconItem}>
                  <span style={{ color: "var(--color-accent-cyan)" }}><DevelopmentIcon /></span>
                  <span className={`hud-label ${styles.iconLabel}`}>Full-Stack</span>
                </div>
                <div className={styles.iconItem}>
                  <span style={{ color: "var(--color-accent-amber)" }}><IntegrationsIcon /></span>
                  <span className={`hud-label ${styles.iconLabel}`}>Integraciones</span>
                </div>
                <div className={styles.iconItem}>
                  <span style={{ color: "var(--color-accent-violet)" }}><AutomationIcon /></span>
                  <span className={`hud-label ${styles.iconLabel}`}>Automatización</span>
                </div>
                <div className={styles.iconItem}>
                  <span style={{ color: "var(--color-accent-green)" }}><ProductIcon /></span>
                  <span className={`hud-label ${styles.iconLabel}`}>Producto</span>
                </div>
              </div>

              <p className={styles.essayText}>
                Ahora mismo eso significa llevar varios frentes a la vez, y no todos tiran hacia el mismo
                lado. En Preico Jurídicos monté el CRM interno del despacho desde cero y la API que lo
                conecta con el resto de herramientas, así que cualquier cambio ahí lo pienso con cuidado
                — es la pieza que sostiene el día a día de gente que no es técnica. En paralelo llevo la
                WebApp de patrocinios del equipo de Moto2, que vive en un mundo completamente distinto —
                presupuestos, contratos, imagen de marca —, y desde hace dos años también lidero un
                pequeño equipo de programadores construyendo aplicaciones privadas de uso interno, lo que
                me obliga a pensar no solo en el código sino en cómo se organiza el trabajo de otros. Son
                proyectos que no se parecen entre sí, pero todos comparten el mismo problema de fondo:
                hacer que piezas dispersas encajen sin que se note la costura.
              </p>

              <p className={styles.essayText}>
                Fuera del horario laboral sigo teniendo la costumbre de construir cosas por mi cuenta —
                no por currículum, sino porque me pica algo y necesito resolverlo. Utilidades que echaba
                en falta, experimentos con IA para ver hasta dónde llegan, herramientas pequeñas que
                solucionan un problema muy mío. Algunos de esos proyectos ya están cerrados y
                funcionando, otros siguen abiertos y cambiando cada semana, y alguno se ha quedado
                pausado en un cajón esperando que le vuelva a tocar el turno — no porque haya fracasado,
                sino porque el foco se fue a otro sitio. Si quieres verlos con más detalle, todos están
                en <Link href="/proyectos" className={styles.inlineLink}>Proyectos</Link>.
              </p>

              <p className={styles.essayClose}>
                A medio plazo quiero meterme más en serio en arquitectura backend, Docker y despliegue
                real — no solo levantar un contenedor, sino entender bien qué pasa cuando algo falla en
                producción. De hecho esta misma web es mi terreno de pruebas para eso: Next.js, Supabase
                self-hosted, Coolify, todo montado y documentado mientras lo aprendo. Quiero que aitor-os
                sea el registro real de ese camino — no un portfolio bonito que se queda quieto mientras
                yo sigo cambiando, sino algo que se note que sigue vivo.
              </p>
            </div>
          </section>

          {/* 03 — Evolución */}
          <section>
            <SectionLabel number="03" label="Evolución" accent="violet" />
            <div className={styles.term}>
              <div className={styles.termBar}>
                <span className={`hud-label ${styles.termPath}`}>guest@aitor-os:~$ ~/sobre-mi/evolucion</span>
                <span className={`hud-label ${styles.termTag}`}>{EVOLUTION.length} commits</span>
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
