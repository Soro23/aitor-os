"use client";

import { useTransition } from "react";
import { LEAD_PIPELINE_STATUS_VALUES } from "@/lib/validation/contact-message.schema";
import type { LeadPipelineStatus } from "@/types/dto/contact-message.dto";
import { LEAD_STATUS_LABELS } from "./lead-status";
import styles from "@/styles/admin-form.module.css";

export interface LeadStatusSelectProps {
  value: LeadPipelineStatus;
  onChange: (input: { pipelineStatus: LeadPipelineStatus }) => Promise<unknown>;
}

export function LeadStatusSelect({ value, onChange }: LeadStatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={value}
      disabled={isPending}
      className={styles.input}
      onChange={(event) => {
        const pipelineStatus = event.target.value as LeadPipelineStatus;
        startTransition(async () => {
          await onChange({ pipelineStatus });
        });
      }}
    >
      {LEAD_PIPELINE_STATUS_VALUES.map((status) => (
        <option key={status} value={status}>
          {LEAD_STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}
