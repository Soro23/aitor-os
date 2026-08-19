import styles from "./Stepper.module.css";

export interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <ol className={`hud-label ${styles.steps}`}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isDone = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <li key={step} className={styles.stepItem}>
            <span
              aria-current={isActive ? "step" : undefined}
              className={`${styles.step} ${isDone ? styles.done : ""} ${isActive ? styles.active : ""}`}
            >
              {isDone ? "✓" : stepNumber}
            </span>
            {index < steps.length - 1 ? <span className={`${styles.line} ${isDone ? styles.lineDone : ""}`} /> : null}
          </li>
        );
      })}
    </ol>
  );
}
