import { LandmarkIcon, ShieldCheckIcon, UsersRoundIcon, type LucideIcon } from "lucide-react";

import { HeroSection } from "@/components/hero-section";
import { MotivationSection } from "@/components/motivation-section";
import { PremisesSection } from "@/components/premises-section";
import { RegistrationSection } from "@/components/registration-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import pageData from "@/data/data.json";
import type { MotivationItem, SiteData } from "@/lib/types";

const data = pageData as SiteData;

const motivationIcons: Record<MotivationItem["icon"], LucideIcon> = {
  shield: ShieldCheckIcon,
  arch: LandmarkIcon,
  community: UsersRoundIcon,
};

export default function Home() {
  const motivationItems = data.motivation.items.map((item) => ({
    title: item.title,
    description: item.description,
    icon: motivationIcons[item.icon],
  }));

  return (
    <>
      <a
        href="#main"
        className="fixed left-3 top-3 -translate-y-24 rounded-md bg-foreground px-4 py-3 text-background focus:translate-y-0"
      >
        {data.header.skipToContentLabel}
      </a>
      <SiteHeader brand={data.brand} header={data.header} />
      <main id="main">
        <HeroSection hero={data.hero} />
        <MotivationSection
          eyebrow={data.motivation.eyebrow}
          title={data.motivation.title}
          description={data.motivation.description}
          items={motivationItems}
          quote={data.motivation.quote}
          quoteSource={data.motivation.quoteSource}
        />
        <PremisesSection premises={data.premises} />
        <RegistrationSection registration={data.registration} />
      </main>
      <SiteFooter brand={data.brand} footer={data.footer} />
    </>
  );
}
