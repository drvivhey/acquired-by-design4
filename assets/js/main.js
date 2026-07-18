/* ============================================================
   Wellspring Profit Index — client behaviour
   ============================================================ */
(function () {
  'use strict';

  // --- Google Apps Script Web App endpoint --------------------------------
  // Same submission transport the project has always used: a "simple"
  // no-cors, text/plain POST so the browser skips the CORS preflight that
  // Apps Script Web Apps don't answer, and the opaque response doesn't
  // reject the fetch. The Apps Script appends the payload to the sheet.
  var SHEETS_WEB_APP_URL =
    'https://script.google.com/macros/s/AKfycbxv0m-3dqrvAuOPx6qoMahr85Z56xbzV3fcZ5Jn4_3XKFjiXZHsdFnTTuhoJ2vyJujiuw/exec';

  function submitToSheets(payload) {
    // Exact transport the working site uses: a "simple" no-cors, text/plain
    // POST of the JSON payload. The Apps Script reads e.postData.contents and
    // appends a row, so the payload KEYS must match the sheet's fields
    // (name, email, phone, business, goal, submittedAt).
    return fetch(SHEETS_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
  }

  // --- Waitlist shortcut ---------------------------------------------------
  // "Join the waitlist" reveals the notice and preselects the Waitlist goal.
  var waitlistLink = document.getElementById('waitlist-link');
  if (waitlistLink) {
    waitlistLink.addEventListener('click', function () {
      var notice = document.getElementById('waitlist-notice');
      var goal = document.getElementById('primaryGoal-select');
      if (notice) notice.style.display = 'block';
      if (goal) goal.value = 'Waitlist';
    });
  }

  // --- Apply form ----------------------------------------------------------
  var form = document.getElementById('apply-form');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var status = document.getElementById('form-status');
      var button = form.querySelector('button[type="submit"]');

      // Map the form fields to the keys the Apps Script / sheet expects.
      var fd = new FormData(form);
      var payload = {
        name: fd.get('fullName'),
        email: fd.get('email'),
        phone: fd.get('phone'),
        business: fd.get('businessName'),
        goal: fd.get('primaryGoal'),
        submittedAt: new Date().toISOString()
      };

      if (button) { button.disabled = true; button.textContent = 'Submitting…'; }

      submitToSheets(payload)
        .catch(function (err) { console.error('Submission error:', err); })
        .then(function () {
          if (status) {
            status.textContent = payload.goal === 'Waitlist'
              ? "You're on the waitlist — we'll be in touch when the next cohort opens."
              : "Thank you — your application is in. We'll be in touch shortly to arrange a call.";
            status.hidden = false;
          }
          form.reset();
          if (button) { button.disabled = false; button.textContent = 'Submit'; }
        });
    });
  }
})();
