import Link from "next/link";
import { Panel, type PanelAccent } from "@/components/ui/Panel/Panel";
import { ClipCard } from "@/components/ui/ClipCard/ClipCard";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { projectsRepository } from "@/server/repositories/projects.repository";
import { gardenNotesRepository } from "@/server/repositories/garden-notes.repository";
import { labExperimentsRepository } from "@/server/repositories/lab-experiments.repository";
import { resourcesRepository } from "@/server/repositories/resources.repository";
import { nowItemsRepository } from "@/server/repositories/now-items.repository";
import { stackItemsRepository } from "@/server/repositories/stack-items.repository";
import { proposalTemplatesRepository } from "@/server/repositories/proposal-templates.repository";
import { contactMessagesRepository } from "@/server/repositories/contact-messages.repository";
import { financialEntriesRepository } from "@/server/repositories/financial-entries.repository";
import styles from "./page.module.css";

interface CollectionSummary {
  href: string;
  label: string;
  total: number;
  active: number;
  activeLabel: string;
  accent: PanelAccent;
}

export default async function AdminHomePage() {
  const [
    projects,
    gardenNotes,
    labExperiments,
    resources,
    nowItems,
    stackItems,
    proposalTemplates,
    leads,
    financialTotals,
  ] = await Promise.all([
    projectsRepository.findAll(),
    gardenNotesRepository.findAll(),
    labExperimentsRepository.findAll(),
    resourcesRepository.findAll(),
    nowItemsRepository.findAll(),
    stackItemsRepository.findAll(),
    proposalTemplatesRepository.findAll(),
    contactMessagesRepository.findAll(),
    financialEntriesRepository.getTotals(),
  ]);

  const unreadMessages = leads.filter((lead) => !lead.isRead).length;
  const newLeads = leads.filter((lead) => lead.pipelineStatus === "nuevo").length;

  const collections: CollectionSummary[] = [
    {
      href: "/admin/proyectos",
      label: "Proyectos",
      total: projects.length,
      active: projects.filter((item) => item.isPublished).length,
      activeLabel: "publicados",
      accent: "cyan",
    },
    {
      href: "/admin/garden",
      label: "Garden",
      total: gardenNotes.length,
      active: gardenNotes.filter((item) => item.isPublished).length,
      activeLabel: "publicadas",
      accent: "violet",
    },
    {
      href: "/admin/lab",
      label: "Lab",
      total: labExperiments.length,
      active: labExperiments.filter((item) => item.isPublished).length,
      activeLabel: "publicados",
      accent: "green",
    },
    {
      href: "/admin/recursos",
      label: "Recursos",
      total: resources.length,
      active: resources.filter((item) => item.isPublished).length,
      activeLabel: "publicados",
      accent: "amber",
    },
    {
      href: "/admin/now",
      label: "Now",
      total: nowItems.length,
      active: nowItems.filter((item) => item.isActive).length,
      activeLabel: "activos",
      accent: "cyan",
    },
    {
      href: "/admin/stack",
      label: "Stack",
      total: stackItems.length,
      active: stackItems.filter((item) => item.isVisible).length,
      activeLabel: "visibles",
      accent: "violet",
    },
    {
      href: "/admin/plantillas",
      label: "Plantillas",
      total: proposalTemplates.length,
      active: proposalTemplates.filter((item) => item.isActive).length,
      activeLabel: "activas",
      accent: "green",
    },
  ];

  const hasAlerts = unreadMessages > 0 || newLeads > 0;

  return (
    <div className={styles.stack}>
      <Panel accent="cyan">
        <p className="hud-label">Panel de administración</p>
        <h1 className={styles.title}>Bienvenido</h1>
        <p className={styles.subtitle}>Resumen del contenido y la actividad de Aitor OS.</p>
      </Panel>

      {hasAlerts ? (
        <Panel accent="amber">
          <p className="hud-label">Necesita atención</p>
          <div className={styles.alerts}>
            {unreadMessages > 0 ? (
              <Link href="/admin/mensajes" className={styles.alertLink}>
                <StatusBadge
                  label={`${unreadMessages} mensaje${unreadMessages === 1 ? "" : "s"} sin leer`}
                  tone="amber"
                />
              </Link>
            ) : null}
            {newLeads > 0 ? (
              <Link href="/admin/leads" className={styles.alertLink}>
                <StatusBadge label={`${newLeads} lead${newLeads === 1 ? "" : "s"} nuevo${newLeads === 1 ? "" : "s"}`} tone="cyan" />
              </Link>
            ) : null}
          </div>
        </Panel>
      ) : null}

      <section>
        <p className={`hud-label ${styles.sectionLabel}`}>Colecciones</p>
        <div className={styles.grid}>
          {collections.map((collection) => (
            <Link key={collection.href} href={collection.href} className={styles.cardLink}>
              <ClipCard eyebrow={`${collection.total} en total`} title={collection.label} accent={collection.accent}>
                <StatusBadge
                  label={`${collection.active} ${collection.activeLabel}`}
                  tone={collection.active > 0 ? "green" : "amber"}
                />
              </ClipCard>
            </Link>
          ))}
        </div>
      </section>

      <Panel accent="green">
        <p className="hud-label">Finanzas</p>
        <div className={styles.financeRow}>
          <div>
            <p className={styles.financeLabel}>Ingresos</p>
            <p className={styles.financeValue}>{financialTotals.income.toFixed(2)} €</p>
          </div>
          <div>
            <p className={styles.financeLabel}>Gastos</p>
            <p className={styles.financeValue}>{financialTotals.expense.toFixed(2)} €</p>
          </div>
          <div>
            <p className={styles.financeLabel}>Balance</p>
            <p className={styles.financeValue}>{financialTotals.balance.toFixed(2)} €</p>
          </div>
        </div>
        <Link href="/admin/finanzas" className={styles.financeLink}>
          Ver movimientos →
        </Link>
      </Panel>
    </div>
  );
}
