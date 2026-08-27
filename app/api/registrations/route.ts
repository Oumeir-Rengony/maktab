import { NextResponse } from "next/server";

import siteData from "@/data/data.json";
import { addRegistration } from "@/lib/google-sheets";
import {
  getInvalidRegistrationFields,
  normalizeRegistration,
  parseRegistrationSubmission,
} from "@/lib/registration";
import type {
  FormOption,
  RegistrationApiResponse,
  RegistrationFieldName,
} from "@/lib/types";

export const runtime = "nodejs";

function invalidRegistrationResponse(invalidFields: RegistrationFieldName[]) {
  return NextResponse.json<RegistrationApiResponse>(
    {
      success: false,
      error: "INVALID_REGISTRATION",
      invalidFields,
    },
    { status: 400 },
  );
}

function findOptionLabel(options: readonly FormOption[], value: string) {
  return options.find((option) => option.value === value)?.label;
}

export async function POST(request: Request) {
  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return invalidRegistrationResponse([]);
  }

  const registration = parseRegistrationSubmission(requestBody);
  if (!registration) {
    return invalidRegistrationResponse([]);
  }

  const registrationData = siteData.registration;
  const invalidFields = getInvalidRegistrationFields(
    registration,
    registrationData.courseOptions,
    registrationData.relationshipOptions,
  );
  if (invalidFields.length > 0) {
    return invalidRegistrationResponse(invalidFields);
  }

  const courseLabel = findOptionLabel(
    registrationData.courseOptions,
    registration.course,
  );
  const relationshipLabel = findOptionLabel(
    registrationData.relationshipOptions,
    registration.relationship,
  );
  if (!courseLabel || !relationshipLabel) {
    return invalidRegistrationResponse(["course", "relationship"]);
  }

  const normalizedRegistration = normalizeRegistration(registration);

  try {
    await addRegistration({
      course: courseLabel,
      studentName: normalizedRegistration.studentName,
      studentAge: Number(normalizedRegistration.studentAge),
      residence: normalizedRegistration.residence,
      previousMadrassah: normalizedRegistration.previousMadrassah,
      studyDuration: normalizedRegistration.studyDuration,
      quranProgress: normalizedRegistration.quranProgress,
      surahProgress: normalizedRegistration.surahProgress,
      responsibleName: normalizedRegistration.responsibleName,
      responsibleEmail: normalizedRegistration.responsibleEmail,
      responsiblePhone: normalizedRegistration.responsiblePhone,
      relationship: relationshipLabel,
    });
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.error("Registration append failed:", errorName);

    return NextResponse.json<RegistrationApiResponse>(
      {
        success: false,
        error: "SUBMISSION_FAILED",
      },
      { status: 500 },
    );
  }

  return NextResponse.json<RegistrationApiResponse>({ success: true });
}
