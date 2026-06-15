// =================================================================
// BETH TEPHILAH SYNAGOGUE — Website Configuration
// =================================================================
// After deploying the Google Apps Script (see google-apps-script/Code.gs),
// paste your Web App URL into GOOGLE_SCRIPT_URL below.
//
// The Web App URL looks like:
//   https://script.google.com/macros/s/AKfyc.../exec
//
// The admin panel for the rabbi to add events:
//   [GOOGLE_SCRIPT_URL]?action=admin&key=[ADMIN_KEY]
//   Example: https://script.google.com/.../exec?action=admin&key=bt-admin-2024
//
// IMPORTANT: Keep ADMIN_KEY secret. Do not share the admin URL publicly.
// =================================================================

window.BET_TEFILA_CONFIG = {
  // Paste your deployed Google Apps Script Web App URL here:
  GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',

  // Must match ADMIN_KEY in Code.gs (so the rabbi can manage events):
  ADMIN_KEY: 'bt-admin-2024',

  // Set to true to show a link to the admin panel in the footer (dev only):
  SHOW_ADMIN_LINK: false,
};
