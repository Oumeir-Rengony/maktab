"use client";

import { useLayoutEffect, useRef, useState } from "react";
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
import { cn } from "@/lib/utils";
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
  const formCardRef = useRef<HTMLDivElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);


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

    formCardRef.current?.scrollIntoView({
      behavior: "auto",
      block: "start",
    });

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

      successHeadingRef.current?.scrollIntoView({
        behavior: "auto",
        block: "center"
      });


      setIsComplete(true);
    } catch {
      setSubmissionError(data.submissionError);
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  }

  // function resetForm() {
  //   setFormState(initialFormState);
  //   setInvalidFields(new Set());
  //   setCurrentStep(1);
  //   setIsComplete(false);
  //   setIsSubmitting(false);
  //   setSubmissionError("");
  //   submissionInProgress.current = false;
  // }

  return (
    <Card
      ref={formCardRef}
      size="registration"
      className="registration-card w-full scroll-mt-24"
    >
      <div className="grid">
        <div
          className={cn(
            "col-start-1 row-start-1 flex flex-col gap-(--card-spacing)",
            isComplete && "invisible pointer-events-none",
          )}
          aria-hidden={isComplete}
          inert={isComplete}
        >
          <CardHeader>
            <RegistrationProgress
              currentStep={currentStep}
              steps={data.steps}
              progressLabel={data.progressLabel}
            />
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

              <div className="grid">
                <div
                  className={cn(
                    "col-start-1 row-start-1",
                    currentStep !== 1 && "invisible pointer-events-none",
                  )}
                  aria-hidden={currentStep !== 1}
                  inert={currentStep !== 1}
                >
                  <StudentDetailsStep
                    data={data}
                    formState={formState}
                    invalidFields={invalidFields}
                    onFieldChange={updateField}
                    onContinue={continueToHistory}
                  />
                </div>
                <div
                  className={cn(
                    "col-start-1 row-start-1",
                    currentStep !== 2 && "invisible pointer-events-none",
                  )}
                  aria-hidden={currentStep !== 2}
                  inert={currentStep !== 2}
                >
                  <LearningHistoryStep
                    data={data}
                    formState={formState}
                    invalidFields={invalidFields}
                    isSubmitting={isSubmitting}
                    onFieldChange={updateField}
                    onBack={() => {
                      formCardRef.current?.scrollIntoView({
                        behavior: "auto",
                        block: "start",
                      });
                      setSubmissionError("");
                      setCurrentStep(1);
                    }}
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </div>

        <CardContent
          className={cn(
            "col-start-1 row-start-1 flex min-h-[32rem] flex-col items-center justify-center gap-4 text-center",
            !isComplete && "invisible pointer-events-none",
          )}
          role="status"
          aria-hidden={!isComplete}
          inert={!isComplete}
        >
          <span className="grid size-20 place-items-center rounded-full bg-ocean text-ocean-foreground">
            <CheckIcon className="size-10" aria-hidden="true" />
          </span>
          <p className="eyebrow">{data.success.eyebrow}</p>
          <h3
            ref={successHeadingRef}
            tabIndex={-1}
            className="font-heading text-4xl outline-none"
          >
            {data.success.titlePrefix}, {formState.studentName}.
          </h3>
          <p className="max-w-lg text-muted-foreground">{data.success.description}</p>
          {/* <Button type="button" variant="link" onClick={resetForm}>
            {data.actions.reset}
          </Button> */}
        </CardContent>
      </div>
    </Card>
  );
}
