import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { Brand } from "@/components/brand";
import { TeacherRegistrationForm } from "@/components/teacher-registration-form";
import { Button } from "@/components/ui/button";
import pageData from "@/data/data.json";
import type { SiteData } from "@/lib/types";

const data = pageData as SiteData;

export const metadata: Metadata = {
  title: "Teacher registration",
  description: "Register your interest in teaching with Maktab.mu.",
};

export default function TeacherRegistrationPage() {
  return (
    <>
      <header className="border-b border-border bg-background">
        <div className="section-shell flex min-h-24 items-center justify-between gap-4">
          <Brand brand={data.brand} />
          <Button variant="ghost" render={<Link href="/" />} nativeButton={false}>
            <ArrowLeftIcon data-icon="inline-start" />
            Back to Maktab.mu
          </Button>
        </div>
      </header>
      <main>
        <section className="bg-deep py-16 text-background sm:py-20">
          <div className="section-shell max-w-5xl">
            <p className="eyebrow mb-4 text-lagoon">Teach with Maktab.mu</p>
            <h1 className="display-title max-w-3xl text-5xl leading-none sm:text-6xl">Help children grow in īmān, knowledge and character.</h1>
            <p className="mt-6 max-w-2xl text-background/75">Assalāmu‘alaikum Warahmatullāhi Wabarakātuh. Jazākumullāhu Khayran for your interest in teaching with Maktab.mu. Please complete your details accurately below.</p>
          </div>
        </section>
        <section className="bg-sand py-12 sm:py-16">
          <div className="section-shell flex justify-center">
            <TeacherRegistrationForm />
          </div>
        </section>
      </main>
      <footer className="bg-footer py-10 text-center text-sm text-background/70">
        Nurturing Īmān <span aria-hidden="true">•</span> Knowledge <span aria-hidden="true">•</span> Character
      </footer>
    </>
  );
}
