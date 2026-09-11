import { NextResponse } from "next/server";

import { addTeacherRegistration } from "@/lib/google-sheets";
import {
  getInvalidTeacherRegistrationFields,
  getTeacherSheetRegistration,
  normalizeTeacherRegistration,
  parseTeacherRegistrationSubmission,
} from "@/lib/teacher-registration";
import type {
  TeacherRegistrationApiResponse,
  TeacherRegistrationFieldName,
} from "@/lib/types";

export const runtime = "nodejs";

function invalidRegistrationResponse(
  invalidFields: TeacherRegistrationFieldName[],
) {
  return NextResponse.json<TeacherRegistrationApiResponse>(
    {
      success: false,
      error: "INVALID_REGISTRATION",
      invalidFields,
    },
    { status: 400 },
  );
}

export async function POST(request: Request) {
  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return invalidRegistrationResponse([]);
  }

  const registration = parseTeacherRegistrationSubmission(requestBody);
  if (!registration) {
    return invalidRegistrationResponse([]);
  }

  const invalidFields = getInvalidTeacherRegistrationFields(registration);
  if (invalidFields.length > 0) {
    return invalidRegistrationResponse(invalidFields);
  }

  const normalizedRegistration = normalizeTeacherRegistration(registration);
  const sheetRegistration = getTeacherSheetRegistration(normalizedRegistration);

  try {
    await addTeacherRegistration(sheetRegistration);
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.error("Teacher registration append failed:", errorName);

    return NextResponse.json<TeacherRegistrationApiResponse>(
      {
        success: false,
        error: "SUBMISSION_FAILED",
      },
      { status: 500 },
    );
  }

  return NextResponse.json<TeacherRegistrationApiResponse>({ success: true });
}
