import { describe, expect, it } from "vitest";

import {
  getInvalidTeacherRegistrationFields,
  getTeacherSheetRegistration,
  normalizeTeacherRegistration,
  parseTeacherRegistrationSubmission,
} from "@/lib/teacher-registration";
import type { TeacherRegistrationFormState } from "@/lib/types";

function createValidRegistration(): TeacherRegistrationFormState {
  return {
    fullName: "  Amina Noor  ",
    gender: "female",
    age: "29",
    address: "  Port Louis  ",
    whatsappNumber: "5900-1234",
    email: "  amina@example.com  ",
    islamicStudiesQualifications: "  Alimah programme  ",
    quranTajwidQualifications: "  Ijazah  ",
    currentlyTeaching: "yes",
    currentTeachingLocation: "  Noor Madrasah  ",
    teachingExperience: "yes",
    ageGroups: ["5–7 years", "8–10 years"],
    subjects: ["Qur’ān Reading", "Tajwīd"],
    otherSubjects: "  Arabic grammar  ",
    languages: ["English", "French"],
    otherLanguage: "  Arabic  ",
    availableDays: ["Saturday", "Sunday"],
    preferredTeachingTimes: "  Saturday mornings  ",
    classesPerWeek: "3",
    hasInternetAndDevice: "yes",
    comfortableOnline: "no",
    teachingMotivation: "  I would like to support local students.  ",
    additionalInformation: "  Available from January.  ",
    declarationConfirmed: true,
  };
}

describe("teacher registration", () => {
  it("parses, normalizes, and maps a valid submission to the Teacher row", () => {
    const parsedRegistration = parseTeacherRegistrationSubmission(
      createValidRegistration(),
    );

    expect(parsedRegistration).not.toBeNull();

    const normalizedRegistration = normalizeTeacherRegistration(
      parsedRegistration as TeacherRegistrationFormState,
    );
    expect(getInvalidTeacherRegistrationFields(normalizedRegistration)).toEqual([]);

    expect(getTeacherSheetRegistration(normalizedRegistration)).toEqual({
      fullName: "Amina Noor",
      gender: "Female",
      age: 29,
      address: "Port Louis",
      whatsappNumber: "5900 1234",
      email: "amina@example.com",
      islamicStudiesQualifications: "Alimah programme",
      quranTajwidQualifications: "Ijazah",
      currentlyTeaching: "Yes — Noor Madrasah",
      currentTeachingLocation: "Noor Madrasah",
      teachingExperience: "Yes",
      ageGroups: "5–7 years, 8–10 years",
      subjects: "Qur’ān Reading, Tajwīd, Arabic grammar",
      languages: "English, French, Arabic",
      availableDays: "Saturday, Sunday",
      preferredTeachingTimes: "Saturday mornings",
      classesPerWeek: "3",
      hasInternetAndDevice: "Yes",
      comfortableOnline: "No",
      teachingMotivation: "I would like to support local students.",
      additionalInformation: "Available from January.",
    });
  });

  it("requires a location only when the teacher is currently teaching", () => {
    const registration = createValidRegistration();
    registration.currentTeachingLocation = "";

    expect(getInvalidTeacherRegistrationFields(registration)).toContain(
      "currentTeachingLocation",
    );

    registration.currentlyTeaching = "no";
    expect(getInvalidTeacherRegistrationFields(registration)).not.toContain(
      "currentTeachingLocation",
    );
  });

  it("rejects malformed submissions and unsupported checkbox values", () => {
    expect(parseTeacherRegistrationSubmission({})).toBeNull();

    const registration = createValidRegistration();
    registration.subjects = ["Unsupported subject"];

    expect(getInvalidTeacherRegistrationFields(registration)).toContain("subjects");
  });
});
