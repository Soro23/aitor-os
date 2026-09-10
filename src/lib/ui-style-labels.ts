import type { UiStyleCategory } from "@/types/dto/ui-style.dto";

const CATEGORY_LABELS: Record<UiStyleCategory, string> = {
  minimalistas: "Minimalistas y funcionales",
  modernos: "Modernos y tecnológicos",
  expresivos: "Expresivos y experimentales",
  retro: "Retro y nostalgia digital",
  futuristas: "Futuristas y ciencia ficción",
  editoriales: "Editoriales y artísticos",
};

const CATEGORY_DESCRIPTIONS: Record<UiStyleCategory, string> = {
  minimalistas: "Estilos donde mandan la claridad, la jerarquía, la estructura y la facilidad de uso.",
  modernos:
    "Aquí entran muchas interfaces SaaS, dashboards, portfolios tecnológicos y productos digitales modernos.",
  expresivos:
    "Adecuados cuando quieres que la propia interfaz sea parte de la personalidad del producto.",
  retro:
    "Especialmente útiles para videojuegos, entretenimiento, música, portfolios o proyectos con mucha identidad visual.",
  futuristas:
    "Cyberpunk puede incorporar HUD, hologramas, neón y elementos sci-fi, pero merece categoría propia porque tiene una identidad visual muy marcada.",
  editoriales:
    "Interfaces donde pesan mucho la composición visual, la fotografía, la tipografía, las formas y la dirección artística.",
};

export function uiStyleCategoryLabel(category: UiStyleCategory): string {
  return CATEGORY_LABELS[category];
}

export function uiStyleCategoryDescription(category: UiStyleCategory): string {
  return CATEGORY_DESCRIPTIONS[category];
}
