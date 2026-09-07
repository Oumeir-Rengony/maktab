import Image from "next/image";

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
      href="/"
      aria-label={brand.homeLabel}
      className={cn(
        "inline-flex items-center gap-2 font-bold tracking-[-0.04em]",
        inverted ? "text-background" : "text-foreground",
      )}
    >

      <img src="/logo.webp" alt="" className="h-14 w-auto shrink-0" />

    </a>
  );
}
