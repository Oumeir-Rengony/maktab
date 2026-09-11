import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const googleSheets = vi.hoisted(() => ({
  append: vi.fn(),
  createClient: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("googleapis", () => ({
  google: {
    auth: {
      GoogleAuth: class {},
    },
    sheets: googleSheets.createClient,
  },
}));

import {
  addStudentRegistration,
  addTeacherRegistration,
} from "@/lib/google-sheets";

const originalEnvironment = {
  serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  privateKey: process.env.GOOGLE_PRIVATE_KEY,
  spreadsheetId: process.env.GOOGLE_SHEET_ID,
};

describe("Google Sheets registration appends", () => {
  beforeEach(() => {
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = "service@example.com";
    process.env.GOOGLE_PRIVATE_KEY = "private-key";
    process.env.GOOGLE_SHEET_ID = "spreadsheet-id";
    googleSheets.append.mockReset();
    googleSheets.createClient.mockReset();
    googleSheets.createClient.mockReturnValue({
      spreadsheets: {
        values: {
          append: googleSheets.append,
        },
      },
    });
  });

  afterEach(() => {
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = originalEnvironment.serviceAccountEmail;
    process.env.GOOGLE_PRIVATE_KEY = originalEnvironment.privateKey;
    process.env.GOOGLE_SHEET_ID = originalEnvironment.spreadsheetId;
  });

  it("writes student registrations to the renamed Student tab", async () => {
    await addStudentRegistration({
      course: "Islamic studies",
      studentName: "Yusuf Ali",
      studentAge: 8,
      residence: "Port Louis",
      previousMadrassah: "N/A",
      studyDuration: "N/A",
      quranProgress: "N/A",
      surahProgress: "N/A",
      responsibleName: "Amina Ali",
      responsibleEmail: "amina@example.com",
      responsiblePhone: "5900 1234",
      relationship: "Parent",
    });

    expect(googleSheets.append).toHaveBeenCalledWith(
      expect.objectContaining({
        range: "Student!A3:L",
        requestBody: {
          values: [
            [
              "Islamic studies",
              "Yusuf Ali",
              8,
              "Port Louis",
              "N/A",
              "N/A",
              "N/A",
              "N/A",
              "Amina Ali",
              "amina@example.com",
              "5900 1234",
              "Parent",
            ],
          ],
        },
      }),
    );
  });

  it("writes the complete 21-cell Teacher row with the teaching location in J", async () => {
    await addTeacherRegistration({
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
      ageGroups: "5–7 years",
      subjects: "Qur’ān Reading, Arabic grammar",
      languages: "English, Arabic",
      availableDays: "Saturday",
      preferredTeachingTimes: "Saturday mornings",
      classesPerWeek: "3",
      hasInternetAndDevice: "Yes",
      comfortableOnline: "Yes",
      teachingMotivation: "I would like to teach.",
      additionalInformation: "",
    });

    expect(googleSheets.append).toHaveBeenCalledWith(
      expect.objectContaining({
        range: "Teacher!A3:U",
        requestBody: {
          values: [
            [
              "Amina Noor",
              "Female",
              29,
              "Port Louis",
              "5900 1234",
              "amina@example.com",
              "Alimah programme",
              "Ijazah",
              "Yes — Noor Madrasah",
              "Noor Madrasah",
              "Yes",
              "5–7 years",
              "Qur’ān Reading, Arabic grammar",
              "English, Arabic",
              "Saturday",
              "Saturday mornings",
              "3",
              "Yes",
              "Yes",
              "I would like to teach.",
              "",
            ],
          ],
        },
      }),
    );
  });
});
