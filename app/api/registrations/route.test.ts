import { beforeEach, describe, expect, it, vi } from "vitest";

const sheets = vi.hoisted(() => ({
  addStudentRegistration: vi.fn(),
}));

vi.mock("@/lib/google-sheets", () => sheets);

import { POST } from "@/app/api/registrations/route";

function createRequest(body: unknown) {
  return new Request("http://localhost/api/registrations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/registrations", () => {
  beforeEach(() => {
    sheets.addStudentRegistration.mockReset();
  });

  it("continues to submit a valid student registration", async () => {
    sheets.addStudentRegistration.mockResolvedValue(undefined);

    const response = await POST(
      createRequest({
        course: "quran-beginner",
        studentName: "Yusuf Ali",
        studentAge: "8",
        responsibleName: "Amina Ali",
        responsibleEmail: "amina@example.com",
        responsiblePhone: "5900 1234",
        relationship: "parent",
        residence: "Port Louis",
        attendedBefore: "no",
        previousMadrassah: "",
        studyDuration: "",
        quranProgress: "",
        surahProgress: "",
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(sheets.addStudentRegistration).toHaveBeenCalledWith({
      course: "Qur'an reading — beginner",
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
  });

  it("rejects invalid student registrations without appending", async () => {
    const response = await POST(createRequest({}));

    expect(response.status).toBe(400);
    expect(sheets.addStudentRegistration).not.toHaveBeenCalled();
  });
});
