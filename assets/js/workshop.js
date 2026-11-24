/* ============================================================
   Workshop page: "Register your interest" form
   Sends entries to the same Google Apps Script / Google Sheet as the
   main page's Apply form, using the same keys (name, email, phone,
   business, goal, submittedAt). Phone is not asked for here, so it is
   sent blank, and goal is set to "Grow London workshop" so these
   entries are easy to tell apart in the sheet.
   ============================================================ */
(function () {
  'use strict';

  var SHEETS_WEB_APP_URL =
    'https://script.google.com/macros/s/AKfycbxv0m-3dqrvAuOPx6qoMahr85Z56xbzV3fcZ5Jn4_3XKFjiXZHsdFnTTuhoJ2vyJujiuw/exec';

  var form = document.getElementById('interest-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var button = form.querySelector('button[type="submit"]');
    var status = document.getElementById('interest-status');
    var error = document.getElementById('interest-error');
    var fd = new FormData(form);

    var payload = {
      name: fd.get('fullName'),
      email: fd.get('email'),
      phone: '',
      business: fd.get('businessName'),
      goal: 'Grow London workshop',
      submittedAt: new Date().toISOString()
    };

    if (error) error.hidden = true;
    if (button) { button.disabled = true; button.textContent = 'Sending…'; }

    // Simple no-cors, text/plain POST (no CORS preflight, which Apps Script
    // doesn't answer). The response is opaque, so success is assumed once
    // the request has gone.
    fetch(SHEETS_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    })
      .then(function () {
        form.hidden = true;
        if (status) status.hidden = false;
      })
      .catch(function (err) {
        console.error('Submission error:', err);
        if (button) { button.disabled = false; button.textContent = 'Register your interest'; }
        if (error) {
          error.textContent = 'Sorry, that did not go through. Please try again.';
          error.hidden = false;
        }
      });
  });
})();
