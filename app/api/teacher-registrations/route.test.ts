import { beforeEach, describe, expect, it, vi } from "vitest";

const sheets = vi.hoisted(() => ({
  addTeacherRegistration: vi.fn(),
}));

vi.mock("@/lib/google-sheets", () => sheets);

import { POST } from "@/app/api/teacher-registrations/route";

function createValidRequestBody() {
  return {
    fullName: "Amina Noor",
    gender: "female",
    age: "29",
    address: "Port Louis",
    whatsappNumber: "5900 1234",
    email: "amina@example.com",
    islamicStudiesQualifications: "Alimah programme",
    quranTajwidQualifications: "Ijazah",
    currentlyTeaching: "yes",
    currentTeachingLocation: "Noor Madrasah",
    teachingExperience: "yes",
    ageGroups: ["5–7 years"],
    subjects: ["Qur’ān Reading"],
    otherSubjects: "",
    languages: ["English"],
    otherLanguage: "",
    availableDays: ["Saturday"],
    preferredTeachingTimes: "Saturday mornings",
    classesPerWeek: "3",
    hasInternetAndDevice: "yes",
    comfortableOnline: "yes",
    teachingMotivation: "I would like to teach.",
    additionalInformation: "",
    declarationConfirmed: true,
  };
}

function createRequest(body: unknown) {
  return new Request("http://localhost/api/teacher-registrations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/teacher-registrations", () => {
  beforeEach(() => {
    sheets.addTeacherRegistration.mockReset();
  });

  it("appends a normalized teacher registration", async () => {
    sheets.addTeacherRegistration.mockResolvedValue(undefined);

    const response = await POST(createRequest(createValidRequestBody()));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(sheets.addTeacherRegistration).toHaveBeenCalledWith(
      expect.objectContaining({
        gender: "Female",
        currentlyTeaching: "Yes — Noor Madrasah",
        subjects: "Qur’ān Reading",
        languages: "English",
      }),
    );
  });

  it("returns invalid fields without appending", async () => {
    const invalidBody = createValidRequestBody();
    invalidBody.currentTeachingLocation = "";

    const response = await POST(createRequest(invalidBody));
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result).toMatchObject({
      success: false,
      error: "INVALID_REGISTRATION",
    });
    expect(result.invalidFields).toContain("currentTeachingLocation");
    expect(sheets.addTeacherRegistration).not.toHaveBeenCalled();
  });

  it("returns a generic failure when the sheet append fails", async () => {
    sheets.addTeacherRegistration.mockRejectedValue(new Error("Unavailable"));

    const response = await POST(createRequest(createValidRequestBody()));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      success: false,
      error: "SUBMISSION_FAILED",
    });
  });
});
