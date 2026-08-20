export type LeadPipelineStatus = "nuevo" | "contactado" | "propuesta_enviada" | "ganado" | "perdido";

export interface ContactMessageDTO {
  id: string;
  name: string;
  email: string;
  message: string;
  interest: string | null;
  isRead: boolean;
  pipelineStatus: LeadPipelineStatus;
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
}
