import { ClipCard } from "@/components/ui/ClipCard/ClipCard";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { labExperimentsRepository } from "@/server/repositories/lab-experiments.repository";
import { formatLabNumber } from "@/lib/format-lab-number";
import { PlaceholderSection } from "../_components/PlaceholderSection";
import styles from "./page.module.css";

const STATUS_LABELS: Record<string, string> = {
  experiment: "Experiment",
  working: "Working",
  archived: "Archived",
};

export default async function LabPage() {
  const experiments = await labExperimentsRepository.findPublished();

  if (experiments.length === 0) {
    return (
      <PlaceholderSection
        eyebrow="Lab"
        title="Lab"
        description="Todavía no hay experimentos publicados."
        accent="green"
      />
    );
  }

  return (
    <div className={styles.grid}>
      {experiments.map((experiment) => (
        <ClipCard
          key={experiment.id}
          eyebrow={formatLabNumber(experiment.labNumber)}
          title={experiment.title}
          accent="green"
          footer={
            (experiment.githubUrl || experiment.demoUrl) && (
              <div className={styles.links}>
                {experiment.githubUrl ? (
                  <a href={experiment.githubUrl} target="_blank" rel="noreferrer" className={styles.link}>
                    GitHub
                  </a>
                ) : null}
                {experiment.demoUrl ? (
                  <a href={experiment.demoUrl} target="_blank" rel="noreferrer" className={styles.link}>
                    Demo
                  </a>
                ) : null}
              </div>
            )
          }
        >
          <StatusBadge label={STATUS_LABELS[experiment.status]} tone="green" />
          {experiment.stack.length > 0 ? (
            <p className={styles.stack}>{experiment.stack.join(" · ")}</p>
          ) : null}
        </ClipCard>
      ))}
    </div>
  );
}
