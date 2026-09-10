/** Imagen de la galería de un estilo UI. */
export interface UiStyleImageDTO {
  id: string;
  uiStyleId: string;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
  createdAt: string;
}
