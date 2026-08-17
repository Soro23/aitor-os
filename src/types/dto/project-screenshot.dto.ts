export interface ProjectScreenshotDTO {
  id: string;
  projectId: string;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
  createdAt: string;
}
