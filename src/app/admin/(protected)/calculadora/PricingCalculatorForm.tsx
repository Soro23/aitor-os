"use client";

import { useMemo, useState } from "react";
import { calculateProjectPrice } from "@/lib/pricing/calculate-project-price";
import {
  PRICING_COMPLEXITY_VALUES,
  pricingCalculatorInputSchema,
} from "@/lib/validation/pricing-calculator.schema";
import { Panel } from "@/components/ui/Panel/Panel";
import styles from "@/styles/admin-form.module.css";

const COMPLEXITY_LABELS: Record<(typeof PRICING_COMPLEXITY_VALUES)[number], string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};

export function PricingCalculatorForm() {
  const [estimatedHours, setEstimatedHours] = useState("40");
  const [hourlyRate, setHourlyRate] = useState("50");
  const [complexity, setComplexity] = useState<(typeof PRICING_COMPLEXITY_VALUES)[number]>("media");
  const [marginPercent, setMarginPercent] = useState("15");

  const result = useMemo(() => {
    const parsed = pricingCalculatorInputSchema.safeParse({
      estimatedHours: Number(estimatedHours),
      hourlyRate: Number(hourlyRate),
      complexity,
      marginPercent: Number(marginPercent),
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
    }

    return { estimate: calculateProjectPrice(parsed.data) };
  }, [estimatedHours, hourlyRate, complexity, marginPercent]);

  return (
    <div className={styles.form}>
      <div className={styles.row}>
        <label className={styles.field}>
          <span className="hud-label">Horas estimadas</span>
          <input
            type="number"
            min={0}
            step="0.5"
            value={estimatedHours}
            onChange={(event) => setEstimatedHours(event.target.value)}
            className={styles.input}
          />
        </label>
        <label className={styles.field}>
          <span className="hud-label">Tarifa/hora (€)</span>
          <input
            type="number"
            min={0}
            step="0.5"
            value={hourlyRate}
            onChange={(event) => setHourlyRate(event.target.value)}
            className={styles.input}
          />
        </label>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className="hud-label">Complejidad</span>
          <select
            value={complexity}
            onChange={(event) =>
              setComplexity(event.target.value as (typeof PRICING_COMPLEXITY_VALUES)[number])
            }
            className={styles.input}
          >
            {PRICING_COMPLEXITY_VALUES.map((value) => (
              <option key={value} value={value}>
                {COMPLEXITY_LABELS[value]}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className="hud-label">Margen (%)</span>
          <input
            type="number"
            min={0}
            max={100}
            step="1"
            value={marginPercent}
            onChange={(event) => setMarginPercent(event.target.value)}
            className={styles.input}
          />
        </label>
      </div>

      {"error" in result ? (
        <p className={styles.error} role="alert">
          {result.error}
        </p>
      ) : (
        <Panel accent="green">
          <p className="hud-label">Estimación</p>
          <p>Base: {result.estimate.base.toFixed(2)} €</p>
          <p>Ajustado por complejidad: {result.estimate.adjusted.toFixed(2)} €</p>
          <p>Total con margen: {result.estimate.total.toFixed(2)} €</p>
          <p>
            Rango sugerido: {result.estimate.rangeLow.toFixed(2)} € –{" "}
            {result.estimate.rangeHigh.toFixed(2)} €
          </p>
        </Panel>
      )}
    </div>
  );
}
