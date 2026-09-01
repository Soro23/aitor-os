import { Panel } from "@/components/ui/Panel/Panel";
import { ProgressBar } from "@/components/ui/ProgressBar/ProgressBar";
import { stackItemsRepository } from "@/server/repositories/stack-items.repository";
import { STACK_CATEGORY_VALUES } from "@/lib/validation/stack-item.schema";
import { stackCategoryLabel, stackUsageLevelLabel, stackUsageLevelSignal } from "@/lib/stack-item-labels";
import { SectionIntro } from "../_components/SectionIntro";
import { EmptyNotice } from "../_components/EmptyNotice";
import styles from "./page.module.css";

const INTRO_DESCRIPTION =
  "Las tecnologías con las que trabajo, agrupadas por categoría: desarrollo, sistemas, infraestructura e inteligencia artificial. En lugar de porcentajes inventados, cada una indica el nivel de uso real — uso diario, uso frecuente, aprendiendo o explorando.";

export default async function StackPage() {
  const items = await stackItemsRepository.findVisible();

  const intro = (
    <SectionIntro
      eyebrow="Stack"
      title="Stack"
      description={INTRO_DESCRIPTION}
      accent="cyan"
      meta={items.length > 0 ? `${items.length} tecnologías` : undefined}
    />
  );

  if (items.length === 0) {
    return (
      <>
        {intro}
        <EmptyNotice message="Todavía no hay tecnologías publicadas." accent="cyan" />
      </>
    );
  }

  return (
    <>
      {intro}
      <div className={styles.stack}>
        {STACK_CATEGORY_VALUES.map((category) => {
          const itemsInCategory = items.filter((item) => item.category === category);
          if (itemsInCategory.length === 0) return null;

          return (
            <Panel key={category} accent="cyan">
              <p className="hud-label">{stackCategoryLabel(category)}</p>
              <div className={styles.items}>
                {itemsInCategory.map((item) => (
                  <ProgressBar
                    key={item.id}
                    value={stackUsageLevelSignal(item.usageLevel)}
                    label={`${item.name} — ${stackUsageLevelLabel(item.usageLevel)}`}
                    tone="cyan"
                  />
                ))}
              </div>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
