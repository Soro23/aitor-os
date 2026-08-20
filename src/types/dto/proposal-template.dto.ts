export interface ProposalTemplateDTO {
  id: string;
  name: string;
  summary: string | null;
  content: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
