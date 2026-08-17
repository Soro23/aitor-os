import { Panel } from "@/components/ui/Panel/Panel";
import { ProgressBar } from "@/components/ui/ProgressBar/ProgressBar";
import { stackItemsRepository } from "@/server/repositories/stack-items.repository";
import { STACK_CATEGORY_VALUES } from "@/lib/validation/stack-item.schema";
import { stackCategoryLabel, stackUsageLevelLabel, stackUsageLevelSignal } from "@/lib/stack-item-labels";
import { PlaceholderSection } from "../_components/PlaceholderSection";
import styles from "./page.module.css";

export default async function StackPage() {
  const items = await stackItemsRepository.findVisible();

  if (items.length === 0) {
    return (
      <PlaceholderSection
        eyebrow="Stack"
        title="Stack"
        description="Todavía no hay tecnologías publicadas."
        accent="cyan"
      />
    );
  }

  return (
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
  );
}
