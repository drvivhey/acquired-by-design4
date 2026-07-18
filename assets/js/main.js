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
        .then(function () {
          // Replace the form with a confirmation card, as the previous site did.
          // The form has an inline `display: flex`, so `hidden` alone won't hide
          // it — set display:none directly.
          form.style.display = 'none';
          var notice = document.getElementById('waitlist-notice');
          if (notice) notice.style.display = 'none';
          var diagnostic = document.getElementById('diagnostic-note');
          if (diagnostic) diagnostic.style.display = 'none';
          if (status) {
            status.hidden = false;
            status.innerHTML =
              '<span aria-hidden="true" style="width:48px;height:48px;border-radius:999px;background:#219b94;color:#ffffff;display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 14px;">✓</span>' +
              '<span style="display:block;font-size:18px;font-weight:600;color:#fdfffe;margin-bottom:6px;">You\'re on the list.</span>' +
              '<span style="display:block;font-size:14.5px;line-height:1.6;color:#b9d3d7;">We\'ll be in touch shortly to arrange your call.</span>';
          }
        })
        .catch(function (err) {
          console.error('Submission error:', err);
          if (status) {
            status.hidden = false;
            status.textContent = "Something went wrong sending your details. Please email hello@wellspringexit.com and we'll sort it out.";
          }
          if (button) { button.disabled = false; button.textContent = 'Submit'; }
        });
    });
  }
})();
