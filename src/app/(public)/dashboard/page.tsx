import { Panel } from "@/components/ui/Panel/Panel";
import { ClipCard } from "@/components/ui/ClipCard/ClipCard";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar/ProgressBar";
import { PulseIndicator } from "@/components/ui/PulseIndicator/PulseIndicator";
import { projectsRepository } from "@/server/repositories/projects.repository";
import { nowItemsRepository } from "@/server/repositories/now-items.repository";
import { getGithubActivity } from "@/lib/github/get-activity";
import { projectStatusLabel, projectStatusTone } from "@/lib/project-status";
import { nowItemCategoryLabel } from "@/lib/now-item-labels";
import styles from "./page.module.css";

export default async function DashboardPage() {
  const [projects, nowItems, githubActivity] = await Promise.all([
    projectsRepository.findPublished(),
    nowItemsRepository.findActive(),
    getGithubActivity(),
  ]);

  return (
    <div className={styles.stack}>
      <Panel accent="cyan">
        <p className="hud-label">Dashboard</p>
        <h1 className={styles.title}>Actividad</h1>
      </Panel>

      {nowItems.length > 0 ? (
        <Panel accent="green">
          <p className="hud-label">Ahora mismo</p>
          <div className={styles.nowList}>
            {nowItems.map((item) => (
              <PulseIndicator
                key={item.id}
                label={`${nowItemCategoryLabel(item.category)}: ${item.title}`}
                tone="green"
              />
            ))}
          </div>
        </Panel>
      ) : null}

      <section>
        <p className={`hud-label ${styles.sectionLabel}`}>Proyectos</p>
        {projects.length > 0 ? (
          <div className={styles.grid}>
            {projects.map((project) => (
              <ClipCard
                key={project.id}
                eyebrow={project.technologies.join(" · ") || "Proyecto"}
                title={project.name}
                accent={projectStatusTone(project.status)}
              >
                <StatusBadge
                  label={projectStatusLabel(project.status)}
                  tone={projectStatusTone(project.status)}
                />
                <ProgressBar
                  value={project.progress}
                  label="Progreso"
                  tone={projectStatusTone(project.status)}
                />
              </ClipCard>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>Todavía no hay proyectos publicados.</p>
        )}
      </section>

      {githubActivity ? (
        <Panel accent="cyan">
          <p className="hud-label">GitHub · @{githubActivity.username}</p>
          <p className={styles.reposCount}>{githubActivity.publicRepos} repositorios públicos</p>
          {githubActivity.recentRepos.length > 0 ? (
            <ul className={styles.repoList}>
              {githubActivity.recentRepos.map((repo) => (
                <li key={repo.url} className={styles.repoItem}>
                  <a href={repo.url} target="_blank" rel="noreferrer" className={styles.repoLink}>
                    {repo.name}
                  </a>
                  {repo.language ? <span className={styles.repoLanguage}>{repo.language}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </Panel>
      ) : null}
    </div>
  );
}
