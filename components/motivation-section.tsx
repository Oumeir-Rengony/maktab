import type { LucideIcon } from "lucide-react";

interface MotivationItemViewModel {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface MotivationSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  items: MotivationItemViewModel[];
  quote: string;
  quoteSource: string;
}

export function MotivationSection({
  eyebrow,
  title,
  description,
  items,
  quote,
  quoteSource,
}: MotivationSectionProps) {
  return (
    <section id="why" className="section-shell py-20 md:py-32">
      <div className="grid items-end gap-6 md:grid-cols-[1.3fr_0.7fr] md:gap-20">
        <div>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h2 className="display-title max-w-[10ch] text-5xl leading-none md:text-7xl">{title}</h2>
        </div>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>

      <div className="mt-16 border-t">
        {items.map(({ title: itemTitle, description: itemDescription, icon: Icon }) => (
          <article key={itemTitle} className="grid grid-cols-[4rem_1fr] gap-4 border-b py-8 md:grid-cols-[5rem_1fr] md:gap-6">
            <span className="grid size-14 place-items-center rounded-full bg-secondary text-ocean">
              <Icon className="size-7" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-xl font-bold">{itemTitle}</h3>
              <p className="mt-2 max-w-4xl text-muted-foreground">{itemDescription}</p>
            </div>
          </article>
        ))}
      </div>

      <blockquote className="mx-auto mt-20 max-w-4xl text-center">
        <p className="font-heading text-3xl leading-tight md:text-5xl">“{quote}”</p>
        <cite className="mt-4 block text-xs font-bold tracking-[0.14em] text-muted-foreground not-italic uppercase">{quoteSource}</cite>
      </blockquote>
    </section>
  );
}
