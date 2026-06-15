// =================================================================
// BETH TEPHILAH SYNAGOGUE — Google Apps Script Backend
// =================================================================
//
// SETUP INSTRUCTIONS:
// 1. Go to sheets.google.com and create a new Google Sheet
//    Title it: "Beth Tephilah Synagogue — Website Data"
// 2. Copy the Sheet ID from the URL (the long string between /d/ and /edit)
// 3. In the sheet, go to Extensions → Apps Script
// 4. Delete any existing code and paste THIS ENTIRE FILE
// 5. Fill in the CONFIG values below:
//    - SHEET_ID: paste your Google Sheet ID
//    - RABBI_EMAIL: the rabbi's email address
//    - RABBI_SMS_EMAIL: phone@carrier-gateway.com for SMS
//      (e.g. 5181234567@vtext.com for Verizon,
//             5181234567@txt.att.net for AT&T,
//             5181234567@tmomail.net for T-Mobile)
//    - ADMIN_KEY: choose a strong secret password
// 6. Click Deploy → New Deployment
//    → Type: Web App
//    → Execute as: Me
//    → Who has access: Anyone
// 7. Authorize the permissions when asked
// 8. Copy the Web App URL (looks like:
//    https://script.google.com/macros/s/SCRIPT_ID/exec)
// 9. Open bet-tefila-troy/config.js on the website and paste
//    that URL into GOOGLE_SCRIPT_URL
// 10. The admin panel is at: [Web App URL]?action=admin&key=[ADMIN_KEY]
//     Bookmark this URL for the rabbi to add events
//
// =================================================================

const CONFIG = {
  SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE',
  RABBI_EMAIL: 'egm180@gmail.com',
  // SMS via email gateway — e.g. '5181234567@vtext.com'
  RABBI_SMS_EMAIL: '',
  // Change this to a strong secret password
  ADMIN_KEY: 'bt-admin-2024',
  SYNAGOGUE_NAME: 'Beth Tephilah Synagogue',
  SYNAGOGUE_ADDRESS: '82 River Street, Troy, NY 12180',
};

// ---- ROUTING ------------------------------------------------

function doGet(e) {
  const action = (e?.parameter?.action || '').toLowerCase();
  const key = e?.parameter?.key || '';

  if (action === 'events') {
    return getEventsJSON();
  }

  if (action === 'admin') {
    if (key !== CONFIG.ADMIN_KEY) {
      return htmlResponse(buildPage(
        '<div style="font-family:system-ui;max-width:420px;margin:80px auto;text-align:center;padding:24px">'
        + '<h2 style="color:#b71c1c">Access Denied</h2>'
        + '<p>Incorrect admin key. Check the URL.</p></div>'
      ));
    }
    return htmlResponse(buildPage(adminForm()));
  }

  return textResponse('Beth Tephilah — Script is running.');
}

function doPost(e) {
  try {
    const raw = e?.postData?.contents || '{}';
    const data = JSON.parse(raw);
    const type = (data.type || '').toLowerCase();

    switch (type) {
      case 'minyan_rsvp': return handleMinyanRsvp(data);
      case 'contact':     return handleContact(data);
      case 'booking':     return handleBooking(data);
      case 'donation':    return handleDonation(data);
      case 'add_event':
        return data.admin_key === CONFIG.ADMIN_KEY
          ? handleAddEvent(data) : jsonErr('Unauthorized');
      case 'delete_event':
        return data.admin_key === CONFIG.ADMIN_KEY
          ? handleDeleteEvent(data) : jsonErr('Unauthorized');
    }
  } catch (err) {
    Logger.log('doPost error: ' + err.toString());
  }
  return jsonResponse({ success: false, error: 'Unknown request type' });
}

// ---- SHEET HELPERS ------------------------------------------

function getSheet(name) {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function ensureHeaders(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    const range = sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#0f3d5c')
      .setFontColor('#ffffff');
  }
}

function ts() {
  return new Date();
}

// ---- EVENTS --------------------------------------------------

function getEventsJSON() {
  const sheet = getSheet('Events');
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) {
    return jsonResponse({ events: [] });
  }
  const headers = rows[0];
  const events = rows.slice(1)
    .filter(r => r[0]) // skip blank rows
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[String(h)] = String(row[i] || ''); });
      return obj;
    })
    .sort((a, b) => {
      // Sort by date ascending; undated events go last
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
    });
  return jsonResponse({ events });
}

function handleAddEvent(data) {
  const sheet = getSheet('Events');
  ensureHeaders(sheet, ['id', 'title', 'dateDisplay', 'date', 'tag', 'description', 'rsvpRequired', 'addedAt']);
  const id = 'evt-' + Date.now();
  sheet.appendRow([
    id,
    data.title || '',
    data.dateDisplay || '',
    data.date || '',
    data.tag || 'Event',
    data.description || '',
    data.rsvpRequired ? 'true' : 'false',
    ts().toISOString(),
  ]);
  return jsonResponse({ success: true, id });
}

function handleDeleteEvent(data) {
  const sheet = getSheet('Events');
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) {
      sheet.deleteRow(i + 1);
      return jsonResponse({ success: true });
    }
  }
  return jsonResponse({ success: false, error: 'Event not found' });
}

// ---- MINYAN RSVP --------------------------------------------

function handleMinyanRsvp(data) {
  const sheet = getSheet('RSVP');
  ensureHeaders(sheet, ['Timestamp', 'Date', 'Day', 'Service', 'Time', 'Name', 'Email', 'Note']);
  sheet.appendRow([
    ts(), data.date || '', data.day || '', data.service || '',
    data.time || '', data.name || '(anonymous)', data.email || '', data.note || '',
  ]);

  const name = data.name || 'Someone';
  const subject = `⛪ Minyan RSVP: ${name} → ${data.service} on ${data.day}, ${data.date}`;
  const body = formatEmail('Minyan RSVP Received', [
    ['Service',  data.service],
    ['Day',      data.day],
    ['Date',     data.date],
    ['Time',     data.time],
    ['Name',     data.name || '(not provided)'],
    ['Email',    data.email || '(not provided)'],
    ['Note',     data.note || '(none)'],
  ]);

  sendNotification(subject, body, `${name} will attend ${data.service} at ${data.time} on ${data.day}`);
  return jsonResponse({ success: true });
}

// ---- CONTACT ------------------------------------------------

function handleContact(data) {
  const sheet = getSheet('Contact');
  ensureHeaders(sheet, ['Timestamp', 'Name', 'Email', 'Topic', 'Date/Timing', 'Message']);
  sheet.appendRow([ts(), data.name || '', data.email || '', data.topic || '', data.date_or_timing || '', data.message || '']);

  const subject = `📬 Contact: ${data.topic || 'General'} — ${data.name}`;
  const body = formatEmail('Contact Form Submission', [
    ['Name',        data.name],
    ['Email',       data.email],
    ['Topic',       data.topic],
    ['Date/Timing', data.date_or_timing || '(not specified)'],
    ['Message',     data.message],
  ]);

  sendNotification(subject, body, `${data.name} sent a message: ${data.topic}`);
  return jsonResponse({ success: true });
}

// ---- BOOKING ------------------------------------------------

function handleBooking(data) {
  const sheet = getSheet('Booking');
  ensureHeaders(sheet, ['Timestamp', 'Name', 'Email', 'Phone', 'Simcha Type', 'Date', 'Guests', 'Origin City', 'Kosher Needs', 'Message']);
  sheet.appendRow([
    ts(), data.name || '', data.email || '', data.phone || '',
    data.simcha_type || '', data.preferred_date || '', data.guest_count || '',
    data.origin_city || '', data.kosher_needs || '', data.message || '',
  ]);

  const subject = `✡ Simcha Booking: ${data.simcha_type || 'Event'} — ${data.name}`;
  const body = formatEmail('Simcha Booking Inquiry', [
    ['Name',           data.name],
    ['Email',          data.email],
    ['Phone',          data.phone || '(not provided)'],
    ['Celebration',    data.simcha_type],
    ['Preferred Date', data.preferred_date || '(not specified)'],
    ['Guests',         data.guest_count || '(not specified)'],
    ['From',           data.origin_city || '(not specified)'],
    ['Kosher Needs',   data.kosher_needs || '(none specified)'],
    ['Message',        data.message || '(none)'],
  ]);

  sendNotification(subject, body, `${data.name} inquired about a ${data.simcha_type} — ${data.guest_count || '?'} guests`);
  return jsonResponse({ success: true });
}

// ---- DONATION -----------------------------------------------

function handleDonation(data) {
  const sheet = getSheet('Donations');
  ensureHeaders(sheet, ['Timestamp', 'Name', 'Email', 'Amount', 'Fund', 'Dedication']);
  sheet.appendRow([ts(), data.name || '', data.email || '', data.amount || '', data.fund || '', data.dedication || '']);

  const subject = `💙 Donation Pledge: $${data.amount} — ${data.name}`;
  const body = formatEmail('Donation Pledge', [
    ['Name',        data.name],
    ['Email',       data.email],
    ['Amount',      '$' + data.amount],
    ['Designated',  data.fund || 'General support'],
    ['Dedication',  data.dedication || '(none)'],
  ]);

  sendNotification(subject, body, `${data.name} pledged $${data.amount} for ${data.fund || 'general support'}`);
  return jsonResponse({ success: true });
}

// ---- NOTIFICATIONS ------------------------------------------

function sendNotification(subject, emailBody, smsText) {
  try {
    GmailApp.sendEmail(CONFIG.RABBI_EMAIL, subject, '', { htmlBody: emailBody });
  } catch (err) {
    Logger.log('Email error: ' + err.toString());
  }

  // SMS via email-to-text gateway
  if (CONFIG.RABBI_SMS_EMAIL) {
    try {
      // SMS max 160 chars
      const sms = (smsText || subject).substring(0, 158);
      GmailApp.sendEmail(CONFIG.RABBI_SMS_EMAIL, '', sms);
    } catch (err) {
      Logger.log('SMS error: ' + err.toString());
    }
  }
}

function formatEmail(title, rows) {
  const rowsHtml = rows.map(([label, value]) =>
    `<tr>
      <td style="padding:8px 12px;font-weight:700;color:#0f3d5c;white-space:nowrap;vertical-align:top">${label}</td>
      <td style="padding:8px 12px;color:#1a3d55">${String(value || '').replace(/\n/g, '<br>')}</td>
    </tr>`
  ).join('');

  return `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#edf3f8;font-family:system-ui,-apple-system,sans-serif">
<div style="max-width:580px;margin:32px auto">
  <div style="background:linear-gradient(135deg,#0f3d5c,#2a6d99);padding:28px 32px;border-radius:16px 16px 0 0">
    <h1 style="margin:0;color:white;font-family:Georgia,serif;font-size:26px">${CONFIG.SYNAGOGUE_NAME}</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,.78);font-size:14px">${CONFIG.SYNAGOGUE_ADDRESS}</p>
  </div>
  <div style="background:white;padding:28px 32px;border:1px solid #d4e5f0;border-top:0">
    <h2 style="margin:0 0 20px;color:#071e2d;font-family:Georgia,serif">${title}</h2>
    <table style="width:100%;border-collapse:collapse;background:#f5f9fc;border-radius:10px;overflow:hidden">
      ${rowsHtml}
    </table>
    <p style="margin:20px 0 0;font-size:13px;color:#888">
      Received: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET
    </p>
  </div>
  <div style="padding:16px 32px;text-align:center;font-size:12px;color:#888">
    Beth Tephilah Synagogue · 82 River Street · Troy, NY 12180
  </div>
</div>
</body></html>`;
}

// ---- ADMIN HTML ---------------------------------------------

function adminForm() {
  return `
<style>
  *{box-sizing:border-box}
  body{font-family:system-ui,-apple-system,sans-serif;background:#edf3f8;color:#071e2d;margin:0;padding:20px}
  .wrap{max-width:720px;margin:0 auto}
  h1{font-family:Georgia,serif;color:#071e2d;margin:0}
  .header{background:linear-gradient(135deg,#0f3d5c,#2a6d99);color:white;padding:28px 32px;border-radius:16px;margin-bottom:20px}
  .header h1{color:white;font-size:28px}
  .header p{color:rgba(255,255,255,.8);margin:6px 0 0}
  .card{background:white;border-radius:16px;padding:28px;margin-bottom:18px;box-shadow:0 4px 20px rgba(7,30,45,.08)}
  h2{margin:0 0 20px;font-family:Georgia,serif;font-size:22px}
  label{display:block;font-weight:700;font-size:14px;margin:14px 0 5px;color:#0f3d5c}
  input,select,textarea{width:100%;padding:10px 14px;border:1.5px solid #c0d4e0;border-radius:10px;font:inherit;font-size:15px;outline:none;transition:border-color .2s}
  input:focus,select:focus,textarea:focus{border-color:#2a6d99;box-shadow:0 0 0 3px rgba(42,109,153,.15)}
  textarea{min-height:80px;resize:vertical}
  .btn{background:linear-gradient(135deg,#2a6d99,#0f3d5c);color:white;border:none;padding:12px 28px;border-radius:999px;font-weight:700;font-size:15px;cursor:pointer;margin-top:18px;display:inline-block;transition:opacity .2s}
  .btn:hover{opacity:.88}
  .btn-del{background:#c0392b;padding:8px 14px;font-size:13px;margin:0}
  .event-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;background:#f5f9fc;border-radius:10px;margin-bottom:8px;flex-wrap:wrap}
  .event-row-info{flex:1}
  .event-row strong{display:block;font-size:16px}
  .event-row span{font-size:13px;color:#5f9ab8}
  .toast{padding:12px 18px;border-radius:10px;font-weight:700;margin-bottom:16px;display:none}
  .toast.success{background:#e8f5e9;color:#2e7d32;border:1px solid #a5d6a7;display:block}
  .toast.error{background:#ffebee;color:#c62828;border:1px solid #ef9a9a;display:block}
  .two{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  @media(max-width:560px){.two{grid-template-columns:1fr}}
</style>
<div class="wrap">
  <div class="header">
    <h1>Beth Tephilah — Admin</h1>
    <p>Add, manage, and remove events that appear live on the schedule page.</p>
  </div>
  <div id="toast" class="toast"></div>
  <div class="card">
    <h2>Add New Event</h2>
    <label>Event title *</label>
    <input id="e-title" placeholder="e.g. Shabbat Shuvah" />
    <div class="two">
      <div>
        <label>Date for sorting (YYYY-MM-DD)</label>
        <input id="e-date" type="date" />
      </div>
      <div>
        <label>Display date *</label>
        <input id="e-dateDisplay" placeholder="e.g. September 21, 2026" />
      </div>
    </div>
    <div class="two">
      <div>
        <label>Tag / category</label>
        <input id="e-tag" placeholder="Holiday, Weekly, Community…" />
      </div>
      <div>
        <label>RSVP required?</label>
        <select id="e-rsvp">
          <option value="false">No — walk in welcome</option>
          <option value="true">Yes — contact shul</option>
        </select>
      </div>
    </div>
    <label>Description</label>
    <textarea id="e-desc" placeholder="Brief description shown on the schedule page…"></textarea>
    <button class="btn" onclick="addEvent()">Add Event to Schedule →</button>
  </div>
  <div class="card">
    <h2>Current Events on Schedule</h2>
    <div id="event-list"><p style="color:#888">Loading…</p></div>
  </div>
</div>
<script>
const SCRIPT_URL = location.href.split('?')[0];
const ADMIN_KEY = '${CONFIG.ADMIN_KEY}';

function toast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast ' + type;
  setTimeout(() => { t.className = 'toast'; }, 4000);
}

async function loadEvents() {
  try {
    const r = await fetch(SCRIPT_URL + '?action=events');
    const data = await r.json();
    const list = document.getElementById('event-list');
    if (!data.events || data.events.length === 0) {
      list.innerHTML = '<p style="color:#888">No events yet. Add one above.</p>';
      return;
    }
    list.innerHTML = data.events.map(e => \`
      <div class="event-row">
        <div class="event-row-info">
          <strong>\${e.title}</strong>
          <span>\${e.dateDisplay} &nbsp;·&nbsp; \${e.tag}\${e.rsvpRequired === 'true' ? ' &nbsp;·&nbsp; RSVP required' : ''}</span>
        </div>
        <button class="btn btn-del" onclick="deleteEvent('\${e.id}')">Delete</button>
      </div>\`).join('');
  } catch(err) {
    document.getElementById('event-list').innerHTML = '<p style="color:#c62828">Error loading events.</p>';
  }
}

async function addEvent() {
  const title = document.getElementById('e-title').value.trim();
  const dateDisplay = document.getElementById('e-dateDisplay').value.trim();
  if (!title || !dateDisplay) { toast('Title and display date are required.', 'error'); return; }
  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        type: 'add_event', admin_key: ADMIN_KEY,
        title, date: document.getElementById('e-date').value,
        dateDisplay, tag: document.getElementById('e-tag').value.trim() || 'Event',
        description: document.getElementById('e-desc').value.trim(),
        rsvpRequired: document.getElementById('e-rsvp').value === 'true',
      })
    });
    toast('Event added! It will appear on the schedule immediately.', 'success');
    ['e-title','e-date','e-dateDisplay','e-tag','e-desc'].forEach(id => document.getElementById(id).value = '');
    loadEvents();
  } catch(err) { toast('Error adding event. Try again.', 'error'); }
}

async function deleteEvent(id) {
  if (!confirm('Delete this event from the schedule?')) return;
  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ type: 'delete_event', admin_key: ADMIN_KEY, id })
    });
    toast('Event deleted.', 'success');
    loadEvents();
  } catch(err) { toast('Error deleting.', 'error'); }
}

loadEvents();
</script>`;
}

// ---- RESPONSE HELPERS ---------------------------------------

function buildPage(body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Beth Tephilah Admin</title><meta name="robots" content="noindex,nofollow"></head><body>${body}</body></html>`;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function htmlResponse(html) {
  return ContentService
    .createTextOutput(html)
    .setMimeType(ContentService.MimeType.HTML);
}

function textResponse(text) {
  return ContentService
    .createTextOutput(text)
    .setMimeType(ContentService.MimeType.TEXT);
}

function jsonErr(msg) {
  return jsonResponse({ success: false, error: msg });
}
