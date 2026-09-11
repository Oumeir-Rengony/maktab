import { Fragment } from "react";

import { cn } from "@/lib/utils";
import type { RegistrationData } from "@/lib/types";

interface RegistrationProgressProps {
  currentStep: number;
  steps: RegistrationData["steps"];
  progressLabel: string;
}

export function RegistrationProgress({ currentStep, steps, progressLabel }: RegistrationProgressProps) {
  return (
    <ol className="grid grid-cols-[auto_1fr_auto] items-center" aria-label={progressLabel}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCurrentOrComplete = stepNumber <= currentStep;

        return (
          <Fragment key={step.title}>
            <li className={cn("flex items-center gap-3 text-muted-foreground", isCurrentOrComplete && "text-foreground")}>
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-full border text-xs font-bold",
                  isCurrentOrComplete && "border-ocean bg-ocean text-ocean-foreground",
                )}
              >
                {stepNumber}
              </span>
              <span className="hidden text-xs leading-tight sm:block">
                <strong className="block">{step.title}</strong>
                <small>{step.description}</small>
              </span>
            </li>
            {index === 0 ? (
              <li className="mx-4 h-px bg-border" aria-hidden="true">
                <span className={cn("block h-full bg-ocean transition-[width]", currentStep === 2 ? "w-full" : "w-0")} />
              </li>
            ) : null}
          </Fragment>
        );
      })}
    </ol>
  );
}
