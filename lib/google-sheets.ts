import "server-only";

import { google } from "googleapis";

export interface StudentSheetRegistration {
  course: string;
  studentName: string;
  studentAge: number;
  residence: string;
  previousMadrassah: string;
  studyDuration: string;
  quranProgress: string;
  surahProgress: string;
  responsibleName: string;
  responsibleEmail: string;
  responsiblePhone: string;
  relationship: string;
}

export interface TeacherSheetRegistration {
  fullName: string;
  gender: string;
  age: number;
  address: string;
  whatsappNumber: string;
  email: string;
  islamicStudiesQualifications: string;
  quranTajwidQualifications: string;
  currentlyTeaching: string;
  currentTeachingLocation: string;
  teachingExperience: string;
  ageGroups: string;
  subjects: string;
  languages: string;
  availableDays: string;
  preferredTeachingTimes: string;
  classesPerWeek: string;
  hasInternetAndDevice: string;
  comfortableOnline: string;
  teachingMotivation: string;
  additionalInformation: string;
}

const studentSpreadsheetRange = "Student!A3:L";
const teacherSpreadsheetRange = "Teacher!A3:U";
const spreadsheetScope = "https://www.googleapis.com/auth/spreadsheets";

function getRequiredEnvironmentVariable(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function appendRegistration(range: string, values: Array<string | number>) {
  const serviceAccountEmail = getRequiredEnvironmentVariable(
    "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  );
  const privateKey = getRequiredEnvironmentVariable("GOOGLE_PRIVATE_KEY").replace(
    /\\n/g,
    "\n",
  );
  const spreadsheetId = getRequiredEnvironmentVariable("GOOGLE_SHEET_ID");

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: serviceAccountEmail,
      private_key: privateKey,
    },
    scopes: [spreadsheetScope],
  });
  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [values],
    },
  });
}

export async function addStudentRegistration(registration: StudentSheetRegistration) {
  await appendRegistration(studentSpreadsheetRange, [
    registration.course,
    registration.studentName,
    registration.studentAge,
    registration.residence,
    registration.previousMadrassah,
    registration.studyDuration,
    registration.quranProgress,
    registration.surahProgress,
    registration.responsibleName,
    registration.responsibleEmail,
    registration.responsiblePhone,
    registration.relationship,
  ]);
}

export async function addTeacherRegistration(registration: TeacherSheetRegistration) {
  await appendRegistration(teacherSpreadsheetRange, [
    registration.fullName,
    registration.gender,
    registration.age,
    registration.address,
    registration.whatsappNumber,
    registration.email,
    registration.islamicStudiesQualifications,
    registration.quranTajwidQualifications,
    registration.currentlyTeaching,
    registration.currentTeachingLocation,
    registration.teachingExperience,
    registration.ageGroups,
    registration.subjects,
    registration.languages,
    registration.availableDays,
    registration.preferredTeachingTimes,
    registration.classesPerWeek,
    registration.hasInternetAndDevice,
    registration.comfortableOnline,
    registration.teachingMotivation,
    registration.additionalInformation,
  ]);
}
