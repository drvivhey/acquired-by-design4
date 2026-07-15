// Google Apps Script Web App endpoint. Set VITE_SHEETS_WEB_APP_URL in your .env file.
const SHEETS_WEB_APP_URL = import.meta.env.VITE_SHEETS_WEB_APP_URL || "[PASTE YOUR WEB APP URL]";

export interface QuizScores {
  P: number;
  R: number;
  O: number;
  F: number;
  I: number;
  T: number;
}

export interface QuizSubmissionPayload {
  name: string;
  email: string;
  scores: QuizScores;
  total: number;
  segment: string;
  answers: Record<number, number>;
  businessName?: string;
}

export async function submitToSheets(payload: QuizSubmissionPayload): Promise<void> {
  // text/plain + no-cors keeps this a "simple request" so the browser skips the
  // CORS preflight that Google Apps Script Web Apps don't handle, and avoids the
  // fetch promise rejecting on the opaque cross-origin response it sends back.
  await fetch(SHEETS_WEB_APP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify(payload),
  });
}
