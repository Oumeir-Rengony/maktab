"use client";

import { useRef, useState } from "react";
import { CheckIcon } from "lucide-react";

import { LearningHistoryStep } from "@/components/registration/learning-history-step";
import { RegistrationProgress } from "@/components/registration/registration-progress";
import { StudentDetailsStep } from "@/components/registration/student-details-step";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field";
import {
  getInvalidLearningHistoryFields,
  getInvalidStudentDetailFields,
} from "@/lib/registration";
import type {
  RegistrationApiResponse,
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
  responsiblePhone: "",
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
  "responsiblePhone",
  "relationship",
  "residence",
];

export function RegistrationForm({ data }: RegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] = useState<RegistrationFormState>(initialFormState);
  const [invalidFields, setInvalidFields] = useState<Set<RegistrationFieldName>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const submissionInProgress = useRef(false);

  function updateField(field: RegistrationFieldName, value: string) {
    setFormState((currentState) => ({ ...currentState, [field]: value }));
    setInvalidFields((currentFields) => {
      const nextFields = new Set(currentFields);
      nextFields.delete(field);
      return nextFields;
    });
    setSubmissionError("");
  }

  function continueToHistory() {
    const invalidStudentFields = getInvalidStudentDetailFields(
      formState,
      data.courseOptions,
      data.relationshipOptions,
    );

    if (invalidStudentFields.length > 0) {
      setInvalidFields(new Set(invalidStudentFields));
      return;
    }

    setInvalidFields(new Set());
    setSubmissionError("");
    setCurrentStep(2);
  }

  async function submitRegistration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submissionInProgress.current) {
      return;
    }

    const invalidStudentFields = getInvalidStudentDetailFields(
      formState,
      data.courseOptions,
      data.relationshipOptions,
    );
    if (invalidStudentFields.length > 0) {
      setInvalidFields(new Set(invalidStudentFields));
      setCurrentStep(1);
      return;
    }

    const invalidHistoryFields = getInvalidLearningHistoryFields(formState);
    if (invalidHistoryFields.length > 0) {
      setInvalidFields(new Set(invalidHistoryFields));
      return;
    }

    setInvalidFields(new Set());
    setSubmissionError("");
    setIsSubmitting(true);
    submissionInProgress.current = true;

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });
      const result = (await response.json()) as RegistrationApiResponse;

      if (!response.ok || !result.success) {
        if (result.success === false && result.error === "INVALID_REGISTRATION") {
          const serverInvalidFields = result.invalidFields ?? [];
          setInvalidFields(new Set(serverInvalidFields));

          const hasInvalidStudentField = serverInvalidFields.some((fieldName) =>
            studentDetailFields.includes(fieldName),
          );
          if (hasInvalidStudentField) {
            setCurrentStep(1);
          }

          if (serverInvalidFields.length === 0) {
            setSubmissionError(data.errorMessage);
          }
        } else {
          setSubmissionError(data.submissionError);
        }

        return;
      }

      setIsComplete(true);
    } catch {
      setSubmissionError(data.submissionError);
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setFormState(initialFormState);
    setInvalidFields(new Set());
    setCurrentStep(1);
    setIsComplete(false);
    setIsSubmitting(false);
    setSubmissionError("");
    submissionInProgress.current = false;
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
        <form
          className="registration-form"
          onSubmit={submitRegistration}
          aria-busy={isSubmitting}
          noValidate
        >
          {invalidFields.size > 0 || submissionError ? (
            <FieldError className="mb-5 border-l-4 border-destructive bg-destructive/10 p-3">
              {submissionError || data.errorMessage}
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
              isSubmitting={isSubmitting}
              onFieldChange={updateField}
              onBack={() => {
                setSubmissionError("");
                setCurrentStep(1);
              }}
            />
          )}
        </form>
      </CardContent>
    </Card>
  );
}
