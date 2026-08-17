import type { PROJECT_STATUS_VALUES } from "@/lib/validation/project.schema";
import type { ProjectScreenshotDTO } from "./project-screenshot.dto";

export type ProjectStatus = (typeof PROJECT_STATUS_VALUES)[number];

/** Server -> admin UI. Forma completa, incluye campos de gestión interna. */
export interface ProjectDTO {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  problem: string | null;
  solution: string | null;
  technologies: string[];
  architecture: string | null;
  status: ProjectStatus;
  progress: number;
  githubUrl: string | null;
  demoUrl: string | null;
  learnings: string | null;
  nextSteps: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Server -> página pública. Subset de ProjectDTO sin campos de gestión interna. */
export interface ProjectPublicView {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  problem: string | null;
  solution: string | null;
  technologies: string[];
  architecture: string | null;
  status: ProjectStatus;
  progress: number;
  githubUrl: string | null;
  demoUrl: string | null;
  learnings: string | null;
  nextSteps: string | null;
  screenshots: ProjectScreenshotDTO[];
}

export function toProjectPublicView(
  project: ProjectDTO,
  screenshots: ProjectScreenshotDTO[] = [],
): ProjectPublicView {
  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    description: project.description,
    problem: project.problem,
    solution: project.solution,
    technologies: project.technologies,
    architecture: project.architecture,
    status: project.status,
    progress: project.progress,
    githubUrl: project.githubUrl,
    demoUrl: project.demoUrl,
    learnings: project.learnings,
    nextSteps: project.nextSteps,
    screenshots,
  };
}
