import type { Metadata } from "next";
import {
  BookOpenCheckIcon,
  CalendarClockIcon,
  CircleCheckBigIcon,
  LandmarkIcon,
  UsersRoundIcon,
} from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import pageData from "@/data/data.json";
import type { HeaderData, SiteData } from "@/lib/types";

const data = pageData as SiteData;

export const metadata: Metadata = {
  title: "About us",
  description:
    "Learn how Maktab.mu nurtures children's iman, character and love for the Sunnah through face-to-face and online Islamic education.",
  alternates: {
    canonical: "/about",
  },
};



export default function AboutPage() {
  return (
    <>
      <a
        href="#main"
        className="fixed left-3 top-3 z-30 -translate-y-24 rounded-md bg-foreground px-4 py-3 text-background focus:translate-y-0"
      >
        {data.header.skipToContentLabel}
      </a>
      <SiteHeader brand={data.brand} header={data.header} />
      <main id="main">
        <section id="top" className="relative overflow-hidden bg-secondary py-16 sm:py-20">
          <div className="section-shell relative grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <div>
              <p className="eyebrow mb-5">About Maktab.mu</p>
              <h1 className="display-title text-5xl leading-[0.98] sm:text-6xl lg:text-7xl">
                Learning that reaches the heart.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Maktab.mu aims to provide children with sound Islamic education while nurturing their Īmān, character and love for the Sunnah.
              </p>
            </div>

            {/* <div className="relative overflow-hidden rounded-t-[7rem] rounded-b-lg bg-ocean px-8 py-12 text-ocean-foreground shadow-[0_1.5rem_4rem_rgb(8_47_56_/_0.13)] sm:px-12">
              <p className="pt-6 text-xs font-bold tracking-[0.18em] text-lagoon uppercase">A whole education</p>
              <p className="mt-8 font-heading text-4xl leading-tight sm:text-5xl" dir="rtl" lang="ar">
                عِلْم · عَمَل · أَخْلَاق
              </p>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-background/75">
                Knowledge, practice and character — held together in every child&apos;s learning journey.
              </p>
            </div> */}
          </div>
        </section>

        <section id="approach" className="section-shell py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <p className="eyebrow mb-4">Our approach</p>
              <h2 className="display-title text-4xl leading-none sm:text-5xl">Education with presence.</h2>
            </div>
            <p className="max-w-3xl text-xl leading-relaxed text-muted-foreground sm:text-2xl">
              Islamic learning is more than completing a lesson. It is an opportunity to be guided, to form good habits and to grow in a love for Dīn that lasts beyond the classroom.
            </p>
          </div>
        </section>

        <section id="in-person" className="bg-deep py-20 text-background md:py-28">
          <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="mb-5 text-xs font-bold tracking-[0.16em] text-sun uppercase">Our priority</p>
              <h2 className="display-title max-w-[10ch] text-5xl leading-[0.96] sm:text-6xl">Face-to-face Maktab.</h2>
              <div className="mt-10 flex items-center gap-3 text-sm font-bold text-lagoon">
                <LandmarkIcon className="size-5" aria-hidden="true" />
                The traditional way of learning
              </div>
            </div>
            <div className="border-l border-lagoon/35 pl-7 sm:pl-10 lg:pt-4">
              <p className="max-w-2xl text-xl leading-relaxed text-background/80 sm:text-2xl">
                We believe that face-to-face Maktab is the preferred method of Islamic education, following the traditional way of teaching and learning from the time of Rasūlullāh ﷺ.
              </p>
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-background/65 sm:text-lg">
                Direct interaction with teachers provides not only knowledge, but also essential <em className="font-semibold text-background">Tarbiyah</em> and guidance.
              </p>
            </div>
          </div>
        </section>

        <section id="online" className="section-shell py-20 md:py-28">
          <div className="flex items-center bg-sand rounded-lg border border-border">
            <div className="p-8 sm:p-12">
              <p className="eyebrow mb-4">Online Maktab</p>
              <h2 className="display-title text-4xl leading-none sm:text-5xl">An alternative, not a replacement.</h2>
              <p className="mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground">
                With growing pressure from school, tuition and busy schedules, attending a physical Maktab is not always possible. Online Maktab is therefore offered as an alternative for families who need it.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-muted py-20 md:py-28">
          <div className="section-shell">
            <div className="max-w-2xl">
              <p className="eyebrow mb-4">Our syllabus</p>
              <h2 className="display-title text-4xl leading-none sm:text-5xl">A clear foundation for growing minds.</h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <article className="border-t-4 border-ocean bg-card p-7 sm:p-8">
                <BookOpenCheckIcon className="size-7 text-ocean" aria-hidden="true" />
                <h3 className="mt-8 font-heading text-3xl leading-tight">SAIM syllabus</h3>
                <p className="mt-3 text-muted-foreground">The Sayyidunā ‘Abdullāh ibn Mas‘ūd رضي الله عنه (SAIM) syllabus.</p>
              </article>
              <article className="border-t-4 border-coral bg-card p-7 sm:p-8">
                <BookOpenCheckIcon className="size-7 text-coral" aria-hidden="true" />
                <h3 className="mt-8 font-heading text-3xl leading-tight">Les Enseignements Islamiques de Bases</h3>
                <p className="mt-3 text-muted-foreground">Core Islamic teachings, taught with care and consistency.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section-shell py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="eyebrow mb-4">Classes</p>
              <h2 className="display-title text-4xl leading-none sm:text-5xl">Made to work for you.</h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <CalendarClockIcon className="size-7 text-ocean" aria-hidden="true" />
                <h3 className="mt-5 font-heading text-2xl">Flexible timings</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">Classes are arranged according to the availability of both teacher and students.</p>
              </div>
              <div>
                <UsersRoundIcon className="size-7 text-ocean" aria-hidden="true" />
                <h3 className="mt-5 font-heading text-2xl">Separate learning spaces</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">Male and female students are taught separately, with male teachers for males and female teachers for females.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-coral py-20 text-primary-foreground md:py-28">
          <div className="section-shell text-center">
            <p className="text-xs font-bold tracking-[0.18em] text-background/80 uppercase">Our aim</p>
            <h2 className="display-title mx-auto mt-5 max-w-4xl text-4xl leading-[1.04] sm:text-6xl">
              Learn Dīn. Practise Dīn. Propagate Dīn.
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-background/90">
              And encourage others to do the same.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter brand={data.brand} footer={data.footer} />
    </>
  );
}
