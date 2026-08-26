"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Madrassah, PremisesData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PremisesSectionProps {
  premises: PremisesData;
}

function formatPhoneNumber(phone: string) {
  return `+230 ${phone.slice(0, 4)} ${phone.slice(4)}`;
}

interface CallLinkProps {
  madrassah: Madrassah;
  label: string;
  inverted?: boolean;
}

function CallLink({ madrassah, label, inverted = false }: CallLinkProps) {
  return (
    <a
      href={`tel:+230${madrassah.phone}`}
      aria-label={`${label} ${madrassah.imam} in ${madrassah.location}`}
      className={cn(
        "inline-flex items-center gap-1 font-bold hover:underline",
        inverted ? "text-lagoon" : "text-ocean",
      )}
    >
      {label}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

function DirectoryDialog({ premises }: PremisesSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const normalizedSearch = deferredSearchTerm.trim().toLocaleLowerCase();

  const filteredMadrassahs = useMemo(() => {
    if (!normalizedSearch) {
      return premises.madrassahs;
    }

    return premises.madrassahs.filter((madrassah) => {
      const searchableText = `${madrassah.imam} ${madrassah.location}`.toLocaleLowerCase();
      return searchableText.includes(normalizedSearch);
    });
  }, [normalizedSearch, premises.madrassahs]);

  const resultLabel =
    filteredMadrassahs.length === 1
      ? premises.dialog.singularResult
      : premises.dialog.pluralResult;

  return (
    <Dialog onOpenChange={(open) => !open && setSearchTerm("")}>
      <DialogTrigger render={<Button variant="lagoon" size="lg" className="sm:min-w-64" />}>
        {premises.viewAllLabel}
        <ChevronRightIcon data-icon="inline-end" />
      </DialogTrigger>
      <DialogContent className="flex h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-[66rem] flex-col gap-0 overflow-hidden rounded-none p-0 sm:h-[min(88dvh,52rem)] sm:w-[calc(100%-2rem)] sm:max-w-[66rem]">
        <DialogHeader className="px-5 pt-6 pb-5 pr-20 sm:px-8 sm:pt-8 sm:pr-24">
          <p className="eyebrow">{premises.dialog.eyebrow}</p>
          <DialogTitle className="display-title text-4xl sm:text-5xl">
            {premises.dialog.title}
          </DialogTitle>
          <DialogDescription className="sr-only">{premises.dialog.description}</DialogDescription>
        </DialogHeader>

        <div className="grid items-end gap-3 border-b px-5 pb-5 sm:grid-cols-[1fr_auto] sm:gap-6 sm:px-8">
          <Field>
            <FieldLabel htmlFor="directory-search">{premises.dialog.searchLabel}</FieldLabel>
            <Input
              id="directory-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={premises.dialog.searchPlaceholder}
            />
          </Field>
          <p className="pb-4 text-sm font-bold text-muted-foreground" role="status" aria-live="polite">
            {filteredMadrassahs.length} {resultLabel}
          </p>
        </div>

        <div className="hidden grid-cols-[1.25fr_0.9fr_0.8fr_4rem] gap-4 bg-secondary px-8 py-3.5 text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase sm:grid">
          <span>{premises.tableHeaders.imam}</span>
          <span>{premises.tableHeaders.location}</span>
          <span>{premises.tableHeaders.contact}</span>
          <span className="sr-only">{premises.tableHeaders.action}</span>
        </div>

        <ScrollArea className="min-h-0">
          {filteredMadrassahs.length > 0 ? (
            <ul className="flex flex-col">
              {filteredMadrassahs.map((madrassah) => (
                <li
                  key={`${madrassah.imam}-${madrassah.location}`}
                  className="content-auto grid min-h-16 grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b px-5 py-4 text-sm sm:grid-cols-[1.25fr_0.9fr_0.8fr_4rem] sm:items-center sm:gap-4 sm:px-8"
                >
                  <strong>{madrassah.imam}</strong>
                  <span className="text-muted-foreground sm:col-auto">{madrassah.location}</span>
                  <span className="text-muted-foreground sm:col-auto">{formatPhoneNumber(madrassah.phone)}</span>
                  <span className="col-start-2 row-span-3 row-start-1 self-center text-right sm:col-auto sm:row-auto">
                    <CallLink madrassah={madrassah} label={premises.callLabel} />
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-16 text-center text-muted-foreground sm:px-8">{premises.dialog.emptyMessage}</p>
          )}
        </ScrollArea>

        <div className="flex flex-col gap-1 border-t bg-popover px-5 py-4 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-8">
          <p>{premises.dialog.scrollHint}</p>
          <p>{premises.directoryNote}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PremisesSection({ premises }: PremisesSectionProps) {
  const featuredMadrassahs = premises.madrassahs.slice(0, 4);

  return (
    <section id="premises" className="bg-deep py-20 text-background md:py-28">
      <div className="section-shell">
        <div className="grid items-end gap-6 md:grid-cols-[1.3fr_0.7fr] md:gap-20">
          <div>
            <p className="eyebrow mb-4 text-background">{premises.eyebrow}</p>
            <h2 className="display-title max-w-[10ch] text-5xl leading-none md:text-7xl">{premises.title}</h2>
          </div>
          <p className="text-background/70">{premises.description}</p>
        </div>

        <Table className="mt-14 min-w-2xl">
          <TableCaption className="sr-only">{premises.title}</TableCaption>
          <TableHeader>
            <TableRow className="border-background/25 hover:bg-transparent">
              <TableHead className="text-background/60">{premises.tableHeaders.imam}</TableHead>
              <TableHead className="text-background/60">{premises.tableHeaders.location}</TableHead>
              <TableHead className="text-background/60">{premises.tableHeaders.contact}</TableHead>
              <TableHead className="text-right text-background/60">{premises.tableHeaders.action}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {featuredMadrassahs.map((madrassah) => (
              <TableRow key={`${madrassah.imam}-${madrassah.location}`} className="border-background/25 hover:bg-background/5">
                <TableCell className="py-5 font-bold text-background">{madrassah.imam}</TableCell>
                <TableCell className="text-background/75">{madrassah.location}</TableCell>
                <TableCell className="text-background/75">{formatPhoneNumber(madrassah.phone)}</TableCell>
                <TableCell className="text-right">
                  <CallLink madrassah={madrassah} label={premises.callLabel} inverted />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-8 flex flex-col items-start justify-between gap-5 border border-background/25 p-5 sm:flex-row sm:items-center sm:p-6">
          <p className="text-sm text-background/70">
            <strong className="mb-1 block text-base text-background">{premises.moreTitle}</strong>
            {premises.moreDescription}
          </p>
          <DirectoryDialog premises={premises} />
        </div>
        <p className="mt-4 text-xs text-background/55">{premises.directoryNote}</p>
      </div>
    </section>
  );
}
