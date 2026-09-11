import type {
  TeacherRegistrationFieldName,
  TeacherRegistrationFormState,
} from "@/lib/types";
import type { TeacherSheetRegistration } from "@/lib/google-sheets";

export const teacherAgeGroups = [
  "5–7 years",
  "8–10 years",
  "11–13 years",
  "14 years and above",
] as const;

export const teacherSubjects = [
  "Qur’ān Reading",
  "Tajwīd",
  "Du‘ās",
  "Hadīth",
  "Fiqh/Masā’il",
  "‘Aqīdah/Īmāniyāt",
  "Sīrah",
  "Islamic History",
  "Akhlāq & Ādāb",
] as const;

export const teacherLanguages = [
  "English",
  "French",
  "Mauritian Creole",
] as const;

export const teacherAvailableDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const teacherGenderLabels = {
  male: "Male",
  female: "Female",
} as const;

const teacherClassOptions = ["1", "2", "3", "4", "5 or more"] as const;

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isTeacherRegistrationSubmission(
  values: Partial<TeacherRegistrationFormState>,
): values is TeacherRegistrationFormState {
  return (
    isString(values.fullName) &&
    isString(values.gender) &&
    isString(values.age) &&
    isString(values.address) &&
    isString(values.whatsappNumber) &&
    isString(values.email) &&
    isString(values.islamicStudiesQualifications) &&
    isString(values.quranTajwidQualifications) &&
    isString(values.currentlyTeaching) &&
    isString(values.currentTeachingLocation) &&
    isString(values.teachingExperience) &&
    isStringArray(values.ageGroups) &&
    isStringArray(values.subjects) &&
    isString(values.otherSubjects) &&
    isStringArray(values.languages) &&
    isString(values.otherLanguage) &&
    isStringArray(values.availableDays) &&
    isString(values.preferredTeachingTimes) &&
    isString(values.classesPerWeek) &&
    isString(values.hasInternetAndDevice) &&
    isString(values.comfortableOnline) &&
    isString(values.teachingMotivation) &&
    isString(values.additionalInformation) &&
    typeof values.declarationConfirmed === "boolean"
  );
}

function isOneOf<T extends readonly string[]>(value: string, options: T) {
  return options.includes(value as T[number]);
}

function addInvalidField(
  invalidFields: TeacherRegistrationFieldName[],
  fieldName: TeacherRegistrationFieldName,
) {
  if (!invalidFields.includes(fieldName)) {
    invalidFields.push(fieldName);
  }
}

function hasValidSelections(
  selections: string[],
  options: readonly string[],
) {
  if (selections.length === 0) {
    return false;
  }

  return selections.every((selection) => options.includes(selection));
}

function trimSelections(selections: string[]) {
  return selections.map((selection) => selection.trim());
}

function joinSelections(selections: string[], otherSelection: string) {
  const values = [...selections];
  if (otherSelection) {
    values.push(otherSelection);
  }

  return values.join(", ");
}

export function parseTeacherRegistrationSubmission(
  input: unknown,
): TeacherRegistrationFormState | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return null;
  }

  const values = input as Partial<TeacherRegistrationFormState>;
  if (!isTeacherRegistrationSubmission(values)) {
    return null;
  }

  return {
    fullName: values.fullName.trim(),
    gender: values.gender.trim(),
    age: values.age.trim(),
    address: values.address.trim(),
    whatsappNumber: values.whatsappNumber.trim(),
    email: values.email.trim(),
    islamicStudiesQualifications: values.islamicStudiesQualifications.trim(),
    quranTajwidQualifications: values.quranTajwidQualifications.trim(),
    currentlyTeaching: values.currentlyTeaching.trim(),
    currentTeachingLocation: values.currentTeachingLocation.trim(),
    teachingExperience: values.teachingExperience.trim(),
    ageGroups: trimSelections(values.ageGroups),
    subjects: trimSelections(values.subjects),
    otherSubjects: values.otherSubjects.trim(),
    languages: trimSelections(values.languages),
    otherLanguage: values.otherLanguage.trim(),
    availableDays: trimSelections(values.availableDays),
    preferredTeachingTimes: values.preferredTeachingTimes.trim(),
    classesPerWeek: values.classesPerWeek.trim(),
    hasInternetAndDevice: values.hasInternetAndDevice.trim(),
    comfortableOnline: values.comfortableOnline.trim(),
    teachingMotivation: values.teachingMotivation.trim(),
    additionalInformation: values.additionalInformation.trim(),
    declarationConfirmed: values.declarationConfirmed,
  };
}

export function getInvalidTeacherRegistrationFields(
  registration: TeacherRegistrationFormState,
) {
  const invalidFields: TeacherRegistrationFieldName[] = [];
  const requiredTextValues: Array<
    [TeacherRegistrationFieldName, string]
  > = [
    ["fullName", registration.fullName],
    ["address", registration.address],
    ["islamicStudiesQualifications", registration.islamicStudiesQualifications],
    ["teachingMotivation", registration.teachingMotivation],
  ];

  for (const [fieldName, fieldValue] of requiredTextValues) {
    if (!fieldValue.trim()) {
      invalidFields.push(fieldName);
    }
  }

  const age = Number(registration.age);
  if (!Number.isInteger(age) || age < 16 || age > 99) {
    addInvalidField(invalidFields, "age");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registration.email)) {
    addInvalidField(invalidFields, "email");
  }

  const whatsappDigits = registration.whatsappNumber.replace(/\D/g, "");
  const hasValidWhatsappCharacters = /^[\d\s()-]+$/.test(
    registration.whatsappNumber,
  );
  if (!hasValidWhatsappCharacters || whatsappDigits.length !== 8) {
    addInvalidField(invalidFields, "whatsappNumber");
  }

  if (!(registration.gender in teacherGenderLabels)) {
    addInvalidField(invalidFields, "gender");
  }

  if (registration.currentlyTeaching !== "yes" && registration.currentlyTeaching !== "no") {
    addInvalidField(invalidFields, "currentlyTeaching");
  }

  if (
    registration.currentlyTeaching === "yes" &&
    !registration.currentTeachingLocation.trim()
  ) {
    addInvalidField(invalidFields, "currentTeachingLocation");
  }

  if (
    registration.teachingExperience !== "yes" &&
    registration.teachingExperience !== "no"
  ) {
    addInvalidField(invalidFields, "teachingExperience");
  }

  if (!isOneOf(registration.classesPerWeek, teacherClassOptions)) {
    addInvalidField(invalidFields, "classesPerWeek");
  }

  if (
    registration.hasInternetAndDevice !== "yes" &&
    registration.hasInternetAndDevice !== "no"
  ) {
    addInvalidField(invalidFields, "hasInternetAndDevice");
  }

  if (
    registration.comfortableOnline !== "yes" &&
    registration.comfortableOnline !== "no"
  ) {
    addInvalidField(invalidFields, "comfortableOnline");
  }

  if (!hasValidSelections(registration.ageGroups, teacherAgeGroups)) {
    addInvalidField(invalidFields, "ageGroups");
  }

  if (!hasValidSelections(registration.subjects, teacherSubjects)) {
    addInvalidField(invalidFields, "subjects");
  }

  if (!hasValidSelections(registration.languages, teacherLanguages)) {
    addInvalidField(invalidFields, "languages");
  }

  if (!hasValidSelections(registration.availableDays, teacherAvailableDays)) {
    addInvalidField(invalidFields, "availableDays");
  }

  if (!registration.declarationConfirmed) {
    addInvalidField(invalidFields, "declarationConfirmed");
  }

  return invalidFields;
}

export function normalizeTeacherRegistration(
  registration: TeacherRegistrationFormState,
): TeacherRegistrationFormState {
  const normalizedRegistration = {
    ...registration,
    fullName: registration.fullName.trim(),
    address: registration.address.trim(),
    whatsappNumber: registration.whatsappNumber.replace(/\D/g, ""),
    email: registration.email.trim(),
    islamicStudiesQualifications: registration.islamicStudiesQualifications.trim(),
    quranTajwidQualifications: registration.quranTajwidQualifications.trim(),
    currentTeachingLocation: registration.currentTeachingLocation.trim(),
    ageGroups: trimSelections(registration.ageGroups),
    subjects: trimSelections(registration.subjects),
    otherSubjects: registration.otherSubjects.trim(),
    languages: trimSelections(registration.languages),
    otherLanguage: registration.otherLanguage.trim(),
    availableDays: trimSelections(registration.availableDays),
    preferredTeachingTimes: registration.preferredTeachingTimes.trim(),
    teachingMotivation: registration.teachingMotivation.trim(),
    additionalInformation: registration.additionalInformation.trim(),
  };

  normalizedRegistration.whatsappNumber = `${normalizedRegistration.whatsappNumber.slice(0, 4)} ${normalizedRegistration.whatsappNumber.slice(4)}`;

  if (normalizedRegistration.currentlyTeaching === "no") {
    normalizedRegistration.currentTeachingLocation = "";
  }

  return normalizedRegistration;
}

export function getTeacherSheetRegistration(
  registration: TeacherRegistrationFormState,
): TeacherSheetRegistration {
  const currentlyTeaching =
    registration.currentlyTeaching === "yes"
      ? `Yes — ${registration.currentTeachingLocation}`
      : "No";

  return {
    fullName: registration.fullName,
    gender: teacherGenderLabels[registration.gender as keyof typeof teacherGenderLabels],
    age: Number(registration.age),
    address: registration.address,
    whatsappNumber: registration.whatsappNumber,
    email: registration.email,
    islamicStudiesQualifications: registration.islamicStudiesQualifications,
    quranTajwidQualifications: registration.quranTajwidQualifications,
    currentlyTeaching,
    currentTeachingLocation: registration.currentTeachingLocation,
    teachingExperience: registration.teachingExperience === "yes" ? "Yes" : "No",
    ageGroups: registration.ageGroups.join(", "),
    subjects: joinSelections(registration.subjects, registration.otherSubjects),
    languages: joinSelections(registration.languages, registration.otherLanguage),
    availableDays: registration.availableDays.join(", "),
    preferredTeachingTimes: registration.preferredTeachingTimes,
    classesPerWeek: registration.classesPerWeek,
    hasInternetAndDevice:
      registration.hasInternetAndDevice === "yes" ? "Yes" : "No",
    comfortableOnline: registration.comfortableOnline === "yes" ? "Yes" : "No",
    teachingMotivation: registration.teachingMotivation,
    additionalInformation: registration.additionalInformation,
  };
}
