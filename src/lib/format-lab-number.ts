/** Formatea el numero autoincremental de un experimento como "LAB #014". */
export function formatLabNumber(labNumber: number): string {
  return `LAB #${String(labNumber).padStart(3, "0")}`;
}
