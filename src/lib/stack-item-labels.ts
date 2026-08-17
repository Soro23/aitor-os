import type { StackCategory, StackUsageLevel } from "@/types/dto/stack-item.dto";

const CATEGORY_LABELS: Record<StackCategory, string> = {
  desarrollo: "Desarrollo",
  sistemas: "Sistemas",
  infraestructura: "Infraestructura",
  ia: "Inteligencia Artificial",
};

const USAGE_LEVEL_LABELS: Record<StackUsageLevel, string> = {
  daily: "Uso diario",
  frequent: "Uso frecuente",
  learning: "Aprendiendo",
  exploring: "Explorando",
};

// Metafora "niveles de señal" del design-concept.md, no barra de progreso real.
const USAGE_LEVEL_SIGNAL: Record<StackUsageLevel, number> = {
  daily: 100,
  frequent: 75,
  learning: 50,
  exploring: 25,
};

export function stackCategoryLabel(category: StackCategory): string {
  return CATEGORY_LABELS[category];
}

export function stackUsageLevelLabel(level: StackUsageLevel): string {
  return USAGE_LEVEL_LABELS[level];
}

export function stackUsageLevelSignal(level: StackUsageLevel): number {
  return USAGE_LEVEL_SIGNAL[level];
}
