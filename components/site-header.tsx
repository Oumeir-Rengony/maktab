"use client";

import { useState } from "react";
import { MenuIcon } from "lucide-react";

import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { BrandData, HeaderData } from "@/lib/types";

interface SiteHeaderProps {
  brand: BrandData;
  header: HeaderData;
}

export function SiteHeader({ brand, header }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="section-shell flex h-24 items-center justify-between">
        <Brand brand={brand} />

        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex" aria-label={header.mainNavigationLabel}>
          {header.navigation.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-ocean">
              {item.label}
            </a>
          ))}
          <Button render={<a href={header.cta.href} />} nativeButton={false}>
            {header.cta.label}
          </Button>
        </nav>

        <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                className="md:hidden"
                aria-label={header.openMenuLabel}
              />
            }
          >
            <MenuIcon />
          </DialogTrigger>
          <DialogContent className="inset-0 h-dvh max-h-none w-full max-w-none translate-x-0 translate-y-0 rounded-none p-8 md:hidden">
            <DialogHeader>
              <DialogTitle className="sr-only">{header.closeMenuLabel}</DialogTitle>
              <DialogDescription className="sr-only">{header.openMenuLabel}</DialogDescription>
            </DialogHeader>
            <nav className="flex h-full flex-col justify-center gap-7 font-heading text-4xl" aria-label={header.mobileNavigationLabel}>
              {header.navigation.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </a>
              ))}
              <Button
                render={<a href={header.cta.href} onClick={() => setIsMenuOpen(false)} />}
                nativeButton={false}
                size="lg"
                className="mt-4 w-fit"
              >
                {header.cta.label}
              </Button>
            </nav>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
