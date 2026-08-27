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
      <div className="absolute right-0 top-4 sm:size-52 rounded-full bg-sun" aria-hidden="true" />
      {/* <div className="hero-card-shadow relative aspect-[0.77] w-[88%] max-w-md rotate-[1.5deg] rounded-t-[50%] rounded-b-xl bg-background p-3"> */}
        {/* <div className="arch-sky relative size-full overflow-hidden rounded-t-[50%] rounded-b-lg">
          <div
            className="absolute inset-x-[10%] bottom-[8%] h-40 rounded-full bg-sun/25 blur-3xl"
            aria-hidden="true"
          /> */}

          <img src="/logo.png" alt="" className="max-w-full z-10" />

          {/* <img
            src="/crescent-moon.png"
            alt=""
            width={128}
            height={128}
            sizes="(min-width: 640px) 6rem, 5rem"
            className="absolute right-[11%] top-[8%] h-auto w-20 drop-shadow-lg sm:w-24"
          />

          <img
            src="/lantern.png"
            alt=""
            width={512}
            height={512}
            sizes="(min-width: 640px) 7rem, 5.5rem"
            className="absolute left-[3%] top-[19%] h-auto w-[23%] max-w-28 -rotate-6 drop-shadow-xl"
          />
          <img
            src="/lantern.png"
            alt=""
            width={512}
            height={512}
            sizes="(min-width: 640px) 5rem, 4rem"
            className="absolute right-[5%] top-[36%] h-auto w-[17%] max-w-20 rotate-6 drop-shadow-lg"
          />

          <img
            src="/sparkling.png"
            alt=""
            width={512}
            height={512}
            sizes="1.25rem"
            className="absolute left-[35%] top-[17%] size-5 opacity-90"
          />
          <img
            src="/sparkling.png"
            alt=""
            width={512}
            height={512}
            sizes="0.75rem"
            className="absolute right-[22%] top-[31%] size-3 opacity-75"
          />
          <img
            src="/sparkling.png"
            alt=""
            width={512}
            height={512}
            sizes="1rem"
            className="absolute left-[17%] top-[50%] size-4 opacity-80"
          />

          <div className="absolute inset-x-0 top-[47%] z-10 text-center">
            <p className="font-serif text-6xl leading-none text-foreground" dir="rtl" lang="ar">
              {hero.arabicWord}
            </p>
            <p className="mt-2 text-sm font-bold tracking-[0.18em] text-muted-foreground uppercase">
              {hero.arabicTranslation}
            </p>
          </div>

          <img
            src="/alquran.png"
            alt=""
            width={512}
            height={512}
            sizes="(min-width: 640px) 14rem, 44vw"
            className="absolute inset-x-0 bottom-[2%] mx-auto h-auto w-1/2 drop-shadow-2xl"
          /> */}
        </div>
      // </div>
    // </div>
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
