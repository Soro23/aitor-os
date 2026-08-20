import { Panel } from "@/components/ui/Panel/Panel";
import { PricingCalculatorForm } from "./PricingCalculatorForm";

export default function PricingCalculatorPage() {
  return (
    <Panel accent="cyan">
      <p className="hud-label">Calculadora de precios</p>
      <PricingCalculatorForm />
    </Panel>
  );
}
