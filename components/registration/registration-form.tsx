"use client";

import { useState } from "react";
import { CheckIcon } from "lucide-react";

import { LearningHistoryStep } from "@/components/registration/learning-history-step";
import { RegistrationProgress } from "@/components/registration/registration-progress";
import { StudentDetailsStep } from "@/components/registration/student-details-step";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field";
import type {
  RegistrationData,
  RegistrationFieldName,
  RegistrationFormState,
} from "@/lib/types";

interface RegistrationFormProps {
  data: RegistrationData;
}

const initialFormState: RegistrationFormState = {
  course: "",
  studentName: "",
  studentAge: "",
  responsibleName: "",
  responsibleEmail: "",
  relationship: "",
  residence: "",
  attendedBefore: "",
  previousMadrassah: "",
  studyDuration: "",
  quranProgress: "",
  surahProgress: "",
};

const studentDetailFields: RegistrationFieldName[] = [
  "course",
  "studentName",
  "studentAge",
  "responsibleName",
  "responsibleEmail",
  "relationship",
  "residence",
];

const previousStudyFields: RegistrationFieldName[] = [
  "previousMadrassah",
  "studyDuration",
  "quranProgress",
  "surahProgress",
];

export function RegistrationForm({ data }: RegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] = useState<RegistrationFormState>(initialFormState);
  const [invalidFields, setInvalidFields] = useState<Set<RegistrationFieldName>>(new Set());
  const [isComplete, setIsComplete] = useState(false);

  function updateField(field: RegistrationFieldName, value: string) {
    setFormState((currentState) => ({ ...currentState, [field]: value }));
    setInvalidFields((currentFields) => {
      const nextFields = new Set(currentFields);
      nextFields.delete(field);
      return nextFields;
    });
  }

  function findEmptyFields(fieldNames: RegistrationFieldName[]) {
    return fieldNames.filter((fieldName) => !formState[fieldName].trim());
  }

  function continueToHistory() {
    const emptyFields = findEmptyFields(studentDetailFields);
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.responsibleEmail);
    const age = Number(formState.studentAge);
    const ageIsValid = Number.isInteger(age) && age >= 4 && age <= 99;

    if (!emailIsValid && !emptyFields.includes("responsibleEmail")) {
      emptyFields.push("responsibleEmail");
    }

    if (!ageIsValid && !emptyFields.includes("studentAge")) {
      emptyFields.push("studentAge");
    }

    if (emptyFields.length > 0) {
      setInvalidFields(new Set(emptyFields));
      return;
    }

    setInvalidFields(new Set());
    setCurrentStep(2);
  }

  function submitRegistration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fieldsToValidate: RegistrationFieldName[] = ["attendedBefore"];
    if (formState.attendedBefore === "yes") {
      fieldsToValidate.push(...previousStudyFields);
    }

    const emptyFields = findEmptyFields(fieldsToValidate);
    if (emptyFields.length > 0) {
      setInvalidFields(new Set(emptyFields));
      return;
    }

    setInvalidFields(new Set());
    setIsComplete(true);
  }

  function resetForm() {
    setFormState(initialFormState);
    setInvalidFields(new Set());
    setCurrentStep(1);
    setIsComplete(false);
  }

  if (isComplete) {
    return (
      <Card size="registration" className="registration-card w-full">
        <CardContent className="flex min-h-[32rem] flex-col items-center justify-center gap-4 text-center">
          <span className="grid size-20 place-items-center rounded-full bg-ocean text-ocean-foreground">
            <CheckIcon className="size-10" aria-hidden="true" />
          </span>
          <p className="eyebrow">{data.success.eyebrow}</p>
          <h3 className="font-heading text-4xl">
            {data.success.titlePrefix}, {formState.studentName}.
          </h3>
          <p className="max-w-lg text-muted-foreground">{data.success.description}</p>
          <Button type="button" variant="link" onClick={resetForm}>
            {data.actions.reset}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card size="registration" className="registration-card w-full">
      <CardHeader>
        <RegistrationProgress currentStep={currentStep} steps={data.steps} progressLabel={data.progressLabel} />
      </CardHeader>
      <CardContent>
        <form className="registration-form" onSubmit={submitRegistration} noValidate>
          {invalidFields.size > 0 ? (
            <FieldError className="mb-5 border-l-4 border-destructive bg-destructive/10 p-3">
              {data.errorMessage}
            </FieldError>
          ) : null}

          {currentStep === 1 ? (
            <StudentDetailsStep
              data={data}
              formState={formState}
              invalidFields={invalidFields}
              onFieldChange={updateField}
              onContinue={continueToHistory}
            />
          ) : (
            <LearningHistoryStep
              data={data}
              formState={formState}
              invalidFields={invalidFields}
              onFieldChange={updateField}
              onBack={() => setCurrentStep(1)}
            />
          )}
        </form>
      </CardContent>
    </Card>
  );
}
