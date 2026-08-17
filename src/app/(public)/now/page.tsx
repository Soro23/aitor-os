import { Panel } from "@/components/ui/Panel/Panel";
import { PulseIndicator } from "@/components/ui/PulseIndicator/PulseIndicator";
import { nowItemsRepository } from "@/server/repositories/now-items.repository";
import { nowItemCategoryLabel } from "@/lib/now-item-labels";
import { PlaceholderSection } from "../_components/PlaceholderSection";
import styles from "./page.module.css";

export default async function NowPage() {
  const items = await nowItemsRepository.findActive();

  if (items.length === 0) {
    return (
      <PlaceholderSection
        eyebrow="Now"
        title="Now"
        description="Todavía no hay nada publicado en Now."
        accent="green"
      />
    );
  }

  return (
    <div className={styles.stack}>
      {items.map((item) => (
        <Panel key={item.id} accent="green">
          <PulseIndicator label={nowItemCategoryLabel(item.category)} tone="green" />
          <h2 className={styles.title}>{item.title}</h2>
          {item.description ? <p className={styles.description}>{item.description}</p> : null}
        </Panel>
      ))}
    </div>
  );
}
