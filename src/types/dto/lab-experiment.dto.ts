import type { LAB_EXPERIMENT_STATUS_VALUES } from "@/lib/validation/lab-experiment.schema";

export type LabExperimentStatus = (typeof LAB_EXPERIMENT_STATUS_VALUES)[number];

/** Server -> admin UI. Forma completa, incluye campos de gestión interna. */
export interface LabExperimentDTO {
  id: string;
  labNumber: number;
  title: string;
  description: string | null;
  stack: string[];
  status: LabExperimentStatus;
  githubUrl: string | null;
  demoUrl: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Server -> página pública. Subset de LabExperimentDTO sin campos de gestión interna. */
export interface LabExperimentPublicView {
  id: string;
  labNumber: number;
  title: string;
  description: string | null;
  stack: string[];
  status: LabExperimentStatus;
  githubUrl: string | null;
  demoUrl: string | null;
}

export function toLabExperimentPublicView(experiment: LabExperimentDTO): LabExperimentPublicView {
  return {
    id: experiment.id,
    labNumber: experiment.labNumber,
    title: experiment.title,
    description: experiment.description,
    stack: experiment.stack,
    status: experiment.status,
    githubUrl: experiment.githubUrl,
    demoUrl: experiment.demoUrl,
  };
}
