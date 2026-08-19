"use client";

import type { ReactNode } from "react";
import styles from "./Tabs.module.css";

export interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeId, onChange }: TabsProps) {
  const activeTab = tabs.find((tab) => tab.id === activeId);

  return (
    <div>
      <div role="tablist" className={styles.tabList}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === activeId}
            onClick={() => onChange(tab.id)}
            className={`hud-label ${styles.tab} ${tab.id === activeId ? styles.active : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className={styles.panel}>
        {activeTab?.content}
      </div>
    </div>
  );
}
