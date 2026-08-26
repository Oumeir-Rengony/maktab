import { MessageCircleIcon } from "lucide-react";

import { RegistrationForm } from "@/components/registration/registration-form";
import type { RegistrationData } from "@/lib/types";

interface RegistrationSectionProps {
  registration: RegistrationData;
}

function formatPhoneNumber(phone: string) {
  return `+230 ${phone.slice(0, 4)} ${phone.slice(4)}`;
}

export function RegistrationSection({ registration }: RegistrationSectionProps) {
  return (
    <section id="registration" className="bg-sand py-20 md:py-32">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.42fr_0.78fr] lg:gap-20">
        <div className="self-start lg:sticky lg:top-8">
          <p className="eyebrow mb-4">{registration.eyebrow}</p>
          <h2 className="display-title text-5xl leading-none md:text-7xl">{registration.title}</h2>
          <p className="mt-6 max-w-md text-muted-foreground">{registration.description}</p>
          <div className="mt-12 flex items-start gap-4 border-t border-foreground/15 pt-6">
            <MessageCircleIcon className="size-6 shrink-0 text-ocean" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              <strong className="block text-foreground">{registration.helpTitle}</strong>
              {registration.helpText}{" "}
              <a href={`tel:+230${registration.helpPhone}`} className="font-bold text-foreground underline">
                {formatPhoneNumber(registration.helpPhone)}
              </a>
            </p>
          </div>
        </div>
        <RegistrationForm data={registration} />
      </div>
    </section>
  );
}
