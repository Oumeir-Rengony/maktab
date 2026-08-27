import type {
  FormOption,
  RegistrationFieldName,
  RegistrationFormState,
} from "@/lib/types";

const registrationFieldNames: RegistrationFieldName[] = [
  "course",
  "studentName",
  "studentAge",
  "responsibleName",
  "responsibleEmail",
  "responsiblePhone",
  "relationship",
  "residence",
  "attendedBefore",
  "previousMadrassah",
  "studyDuration",
  "quranProgress",
  "surahProgress",
];

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

const previousStudyFields: RegistrationFieldName[] = [
  "previousMadrassah",
  "studyDuration",
  "quranProgress",
  "surahProgress",
];

function hasOption(options: readonly FormOption[], value: string) {
  return options.some((option) => option.value === value);
}

function addInvalidField(
  invalidFields: RegistrationFieldName[],
  fieldName: RegistrationFieldName,
) {
  if (!invalidFields.includes(fieldName)) {
    invalidFields.push(fieldName);
  }
}

export function parseRegistrationSubmission(
  input: unknown,
): RegistrationFormState | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return null;
  }

  const values = input as Record<string, unknown>;
  const parsedValues: Partial<RegistrationFormState> = {};

  for (const fieldName of registrationFieldNames) {
    const value = values[fieldName];
    if (typeof value !== "string") {
      return null;
    }

    parsedValues[fieldName] = value.trim();
  }

  return parsedValues as RegistrationFormState;
}

export function getInvalidStudentDetailFields(
  registration: RegistrationFormState,
  courseOptions: readonly FormOption[],
  relationshipOptions: readonly FormOption[],
) {
  const invalidFields: RegistrationFieldName[] = [];

  for (const fieldName of studentDetailFields) {
    if (!registration[fieldName].trim()) {
      invalidFields.push(fieldName);
    }
  }

  const studentAge = Number(registration.studentAge);
  const hasValidAge =
    Number.isInteger(studentAge) && studentAge >= 4 && studentAge <= 99;
  if (!hasValidAge) {
    addInvalidField(invalidFields, "studentAge");
  }

  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    registration.responsibleEmail,
  );
  if (!hasValidEmail) {
    addInvalidField(invalidFields, "responsibleEmail");
  }

  const phoneNumber = registration.responsiblePhone;
  const phoneDigitCount = phoneNumber.replace(/\D/g, "").length;
  const hasValidPhoneCharacters = /^[\d\s()-]+$/.test(phoneNumber);
  const hasValidPhone = hasValidPhoneCharacters && phoneDigitCount === 8;
  if (!hasValidPhone) {
    addInvalidField(invalidFields, "responsiblePhone");
  }

  if (!hasOption(courseOptions, registration.course)) {
    addInvalidField(invalidFields, "course");
  }

  if (!hasOption(relationshipOptions, registration.relationship)) {
    addInvalidField(invalidFields, "relationship");
  }

  return invalidFields;
}

export function getInvalidLearningHistoryFields(
  registration: RegistrationFormState,
) {
  const invalidFields: RegistrationFieldName[] = [];
  const hasValidAttendanceAnswer =
    registration.attendedBefore === "yes" ||
    registration.attendedBefore === "no";

  if (!hasValidAttendanceAnswer) {
    invalidFields.push("attendedBefore");
    return invalidFields;
  }

  if (registration.attendedBefore === "yes") {
    for (const fieldName of previousStudyFields) {
      if (!registration[fieldName].trim()) {
        invalidFields.push(fieldName);
      }
    }
  }

  return invalidFields;
}

export function getInvalidRegistrationFields(
  registration: RegistrationFormState,
  courseOptions: readonly FormOption[],
  relationshipOptions: readonly FormOption[],
) {
  const invalidStudentFields = getInvalidStudentDetailFields(
    registration,
    courseOptions,
    relationshipOptions,
  );
  const invalidHistoryFields = getInvalidLearningHistoryFields(registration);

  return [...invalidStudentFields, ...invalidHistoryFields];
}

export function normalizeRegistration(
  registration: RegistrationFormState,
): RegistrationFormState {
  const normalizedRegistration: RegistrationFormState = {
    ...registration,
  };

  for (const fieldName of registrationFieldNames) {
    normalizedRegistration[fieldName] = registration[fieldName].trim();
  }

  const phoneDigits = normalizedRegistration.responsiblePhone.replace(/\D/g, "");
  normalizedRegistration.responsiblePhone = `${phoneDigits.slice(0, 4)} ${phoneDigits.slice(4)}`;

  if (normalizedRegistration.attendedBefore === "no") {
    normalizedRegistration.previousMadrassah = "N/A";
    normalizedRegistration.studyDuration = "N/A";
    normalizedRegistration.quranProgress = "N/A";
    normalizedRegistration.surahProgress = "N/A";
  }

  return normalizedRegistration;
}
