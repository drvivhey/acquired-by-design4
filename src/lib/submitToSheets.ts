// Google Apps Script Web App endpoint. Set VITE_SHEETS_URL in your .env file.
const SHEETS_WEB_APP_URL = import.meta.env.VITE_SHEETS_URL;

export interface QuizSubmissionPayload {
  business_name: string;
  first_name: string;
  email: string;
  total_score: number;
  band_name: string;
  score_processes: number;
  score_relationships: number;
  score_owner_independence: number;
  score_financials: number;
  score_independent_team: number;
  score_technology: number;
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
