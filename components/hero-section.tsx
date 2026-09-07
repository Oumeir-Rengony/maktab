import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import type { HeroData } from "@/lib/types";

interface HeroSectionProps {
  hero: HeroData;
}

function HeroIllustration({ hero }: HeroSectionProps) {
  return (
    <div
      className="relative mx-auto grid min-h-112 w-full max-w-xl place-items-center md:min-h-144"
      role="img"
      aria-label={hero.illustrationLabel}
    >
      {/* <div className="absolute right-0 top-4 sm:size-52 rounded-full bg-sun" aria-hidden="true" /> */}
      <div className="hero-card-shadow relative aspect-[0.77] w-[94%] max-w-md rotate-[1.5deg] rounded-t-[50%] rounded-b-xl bg-background p-3">
        <div className="arch-sky relative size-full overflow-hidden rounded-t-[50%] rounded-b-lg">

          {/* <img src="/hero.png" alt="" className="max-w-full z-10" /> */}

          <img
            src="/hero2.jpg"
            alt=""
            className="max-w-full absolute h-[stretch] drop-shadow-lg object-cover"
          />   

        </div>
       </div>
    </div>
  );
}

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section id="top" className="hero-atmosphere relative overflow-hidden pt-4 pb-20 lg:min-h-196 lg:pt-2">
      <div className="hero-rings absolute -bottom-32 -left-28 size-80 rounded-full border border-ocean/20" aria-hidden="true" />
      <div className="section-shell relative grid items-center gap-4 sm:gap-12 lg:grid-cols-[1fr_0.92fr] lg:gap-20">
        <div>
          <p className="eyebrow mb-4">{hero.eyebrow}</p>
          <h1 className="display-title max-w-[10ch] text-[clamp(3.7rem,6.5vw,6.6rem)] leading-[0.98]">{hero.title}</h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">{hero.description}</p>
          <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <Button render={<a href={hero.primaryCta.href} />} nativeButton={false} size="lg">
              {hero.primaryCta.label}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <a href={hero.secondaryCta.href} className="border-b-2 border-coral pb-1 font-bold">
              {hero.secondaryCta.label}
            </a>
          </div>
          <div className="mt-12 flex items-center gap-4">
            <div className="flex [&>span+span]:-ml-2" aria-hidden="true">
              {hero.welcomeMarks.map((letter) => (
                <span key={letter} className="grid size-9 place-items-center rounded-full border-2 border-secondary bg-ocean font-serif text-ocean-foreground even:bg-sun even:text-foreground last:bg-primary">
                  {letter}
                </span>
              ))}
            </div>
            <p className="m-0 text-xs leading-relaxed text-muted-foreground">
              <strong className="block text-foreground">{hero.welcomeTitle}</strong>
              {hero.welcomeDescription}
            </p>
          </div>
        </div>
        <HeroIllustration hero={hero} />
      </div>
    </section>
  );
}
