import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { HeroData } from "@/lib/types";

interface HeroSectionProps {
  hero: HeroData;
}

function HeroIllustration({ hero }: HeroSectionProps) {
  return (
    <div className="relative mx-auto grid min-h-[28rem] w-full max-w-xl place-items-center md:min-h-[36rem]" aria-label={hero.illustrationLabel}>
      <div className="absolute right-2 top-4 size-40 rounded-full bg-sun sm:size-52" aria-hidden="true" />
      <div className="hero-card-shadow relative aspect-[0.77] w-[88%] max-w-md rotate-[1.5deg] rounded-t-[50%] rounded-b-xl bg-background p-3">
        <div className="arch-sky relative size-full overflow-hidden rounded-t-[50%] rounded-b-lg">
          <svg className="absolute inset-0 size-full stroke-background/70" viewBox="0 0 420 510" preserveAspectRatio="none" aria-hidden="true">
            <path d="M78 106h18M87 97v18M323 154h12M329 148v12M286 65h8M290 61v8" fill="none" strokeWidth="2" strokeLinecap="round" />
            <path d="M332 92a21 21 0 1 1-18-34 25 25 0 1 0 18 34Z" fill="none" strokeWidth="2" />
          </svg>
          <div className="absolute left-0 top-36 -rotate-3 border-l-4 border-primary bg-card p-4 shadow-xl sm:-left-8 sm:w-52">
            <span className="block text-xs text-muted-foreground">{hero.lessonLabel}</span>
            <strong className="block font-heading text-lg text-foreground">{hero.lessonTitle}</strong>
            <small className="block text-muted-foreground">{hero.lessonSteps}</small>
          </div>
          <svg className="absolute inset-x-0 bottom-2 w-full" viewBox="0 0 340 230" role="img" aria-label={hero.illustrationLabel}>
            <path className="stroke-plant" d="M44 207c3-54 12-105 42-144M48 170c-23-7-35-24-35-45 25 0 40 14 41 37M63 128c-4-25 7-45 27-57 10 24 1 46-20 58" fill="none" strokeWidth="4" strokeLinecap="round" />
            <path className="fill-lagoon stroke-plant" d="M47 173C22 168 10 150 12 126c24 1 40 14 42 38M64 130c-5-26 6-47 27-59 9 25 1 48-20 60" strokeWidth="3" />
            <path className="stroke-wood" d="m115 201 54-73 54 73M217 201l-48-73-54 73" fill="none" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path className="fill-sand stroke-foreground" d="M168 143c-24-23-55-31-89-24l21 55c28-5 51 2 68 17Z" strokeWidth="3" strokeLinejoin="round" />
            <path className="fill-sand stroke-foreground" d="M170 143c25-23 56-31 90-24l-21 55c-28-5-52 2-69 17Z" strokeWidth="3" strokeLinejoin="round" />
            <path className="stroke-foreground" d="M104 134c18 0 34 5 48 15M108 146c17 1 31 5 43 12M235 134c-18 0-34 5-48 15M231 146c-17 1-31 5-43 12" fill="none" strokeWidth="2" strokeLinecap="round" opacity=".55" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-8 right-0 text-right sm:-right-4">
        <p className="font-serif text-6xl leading-none text-foreground" dir="rtl" lang="ar">{hero.arabicWord}</p>
        <p className="mt-2 text-[0.65rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">{hero.arabicTranslation}</p>
      </div>
    </div>
  );
}

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section id="top" className="hero-atmosphere relative overflow-hidden pt-32 pb-20 lg:min-h-[49rem] lg:pt-24">
      <div className="hero-rings absolute -bottom-32 -left-28 size-80 rounded-full border border-ocean/20" aria-hidden="true" />
      <div className="section-shell relative grid items-center gap-12 lg:grid-cols-[1fr_0.92fr] lg:gap-20">
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
