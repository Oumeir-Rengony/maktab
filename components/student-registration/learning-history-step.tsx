import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { RegistrationData, RegistrationFieldName, RegistrationFormState } from "@/lib/types";

interface LearningHistoryStepProps {
  data: RegistrationData;
  formState: RegistrationFormState;
  invalidFields: Set<RegistrationFieldName>;
  isSubmitting: boolean;
  onFieldChange: (field: RegistrationFieldName, value: string) => void;
  onBack: () => void;
}

export function LearningHistoryStep({
  data,
  formState,
  invalidFields,
  isSubmitting,
  onFieldChange,
  onBack,
}: LearningHistoryStepProps) {
  const showPreviousStudy = formState.attendedBefore === "yes";

  return (
    <FieldSet className="gap-0">
      <FieldLegend className="font-heading leading-tight font-semibold text-deep data-[variant=legend]:text-[2rem]">
        {data.steps[1].title}
      </FieldLegend>
      <p className="text-sm text-muted-foreground">{data.steps[1].description}</p>

      <FieldGroup className="mt-8 gap-5">
        <Field data-invalid={invalidFields.has("attendedBefore")}>
          <FieldTitle id="attended-before-label">
            {data.fields.attendedBefore} <span aria-hidden="true">*</span>
          </FieldTitle>
          <ToggleGroup
            aria-labelledby="attended-before-label"
            variant="outline"
            value={formState.attendedBefore ? [formState.attendedBefore] : []}
            onValueChange={(value) => onFieldChange("attendedBefore", value[0] ?? "")}
            disabled={isSubmitting}
            className="grid w-full grid-cols-2"
          >
            <ToggleGroupItem value="yes">{data.fields.yes}</ToggleGroupItem>
            <ToggleGroupItem value="no">{data.fields.no}</ToggleGroupItem>
          </ToggleGroup>
        </Field>

        {showPreviousStudy ? (
          <div className="grid gap-5 border-t pt-6 sm:grid-cols-2">
            <Field className="sm:col-span-2" data-invalid={invalidFields.has("previousMadrassah")}>
              <FieldLabel htmlFor="previous-madrassah">{data.fields.previousMadrassah}</FieldLabel>
              <Input
                id="previous-madrassah"
                value={formState.previousMadrassah}
                onChange={(event) => onFieldChange("previousMadrassah", event.target.value)}
                aria-invalid={invalidFields.has("previousMadrassah")}
                disabled={isSubmitting}
              />
            </Field>
            <Field data-invalid={invalidFields.has("studyDuration")}>
              <FieldLabel htmlFor="study-duration">{data.fields.studyDuration}</FieldLabel>
              <Input
                id="study-duration"
                value={formState.studyDuration}
                onChange={(event) => onFieldChange("studyDuration", event.target.value)}
                placeholder={data.fields.studyDurationPlaceholder}
                aria-invalid={invalidFields.has("studyDuration")}
                disabled={isSubmitting}
              />
            </Field>
            <Field data-invalid={invalidFields.has("quranProgress")}>
              <FieldLabel htmlFor="quran-progress">{data.fields.quranProgress}</FieldLabel>
              <Input
                id="quran-progress"
                value={formState.quranProgress}
                onChange={(event) => onFieldChange("quranProgress", event.target.value)}
                placeholder={data.fields.quranProgressPlaceholder}
                aria-invalid={invalidFields.has("quranProgress")}
                disabled={isSubmitting}
              />
            </Field>
            <Field className="sm:col-span-2" data-invalid={invalidFields.has("surahProgress")}>
              <FieldLabel htmlFor="surah-progress">{data.fields.surahProgress}</FieldLabel>
              <Textarea
                id="surah-progress"
                value={formState.surahProgress}
                onChange={(event) => onFieldChange("surahProgress", event.target.value)}
                placeholder={data.fields.surahProgressPlaceholder}
                rows={3}
                className="min-h-26"
                aria-invalid={invalidFields.has("surahProgress")}
                disabled={isSubmitting}
              />
            </Field>
          </div>
        ) : null}
      </FieldGroup>

      <div className="mt-9 flex flex-col-reverse justify-between gap-3 sm:flex-row">
        <Button type="button" variant="outline" size="lg" onClick={onBack} disabled={isSubmitting}>
          <ChevronLeftIcon data-icon="inline-start" />
          {data.actions.back}
        </Button>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? data.actions.submitting : data.actions.submit}
          <ChevronRightIcon data-icon="inline-end" />
        </Button>
      </div>
    </FieldSet>
  );
}
