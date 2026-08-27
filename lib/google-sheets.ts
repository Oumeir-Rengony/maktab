import "server-only";

import { google } from "googleapis";

export interface SheetRegistration {
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

const spreadsheetRange = "Sheet1!A3:L";
const spreadsheetScope = "https://www.googleapis.com/auth/spreadsheets";

function getRequiredEnvironmentVariable(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export async function addRegistration(registration: SheetRegistration) {
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
    range: spreadsheetRange,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
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
        ],
      ],
    },
  });
}
