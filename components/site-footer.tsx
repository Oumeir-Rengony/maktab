import { Brand } from "@/components/brand";
import type { BrandData, FooterData } from "@/lib/types";

interface SiteFooterProps {
  brand: BrandData;
  footer: FooterData;
}

export function SiteFooter({ brand, footer }: SiteFooterProps) {
  return (
    <footer className="bg-footer py-16 text-background/70">
      <div className="section-shell">
        <div className="grid gap-10 pb-12 md:grid-cols-3">
          <Brand brand={brand} inverted />
          <p className="whitespace-pre-line font-heading text-2xl leading-snug">{footer.tagline}</p>
          <nav className="flex flex-col gap-2 text-sm md:items-end" aria-label={footer.navigationLabel}>
            {footer.navigation.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-background">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-2 border-t border-background/20 pt-6 text-xs sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {footer.copyright}</p>
          <p>{footer.location}</p>
        </div>
      </div>
    </footer>
  );
}
