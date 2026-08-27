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
      href="#top"
      aria-label={brand.homeLabel}
      className={cn(
        "inline-flex items-center gap-2 font-bold tracking-[-0.04em]",
        inverted ? "text-background" : "text-foreground",
      )}
    >
      {/* <Image
        src="/logo.png"
        alt=""
        width={466}
        height={591}
        sizes="3.5rem"
        preload={!inverted}
        className="h-14 w-auto shrink-0"
      /> */}
      <img src="/logo.webp" alt="" className="h-14 w-auto shrink-0" />

      {/* <span className="text-xl">
        {name}<span className="text-coral">.</span>{suffix}
      </span> */}
    </a>
  );
}
