import { ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  FormOption,
  RegistrationData,
  RegistrationFieldName,
  RegistrationFormState,
} from "@/lib/types";

interface StudentDetailsStepProps {
  data: RegistrationData;
  formState: RegistrationFormState;
  invalidFields: Set<RegistrationFieldName>;
  onFieldChange: (field: RegistrationFieldName, value: string) => void;
  onContinue: () => void;
}

interface RequiredLabelProps {
  htmlFor: string;
  children: string;
}

function RequiredLabel({ htmlFor, children }: RequiredLabelProps) {
  return (
    <FieldLabel htmlFor={htmlFor}>
      {children} <span aria-hidden="true">*</span>
    </FieldLabel>
  );
}

function createSelectItems(placeholder: string, options: FormOption[]) {
  return [{ label: placeholder, value: null }, ...options];
}

export function StudentDetailsStep({
  data,
  formState,
  invalidFields,
  onFieldChange,
  onContinue,
}: StudentDetailsStepProps) {
  const courseItems = createSelectItems(data.fields.coursePlaceholder, data.courseOptions);
  const relationshipItems = createSelectItems(
    data.fields.relationshipPlaceholder,
    data.relationshipOptions,
  );

  return (
    <FieldSet className="gap-0">
      <FieldLegend className="font-heading leading-tight font-semibold text-deep data-[variant=legend]:text-[2rem]">
        {data.steps[0].title}
      </FieldLegend>
      <p className="text-sm text-muted-foreground">{data.requiredNote}</p>

      <FieldGroup className="mt-8 gap-5">
        <Field data-invalid={invalidFields.has("course")}>
          <RequiredLabel htmlFor="course">{data.fields.course}</RequiredLabel>
          <Select
            items={courseItems}
            value={formState.course || null}
            onValueChange={(value) => onFieldChange("course", value ?? "")}
          >
            <SelectTrigger id="course" className="w-full" aria-invalid={invalidFields.has("course")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectGroup>
                {courseItems.map((item) => (
                  <SelectItem key={item.value ?? "placeholder"} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {invalidFields.has("course") ? <FieldError>{data.errorMessage}</FieldError> : null}
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={invalidFields.has("studentName")}>
            <RequiredLabel htmlFor="student-name">{data.fields.studentName}</RequiredLabel>
            <Input
              id="student-name"
              name="studentName"
              value={formState.studentName}
              onChange={(event) => onFieldChange("studentName", event.target.value)}
              autoComplete="name"
              aria-invalid={invalidFields.has("studentName")}
              required
            />
          </Field>
          <Field data-invalid={invalidFields.has("studentAge")}>
            <RequiredLabel htmlFor="student-age">{data.fields.studentAge}</RequiredLabel>
            <Input
              id="student-age"
              name="studentAge"
              type="number"
              min="4"
              max="99"
              value={formState.studentAge}
              onChange={(event) => onFieldChange("studentAge", event.target.value)}
              placeholder={data.fields.studentAgePlaceholder}
              aria-invalid={invalidFields.has("studentAge")}
              required
            />
          </Field>
          <Field data-invalid={invalidFields.has("responsibleName")}>
            <RequiredLabel htmlFor="responsible-name">{data.fields.responsibleName}</RequiredLabel>
            <Input
              id="responsible-name"
              name="responsibleName"
              value={formState.responsibleName}
              onChange={(event) => onFieldChange("responsibleName", event.target.value)}
              autoComplete="name"
              aria-invalid={invalidFields.has("responsibleName")}
              required
            />
          </Field>
          <Field data-invalid={invalidFields.has("responsibleEmail")}>
            <RequiredLabel htmlFor="responsible-email">{data.fields.responsibleEmail}</RequiredLabel>
            <Input
              id="responsible-email"
              name="responsibleEmail"
              type="email"
              value={formState.responsibleEmail}
              onChange={(event) => onFieldChange("responsibleEmail", event.target.value)}
              autoComplete="email"
              placeholder={data.fields.responsibleEmailPlaceholder}
              aria-invalid={invalidFields.has("responsibleEmail")}
              required
            />
          </Field>
          <Field data-invalid={invalidFields.has("relationship")}>
            <RequiredLabel htmlFor="relationship">{data.fields.relationship}</RequiredLabel>
            <Select
              items={relationshipItems}
              value={formState.relationship || null}
              onValueChange={(value) => onFieldChange("relationship", value ?? "")}
            >
              <SelectTrigger id="relationship" className="w-full" aria-invalid={invalidFields.has("relationship")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {relationshipItems.map((item) => (
                    <SelectItem key={item.value ?? "placeholder"} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field data-invalid={invalidFields.has("residence")}>
            <RequiredLabel htmlFor="residence">{data.fields.residence}</RequiredLabel>
            <Input
              id="residence"
              name="residence"
              value={formState.residence}
              onChange={(event) => onFieldChange("residence", event.target.value)}
              autoComplete="address-level2"
              placeholder={data.fields.residencePlaceholder}
              aria-invalid={invalidFields.has("residence")}
              required
            />
          </Field>
        </div>
      </FieldGroup>

      <div className="mt-9 flex justify-end">
        <Button type="button" size="lg" onClick={onContinue}>
          {data.actions.next}
          <ChevronRightIcon data-icon="inline-end" />
        </Button>
      </div>
    </FieldSet>
  );
}
