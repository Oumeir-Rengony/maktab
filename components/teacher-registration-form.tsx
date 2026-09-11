"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  teacherAgeGroups,
  teacherAvailableDays,
  teacherLanguages,
  teacherSubjects,
} from "@/lib/teacher-registration";
import type {
  TeacherRegistrationApiResponse,
  TeacherRegistrationFieldName,
  TeacherRegistrationFormState,
} from "@/lib/types";

type TeacherFieldName = TeacherRegistrationFieldName;

const errorMessages: Record<TeacherFieldName, string> = {
  fullName: "Enter your full name.",
  gender: "Select your gender.",
  age: "Enter an age between 16 and 99.",
  address: "Enter your residential address.",
  whatsappNumber: "Enter a valid 8-digit WhatsApp number.",
  email: "Enter a valid email address.",
  islamicStudiesQualifications: "Tell us about your Islamic studies qualifications.",
  currentlyTeaching: "Select whether you are currently teaching.",
  currentTeachingLocation: "Enter where you are currently teaching.",
  teachingExperience: "Select your teaching experience.",
  ageGroups: "Select at least one age group.",
  subjects: "Select at least one subject.",
  languages: "Select at least one teaching language.",
  availableDays: "Select at least one available day.",
  classesPerWeek: "Select how many classes you can teach each week.",
  hasInternetAndDevice: "Select whether you have reliable internet and a suitable device.",
  comfortableOnline: "Select whether you are comfortable teaching online.",
  teachingMotivation: "Tell us why you would like to teach with Maktab.mu.",
  declarationConfirmed: "Confirm the declaration before submitting.",
};

function getInvalidFields(formData: FormData) {
  const invalidFields = new Set<TeacherFieldName>();
  const requiredTextFields: TeacherFieldName[] = [
    "fullName",
    "address",
    "islamicStudiesQualifications",
    "teachingMotivation",
  ];

  for (const fieldName of requiredTextFields) {
    if (!String(formData.get(fieldName) ?? "").trim()) {
      invalidFields.add(fieldName);
    }
  }

  const age = Number(formData.get("age"));
  if (!Number.isInteger(age) || age < 16 || age > 99) {
    invalidFields.add("age");
  }

  const email = String(formData.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    invalidFields.add("email");
  }

  const whatsappNumber = String(formData.get("whatsappNumber") ?? "").trim();
  const whatsappDigits = whatsappNumber.replace(/\D/g, "");
  if (!/^[\d\s()-]+$/.test(whatsappNumber) || whatsappDigits.length !== 8) {
    invalidFields.add("whatsappNumber");
  }

  const requiredChoices: TeacherFieldName[] = [
    "gender",
    "currentlyTeaching",
    "teachingExperience",
    "classesPerWeek",
    "hasInternetAndDevice",
    "comfortableOnline",
  ];
  for (const fieldName of requiredChoices) {
    if (!formData.get(fieldName)) {
      invalidFields.add(fieldName);
    }
  }

  const requiredMultiSelectFields: TeacherFieldName[] = ["ageGroups", "subjects", "languages", "availableDays"];
  for (const fieldName of requiredMultiSelectFields) {
    if (formData.getAll(fieldName).length === 0) {
      invalidFields.add(fieldName);
    }
  }

  if (formData.get("currentlyTeaching") === "yes" && !String(formData.get("currentTeachingLocation") ?? "").trim()) {
    invalidFields.add("currentTeachingLocation");
  }

  if (formData.get("declarationConfirmed") !== "yes") {
    invalidFields.add("declarationConfirmed");
  }

  return invalidFields;
}

interface FormSectionProps {
  number: string;
  title: string;
  description?: string;
  children: ReactNode;
}

function FormSection({ number, title, description, children }: FormSectionProps) {
  return (
    <section className="border-t border-border pt-8 first:border-t-0 first:pt-0">
      <div className="mb-6 flex items-start gap-4">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-ocean">
          {number}
        </span>
        <div>
          <h2 className="font-heading text-2xl text-deep sm:text-3xl">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

interface CheckboxGroupProps {
  label: string;
  name: string;
  options: string[];
  description?: string;
  invalid?: boolean;
}

function CheckboxGroup({ label, name, options, description, invalid = false }: CheckboxGroupProps) {
  return (
    <FieldSet aria-invalid={invalid}>
      <FieldLegend>{label}</FieldLegend>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const id = `${name}-${option.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`;

          return (
            <label
              key={option}
              htmlFor={id}
              className="flex min-h-11 items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary/50 has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/20"
            >
              <input id={id} name={name} value={option} type="checkbox" aria-invalid={invalid} className="size-4 accent-ocean" />
              {option}
            </label>
          );
        })}
      </div>
      {invalid ? <FieldError>{errorMessages[name as TeacherFieldName]}</FieldError> : null}
    </FieldSet>
  );
}

function RadioOption({ id, name, value, label, required = false }: { id: string; name: string; value: string; label: string; required?: boolean }) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-11 items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary/50 has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/20"
    >
      <input id={id} name={name} value={value} type="radio" required={required} className="size-4 accent-ocean" />
      {label}
    </label>
  );
}

export function TeacherRegistrationForm() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [invalidFields, setInvalidFields] = useState<Set<TeacherFieldName>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const submissionInProgress = useRef(false);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (hasSubmitted) {
      successHeadingRef.current?.focus();
    }
  }, [hasSubmitted]);

  function hasInvalidField(fieldName: TeacherFieldName) {
    return invalidFields.has(fieldName);
  }

  function handleFormChange(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const fieldsThatAreStillInvalid = getInvalidFields(formData);

    setInvalidFields((currentInvalidFields) => {
      const nextInvalidFields = new Set<TeacherFieldName>();

      for (const fieldName of currentInvalidFields) {
        if (fieldsThatAreStillInvalid.has(fieldName)) {
          nextInvalidFields.add(fieldName);
        }
      }

      return nextInvalidFields;
    });
    setSubmissionError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submissionInProgress.current) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const nextInvalidFields = getInvalidFields(formData);
    if (nextInvalidFields.size > 0) {
      setInvalidFields(nextInvalidFields);
      setHasSubmitted(false);
      setSubmissionError("");
      return;
    }

    setInvalidFields(new Set());
    setSubmissionError("");
    setIsSubmitting(true);
    submissionInProgress.current = true;

    const registration: TeacherRegistrationFormState = {
      fullName: String(formData.get("fullName") ?? ""),
      gender: String(formData.get("gender") ?? ""),
      age: String(formData.get("age") ?? ""),
      address: String(formData.get("address") ?? ""),
      whatsappNumber: String(formData.get("whatsappNumber") ?? ""),
      email: String(formData.get("email") ?? ""),
      islamicStudiesQualifications: String(
        formData.get("islamicStudiesQualifications") ?? "",
      ),
      quranTajwidQualifications: String(
        formData.get("quranTajwidQualifications") ?? "",
      ),
      currentlyTeaching: String(formData.get("currentlyTeaching") ?? ""),
      currentTeachingLocation: String(
        formData.get("currentTeachingLocation") ?? "",
      ),
      teachingExperience: String(formData.get("teachingExperience") ?? ""),
      ageGroups: formData.getAll("ageGroups").map(String),
      subjects: formData.getAll("subjects").map(String),
      otherSubjects: String(formData.get("otherSubjects") ?? ""),
      languages: formData.getAll("languages").map(String),
      otherLanguage: String(formData.get("otherLanguage") ?? ""),
      availableDays: formData.getAll("availableDays").map(String),
      preferredTeachingTimes: String(formData.get("preferredTeachingTimes") ?? ""),
      classesPerWeek: String(formData.get("classesPerWeek") ?? ""),
      hasInternetAndDevice: String(formData.get("hasInternetAndDevice") ?? ""),
      comfortableOnline: String(formData.get("comfortableOnline") ?? ""),
      teachingMotivation: String(formData.get("teachingMotivation") ?? ""),
      additionalInformation: String(formData.get("additionalInformation") ?? ""),
      declarationConfirmed: formData.get("declarationConfirmed") === "yes",
    };

    try {
      const response = await fetch("/api/teacher-registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registration),
      });
      const result = (await response.json()) as TeacherRegistrationApiResponse;

      if (!response.ok || !result.success) {
        if (result.success === false && result.error === "INVALID_REGISTRATION") {
          setInvalidFields(new Set(result.invalidFields ?? []));
          setSubmissionError(
            result.invalidFields?.length
              ? "Please correct the highlighted fields before registering."
              : "Please review your details and try again.",
          );
        } else {
          setSubmissionError(
            "We could not submit your registration. Please try again.",
          );
        }

        return;
      }

      setSubmittedName(registration.fullName.trim());
      setHasSubmitted(true);
    } catch {
      setSubmissionError(
        "We could not submit your registration. Please try again.",
      );
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-4xl bg-card py-8 shadow-[0_1.5rem_4rem_rgb(8_47_56_/_0.1)] sm:py-10">
      <CardContent>
        {hasSubmitted ? (
          <div className="flex min-h-[32rem] flex-col items-center justify-center gap-4 text-center" role="status">
            <span className="grid size-20 place-items-center rounded-full bg-ocean text-ocean-foreground">
              <CheckIcon className="size-10" aria-hidden="true" />
            </span>
            <p className="eyebrow">Registration received</p>
            <h2 ref={successHeadingRef} tabIndex={-1} className="font-heading text-4xl text-deep outline-none">
              Thank you, {submittedName}.
            </h2>
            <p className="max-w-lg text-muted-foreground">
              We have received your teacher registration and will be in touch if we need any further information.
            </p>
          </div>
        ) : (
        <form
          className="space-y-10"
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          aria-busy={isSubmitting}
          noValidate
        >
          {invalidFields.size > 0 || submissionError ? (
            <FieldError className="border-l-4 border-destructive bg-destructive/10 p-3">
              {submissionError || "Please correct the highlighted fields before registering."}
            </FieldError>
          ) : null}
          <FormSection number="01" title="Your details">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field className="sm:col-span-2" data-invalid={hasInvalidField("fullName")}>
                <FieldLabel htmlFor="full-name">Full name <span aria-hidden="true">*</span></FieldLabel>
                <Input id="full-name" name="fullName" autoComplete="name" aria-invalid={hasInvalidField("fullName")} />
                {hasInvalidField("fullName") ? <FieldError>{errorMessages.fullName}</FieldError> : null}
              </Field>
              <Field data-invalid={hasInvalidField("age")}>
                <FieldLabel htmlFor="age">Age <span aria-hidden="true">*</span></FieldLabel>
                <Input id="age" name="age" type="number" min="16" inputMode="numeric" aria-invalid={hasInvalidField("age")} />
                {hasInvalidField("age") ? <FieldError>{errorMessages.age}</FieldError> : null}
              </Field>
              <FieldSet aria-invalid={hasInvalidField("gender")}>
                <FieldLegend>Gender <span aria-hidden="true">*</span></FieldLegend>
                <div className="grid grid-cols-2 gap-2">
                  <RadioOption id="gender-male" name="gender" value="male" label="Male" required />
                  <RadioOption id="gender-female" name="gender" value="female" label="Female" />
                </div>
                {hasInvalidField("gender") ? <FieldError>{errorMessages.gender}</FieldError> : null}
              </FieldSet>
              <Field className="sm:col-span-2" data-invalid={hasInvalidField("address")}>
                <FieldLabel htmlFor="address">Residential address <span aria-hidden="true">*</span></FieldLabel>
                <Textarea id="address" name="address" autoComplete="street-address" aria-invalid={hasInvalidField("address")} />
                {hasInvalidField("address") ? <FieldError>{errorMessages.address}</FieldError> : null}
              </Field>
              <Field data-invalid={hasInvalidField("whatsappNumber")}>
                <FieldLabel htmlFor="whatsapp-number">WhatsApp number <span aria-hidden="true">*</span></FieldLabel>
                <Input id="whatsapp-number" name="whatsappNumber" type="tel" autoComplete="tel" placeholder="e.g. 5900 0000" aria-invalid={hasInvalidField("whatsappNumber")} />
                {hasInvalidField("whatsappNumber") ? <FieldError>{errorMessages.whatsappNumber}</FieldError> : null}
              </Field>
              <Field data-invalid={hasInvalidField("email")}>
                <FieldLabel htmlFor="email">Email address <span aria-hidden="true">*</span></FieldLabel>
                <Input id="email" name="email" type="email" autoComplete="email" placeholder="name@example.com" aria-invalid={hasInvalidField("email")} />
                {hasInvalidField("email") ? <FieldError>{errorMessages.email}</FieldError> : null}
              </Field>
            </div>
          </FormSection>

          <FormSection number="02" title="Islamic education" description="Share the qualifications that help us understand your teaching background.">
            <div className="grid gap-5">
              <Field data-invalid={hasInvalidField("islamicStudiesQualifications")}>
                <FieldLabel htmlFor="islamic-studies">Islamic studies qualifications <span aria-hidden="true">*</span></FieldLabel>
                <FieldDescription>Mention the Madrasah, Dārul ‘Ulūm or institute, qualification obtained and year completed.</FieldDescription>
                <Textarea id="islamic-studies" name="islamicStudiesQualifications" aria-invalid={hasInvalidField("islamicStudiesQualifications")} />
                {hasInvalidField("islamicStudiesQualifications") ? <FieldError>{errorMessages.islamicStudiesQualifications}</FieldError> : null}
              </Field>
              <Field>
                <FieldLabel htmlFor="quran-tajwid">Qur’ān and Tajwīd qualifications</FieldLabel>
                <Textarea id="quran-tajwid" name="quranTajwidQualifications" />
              </Field>
            </div>
          </FormSection>

          <FormSection number="03" title="Teaching experience">
            <div className="grid gap-6">
              <FieldSet aria-invalid={hasInvalidField("currentlyTeaching")}>
                <FieldLegend>Are you currently teaching in a Maktab or Madrasah? <span aria-hidden="true">*</span></FieldLegend>
                <div className="grid grid-cols-2 gap-2 sm:max-w-sm">
                  <RadioOption id="currently-teaching-yes" name="currentlyTeaching" value="yes" label="Yes" required />
                  <RadioOption id="currently-teaching-no" name="currentlyTeaching" value="no" label="No" />
                </div>
                {hasInvalidField("currentlyTeaching") ? <FieldError>{errorMessages.currentlyTeaching}</FieldError> : null}
              </FieldSet>
              <Field data-invalid={hasInvalidField("currentTeachingLocation")}>
                <FieldLabel htmlFor="current-teaching-location">If yes, where are you currently teaching?</FieldLabel>
                <Input id="current-teaching-location" name="currentTeachingLocation" aria-invalid={hasInvalidField("currentTeachingLocation")} />
                {hasInvalidField("currentTeachingLocation") ? <FieldError>{errorMessages.currentTeachingLocation}</FieldError> : null}
              </Field>
              <FieldSet aria-invalid={hasInvalidField("teachingExperience")}>
                <FieldLegend>Teaching experience <span aria-hidden="true">*</span></FieldLegend>
                <div className="grid grid-cols-2 gap-2 sm:max-w-sm">
                  <RadioOption id="experience-yes" name="teachingExperience" value="yes" label="Yes" required />
                  <RadioOption id="experience-no" name="teachingExperience" value="no" label="No" />
                </div>
                {hasInvalidField("teachingExperience") ? <FieldError>{errorMessages.teachingExperience}</FieldError> : null}
              </FieldSet>
              <CheckboxGroup label="Which age groups are you comfortable teaching?" name="ageGroups" options={[...teacherAgeGroups]} description="You may select more than one." invalid={hasInvalidField("ageGroups")} />
              <CheckboxGroup label="Which subjects can you teach confidently?" name="subjects" options={[...teacherSubjects]} description="You may select more than one." invalid={hasInvalidField("subjects")} />
              <Field>
                <FieldLabel htmlFor="other-subjects">Other subjects</FieldLabel>
                <Input id="other-subjects" name="otherSubjects" placeholder="Add another subject" />
              </Field>
            </div>
          </FormSection>

          <FormSection number="04" title="Availability and online teaching">
            <div className="grid gap-6">
              <CheckboxGroup label="Languages in which you can teach" name="languages" options={[...teacherLanguages]} invalid={hasInvalidField("languages")} />
              <Field>
                <FieldLabel htmlFor="other-language">Other language</FieldLabel>
                <Input id="other-language" name="otherLanguage" placeholder="Add another language" />
              </Field>
              <CheckboxGroup label="Days you are available to teach" name="availableDays" options={[...teacherAvailableDays]} invalid={hasInvalidField("availableDays")} />
              <Field>
                <FieldLabel htmlFor="teaching-times">Preferred teaching times</FieldLabel>
                <Textarea id="teaching-times" name="preferredTeachingTimes" placeholder="e.g. Weekdays after 4:00 pm, Saturday mornings" />
              </Field>
              <FieldSet aria-invalid={hasInvalidField("classesPerWeek")}>
                <FieldLegend>Approximately how many classes per week can you teach? <span aria-hidden="true">*</span></FieldLegend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {["1", "2", "3", "4", "5 or more"].map((option, index) => (
                    <RadioOption key={option} id={`classes-${index}`} name="classesPerWeek" value={option} label={option} required={index === 0} />
                  ))}
                </div>
                {hasInvalidField("classesPerWeek") ? <FieldError>{errorMessages.classesPerWeek}</FieldError> : null}
              </FieldSet>
              <div className="grid gap-6 sm:grid-cols-2">
                <FieldSet aria-invalid={hasInvalidField("hasInternetAndDevice")}>
                  <FieldLegend>Reliable internet connection and suitable device? <span aria-hidden="true">*</span></FieldLegend>
                  <div className="grid grid-cols-2 gap-2">
                    <RadioOption id="internet-yes" name="hasInternetAndDevice" value="yes" label="Yes" required />
                    <RadioOption id="internet-no" name="hasInternetAndDevice" value="no" label="No" />
                  </div>
                  {hasInvalidField("hasInternetAndDevice") ? <FieldError>{errorMessages.hasInternetAndDevice}</FieldError> : null}
                </FieldSet>
                <FieldSet aria-invalid={hasInvalidField("comfortableOnline")}>
                  <FieldLegend>Comfortable using online teaching platforms? <span aria-hidden="true">*</span></FieldLegend>
                  <div className="grid grid-cols-2 gap-2">
                    <RadioOption id="online-comfort-yes" name="comfortableOnline" value="yes" label="Yes" required />
                    <RadioOption id="online-comfort-no" name="comfortableOnline" value="no" label="No" />
                  </div>
                  {hasInvalidField("comfortableOnline") ? <FieldError>{errorMessages.comfortableOnline}</FieldError> : null}
                </FieldSet>
              </div>
            </div>
          </FormSection>

          <FormSection number="05" title="Your intention">
            <div className="grid gap-5">
              <Field data-invalid={hasInvalidField("teachingMotivation")}>
                <FieldLabel htmlFor="motivation">Why would you like to teach with Maktab.mu? <span aria-hidden="true">*</span></FieldLabel>
                <Textarea id="motivation" name="teachingMotivation" aria-invalid={hasInvalidField("teachingMotivation")} />
                {hasInvalidField("teachingMotivation") ? <FieldError>{errorMessages.teachingMotivation}</FieldError> : null}
              </Field>
              <Field>
                <FieldLabel htmlFor="additional-information">Anything else you would like us to know?</FieldLabel>
                <Textarea id="additional-information" name="additionalInformation" />
              </Field>
              <label data-invalid={hasInvalidField("declarationConfirmed")} className="flex items-start gap-3 rounded-lg border border-border bg-secondary/50 p-4 text-sm leading-6 has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/20 data-[invalid=true]:border-destructive">
                <input name="declarationConfirmed" value="yes" type="checkbox" aria-invalid={hasInvalidField("declarationConfirmed")} className="mt-1 size-4 shrink-0 accent-ocean" />
                <span>I confirm that the information provided is correct. I understand that registration does not guarantee appointment and that Maktab.mu may conduct an interview or assessment before appointing as a teacher.</span>
              </label>
              {hasInvalidField("declarationConfirmed") ? <FieldError>{errorMessages.declarationConfirmed}</FieldError> : null}
            </div>
          </FormSection>

          <div className="flex flex-col items-start gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Fields marked with <span className="font-bold text-primary-hover">*</span> are required.</p>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Submitting…" : "Register as a teacher"}
            </Button>
          </div>
        </form>
        )}
      </CardContent>
    </Card>
  );
}
