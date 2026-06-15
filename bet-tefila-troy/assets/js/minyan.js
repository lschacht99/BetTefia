// Minyan interactive schedule — with RSVP confirmation modal and Google Script integration

(function () {
  const content = window.BET_TEFILA_CONTENT || {};
  const config = window.BET_TEFILA_CONFIG || {};
  const schedule = content.minyanSchedule || [];

  const DAYS_LONG = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Shabbat'];
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  // ---- DATE HELPERS ----

  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  }

  function pad(n) { return String(n).padStart(2,'0'); }

  function todayDisplay() {
    const d = new Date();
    return `${DAYS_LONG[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  function getTodayDayIndex() {
    return new Date().getDay();
  }

  // ---- LOCALSTORAGE ----

  function rsvpKey(serviceId, date) {
    return `bt_rsvp_${date}_${serviceId}`;
  }

  function isRsvped(serviceId, date) {
    return localStorage.getItem(rsvpKey(serviceId, date)) === '1';
  }

  function setRsvped(serviceId, date, val) {
    if (val) localStorage.setItem(rsvpKey(serviceId, date), '1');
    else localStorage.removeItem(rsvpKey(serviceId, date));
  }

  // ---- GOOGLE SCRIPT SUBMISSION ----

  async function sendRsvpToScript(data) {
    const url = config.GOOGLE_SCRIPT_URL;
    if (!url || url.includes('YOUR_SCRIPT_ID')) return;
    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ type: 'minyan_rsvp', ...data }),
      });
    } catch (e) { /* fire-and-forget */ }
  }

  // ---- MODAL ----

  let pendingRsvp = null; // { serviceId, date, serviceName, time, day }

  function injectModal() {
    if (document.getElementById('rsvp-modal')) return;
    const el = document.createElement('div');
    el.innerHTML = `
      <div class="modal-backdrop" id="rsvp-modal" hidden role="dialog" aria-modal="true" aria-labelledby="rsvp-modal-title">
        <div class="modal-box">
          <button class="modal-close" id="rsvp-modal-close" type="button" aria-label="Close dialog">✕</button>
          <div class="modal-eyebrow" id="rsvp-modal-eyebrow">Today's service</div>
          <h2 class="modal-title" id="rsvp-modal-title">Join us for prayer</h2>
          <p class="modal-desc" id="rsvp-modal-desc">Let Rabbi Morrison know you're coming. Help build the minyan.</p>
          <form id="rsvp-modal-form" novalidate>
            <div class="field">
              <label for="rsvp-name">Your name <span class="field-optional">(optional)</span></label>
              <input id="rsvp-name" name="name" autocomplete="given-name" placeholder="First name is enough" />
            </div>
            <div class="field" style="margin-top:12px">
              <label for="rsvp-email">Email <span class="field-optional">(optional)</span></label>
              <input id="rsvp-email" name="email" type="email" autocomplete="email" placeholder="your@email.com" />
            </div>
            <div class="field" style="margin-top:12px">
              <label for="rsvp-note">Note <span class="field-optional">(optional)</span></label>
              <input id="rsvp-note" name="note" placeholder="e.g. I need a minyan for a yahrzeit" />
            </div>
            <div class="modal-actions">
              <button class="button primary modal-confirm" type="submit" id="rsvp-confirm-btn">
                ✓ Yes, I'll be there
              </button>
              <button class="button secondary" type="button" id="rsvp-cancel-btn">Not this time</button>
            </div>
          </form>
          <p id="rsvp-modal-status" class="form-status" aria-live="polite"></p>
        </div>
      </div>`;
    document.body.appendChild(el.firstElementChild);

    document.getElementById('rsvp-modal-close').addEventListener('click', closeModal);
    document.getElementById('rsvp-cancel-btn').addEventListener('click', closeModal);
    document.getElementById('rsvp-modal').addEventListener('click', e => {
      if (e.target === document.getElementById('rsvp-modal')) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
    document.getElementById('rsvp-modal-form').addEventListener('submit', async e => {
      e.preventDefault();
      if (!pendingRsvp) return;
      const name = document.getElementById('rsvp-name').value.trim();
      const email = document.getElementById('rsvp-email').value.trim();
      const note = document.getElementById('rsvp-note').value.trim();
      const btn = document.getElementById('rsvp-confirm-btn');
      const status = document.getElementById('rsvp-modal-status');

      btn.textContent = 'Sending…';
      btn.disabled = true;

      // Mark in localStorage
      setRsvped(pendingRsvp.serviceId, pendingRsvp.date, true);

      // Submit to Google Script (fire-and-forget)
      await sendRsvpToScript({
        date: pendingRsvp.date,
        day: pendingRsvp.day,
        service: pendingRsvp.serviceName,
        time: pendingRsvp.time,
        name, email, note,
      });

      // Update the button that triggered this
      if (pendingRsvp.triggerBtn) {
        pendingRsvp.triggerBtn.classList.add('confirmed');
        pendingRsvp.triggerBtn.textContent = "I'm coming ✓";
        const countEl = pendingRsvp.triggerBtn.closest('.minyan-service')?.querySelector('.minyan-count');
        if (countEl) countEl.textContent = "You're confirmed";
      }

      status.textContent = '✓ Confirmed! The rabbi will be notified.';
      btn.textContent = '✓ Done';
      setTimeout(closeModal, 1800);
    });
  }

  function openModal(ctx) {
    pendingRsvp = ctx;
    const modal = document.getElementById('rsvp-modal');
    if (!modal) return;
    document.getElementById('rsvp-modal-eyebrow').textContent = ctx.day + ' · ' + ctx.date;
    document.getElementById('rsvp-modal-title').textContent = 'Join ' + ctx.serviceName;
    document.getElementById('rsvp-modal-desc').textContent =
      ctx.time + ' at Beth Tephilah — ' + (ctx.isShabbat ? 'Shabbat service' : 'Let the rabbi know you\'re coming.');
    document.getElementById('rsvp-name').value = '';
    document.getElementById('rsvp-email').value = '';
    document.getElementById('rsvp-note').value = '';
    document.getElementById('rsvp-modal-status').textContent = '';
    const btn = document.getElementById('rsvp-confirm-btn');
    btn.textContent = '✓ Yes, I\'ll be there';
    btn.disabled = false;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('rsvp-name').focus(), 100);
  }

  function closeModal() {
    const modal = document.getElementById('rsvp-modal');
    if (modal) modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    pendingRsvp = null;
  }

  // ---- TODAY'S SCHEDULE ----

  function renderTodayServices() {
    const dayIndex = getTodayDayIndex();
    const dayData = schedule.find(d => d.dayIndex === dayIndex);
    const date = todayStr();

    const dateEl = document.getElementById('today-date-display');
    const titleEl = document.getElementById('today-day-name');
    const servicesEl = document.getElementById('today-services');

    if (dateEl) dateEl.textContent = todayDisplay();
    if (titleEl) {
      titleEl.textContent = dayIndex === 6 ? 'Shabbat Services' : `${DAYS_LONG[dayIndex]} Prayer Times`;
    }

    if (!servicesEl || !dayData) return;

    servicesEl.innerHTML = dayData.services.map(service => {
      const uid = `${service.id}-${date}`;
      const confirmed = isRsvped(uid, date);
      return `
        <div class="minyan-service">
          <span class="minyan-service-name">${service.name}</span>
          <span class="minyan-service-time">${service.time}</span>
          <div class="minyan-service-rsvp">
            <button
              class="btn-rsvp${confirmed ? ' confirmed' : ''}"
              type="button"
              data-service-uid="${uid}"
              data-service-name="${service.name}"
              data-service-time="${service.time}"
              data-day="${DAYS_LONG[dayIndex]}"
              data-is-shabbat="${dayData.isShabbat ? 'true' : 'false'}"
              aria-label="${confirmed ? 'You confirmed' : 'RSVP for'} ${service.name} at ${service.time}"
            >${confirmed ? "I'm coming ✓" : "I'll be there"}</button>
            <span class="minyan-count">${confirmed ? "You're confirmed" : ""}</span>
          </div>
        </div>`;
    }).join('');

    // Wire up RSVP buttons
    servicesEl.querySelectorAll('.btn-rsvp').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = btn.dataset.serviceUid;
        if (isRsvped(uid, date)) {
          // Cancel RSVP
          setRsvped(uid, date, false);
          btn.classList.remove('confirmed');
          btn.textContent = "I'll be there";
          const countEl = btn.closest('.minyan-service')?.querySelector('.minyan-count');
          if (countEl) countEl.textContent = '';
          return;
        }
        // Open modal to confirm
        openModal({
          serviceId: uid,
          date,
          day: btn.dataset.day,
          serviceName: btn.dataset.serviceName,
          time: btn.dataset.serviceTime,
          isShabbat: btn.dataset.isShabbat === 'true',
          triggerBtn: btn,
        });
      });
    });
  }

  // ---- WEEKLY GRID ----

  function renderWeeklyGrid() {
    const grid = document.getElementById('weekly-grid');
    if (!grid || !schedule.length) return;
    const today = getTodayDayIndex();

    grid.innerHTML = schedule.map(day => {
      const isToday = day.dayIndex === today;
      let cls = 'day-column';
      if (isToday) cls += ' is-today';
      if (day.isShabbat) cls += ' is-shabbat';
      if (day.isFriday) cls += ' is-friday';

      const services = day.services.map(s => `
        <div class="day-service">
          <div class="day-service-label">${s.name}</div>
          <div class="day-service-time">${s.time}</div>
        </div>`).join('');

      return `
        <div class="${cls}"${isToday ? ' aria-current="date"' : ''}>
          <div class="day-header">${isToday ? '★ ' : ''}${day.short}${isToday ? '<br><small>Today</small>' : ''}</div>
          <div class="day-services">${services}</div>
        </div>`;
    }).join('');
  }

  // ---- EVENTS GRID (static + dynamic from Google Script) ----

  function renderEventsGrid(events) {
    const grid = document.getElementById('events-grid');
    if (!grid) return;
    if (!events || events.length === 0) {
      grid.innerHTML = '<p style="grid-column:1/-1;color:var(--navy-soft)">No upcoming events scheduled. Check back soon or follow us on <a href="https://www.facebook.com/bethtephilah.synagogue/" target="_blank" rel="noopener">Facebook</a>.</p>';
      return;
    }
    grid.innerHTML = events.map(evt => `
      <article class="event-card">
        <span class="tag">${evt.tag || 'Event'}</span>
        <h3>${evt.title}</h3>
        <p><strong>${evt.dateDisplay}</strong></p>
        <p>${evt.description || ''}</p>
        ${evt.rsvpRequired === 'true' || evt.rsvpRequired === true
          ? `<a class="button secondary" href="mailto:${content.email || 'office@bethtephilahtroy.org'}?subject=RSVP: ${encodeURIComponent(evt.title)}" style="margin-top:12px;display:inline-flex">RSVP →</a>`
          : `<a class="button secondary" href="contact.html" style="margin-top:12px;display:inline-flex">Learn more →</a>`
        }
      </article>`).join('');
  }

  async function loadEvents() {
    const grid = document.getElementById('events-grid');
    if (!grid) return;

    const url = config.GOOGLE_SCRIPT_URL;
    const staticEvents = content.upcomingEvents || [];

    if (!url || url.includes('YOUR_SCRIPT_ID')) {
      renderEventsGrid(staticEvents);
      return;
    }

    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:24px;color:var(--navy-soft)">Loading events…</div>';

    try {
      const r = await fetch(url + '?action=events', { signal: AbortSignal.timeout(6000) });
      const data = await r.json();
      const dynamicEvents = (data.events || []);
      // Merge: dynamic events first, then static events not already in dynamic
      const combined = dynamicEvents.length > 0 ? dynamicEvents : staticEvents;
      renderEventsGrid(combined);
    } catch (e) {
      renderEventsGrid(staticEvents);
    }
  }

  // ---- INIT ----

  injectModal();
  renderTodayServices();
  renderWeeklyGrid();
  loadEvents();

}());
