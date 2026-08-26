import { BookOpenTextIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { BrandData } from "@/lib/types";

interface BrandProps {
  brand: BrandData;
  inverted?: boolean;
}

export function Brand({ brand, inverted = false }: BrandProps) {
  const [name, suffix] = brand.name.split(".");

  return (
    <a
      href="#top"
      aria-label={brand.homeLabel}
      className={cn(
        "inline-flex items-center gap-2 font-bold tracking-[-0.04em]",
        inverted ? "text-background" : "text-foreground",
      )}
    >
      <span className="grid size-10 place-items-center rounded-full bg-ocean text-ocean-foreground">
        <BookOpenTextIcon className="size-5" aria-hidden="true" />
      </span>
      <span className="text-xl">
        {name}<span className="text-coral">.</span>{suffix}
      </span>
    </a>
  );
}
