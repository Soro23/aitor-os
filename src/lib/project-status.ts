import type { ProjectStatus } from "@/types/dto/project.dto";
import type { PanelAccent } from "@/components/ui/Panel/Panel";

const LABELS: Record<ProjectStatus, string> = {
  idea: "Idea",
  en_desarrollo: "En desarrollo",
  beta: "Beta",
  finalizado: "Finalizado",
  paused: "Pausado",
};

// Mapeo estado -> color semantico de aitor-os-design-system: cyan (idea,
// neutro/arranque), ambar (en curso/atencion), verde (completado), rojo
// (pausado/alerta).
const TONES: Record<ProjectStatus, PanelAccent> = {
  idea: "cyan",
  en_desarrollo: "amber",
  beta: "amber",
  finalizado: "green",
  paused: "red",
};

export function projectStatusLabel(status: ProjectStatus): string {
  return LABELS[status];
}

export function projectStatusTone(status: ProjectStatus): PanelAccent {
  return TONES[status];
}
