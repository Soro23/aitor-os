import type { PanelAccent } from "@/components/ui/Panel/Panel";
import type { LeadPipelineStatus } from "@/types/dto/contact-message.dto";

export const LEAD_STATUS_LABELS: Record<LeadPipelineStatus, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  propuesta_enviada: "Propuesta enviada",
  ganado: "Ganado",
  perdido: "Perdido",
};

export const LEAD_STATUS_TONE: Record<LeadPipelineStatus, PanelAccent> = {
  nuevo: "cyan",
  contactado: "violet",
  propuesta_enviada: "amber",
  ganado: "green",
  perdido: "red",
};
