// Minyan interactive schedule — localStorage-based RSVP for today's services

(function () {
  const content = window.BET_TEFILA_CONTENT || {};
  const schedule = content.minyanSchedule || [];

  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Shabbat'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function rsvpKey(serviceId) {
    return `bt_rsvp_${todayKey()}_${serviceId}`;
  }

  function isRsvped(serviceId) {
    return localStorage.getItem(rsvpKey(serviceId)) === '1';
  }

  function toggleRsvp(serviceId, btn, countEl) {
    const already = isRsvped(serviceId);
    if (already) {
      localStorage.removeItem(rsvpKey(serviceId));
      btn.classList.remove('confirmed');
      btn.textContent = "I'll be there";
      if (countEl) countEl.textContent = '';
    } else {
      localStorage.setItem(rsvpKey(serviceId), '1');
      btn.classList.add('confirmed');
      btn.textContent = "I'm coming ✓";
      if (countEl) countEl.textContent = 'You're confirmed';
    }
  }

  function renderTodayServices() {
    const now = new Date();
    const dayIndex = now.getDay(); // 0 = Sunday, 6 = Saturday
    const dayData = schedule.find(d => d.dayIndex === dayIndex);

    const dateDisplay = document.getElementById('today-date-display');
    const dayName = document.getElementById('today-day-name');
    const servicesEl = document.getElementById('today-services');

    if (dateDisplay) {
      dateDisplay.textContent = `${DAYS[dayIndex]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    }
    if (dayName) {
      dayName.textContent = dayIndex === 6 ? 'Shabbat Services' : `${DAYS[dayIndex]} Prayer Times`;
    }

    if (!servicesEl || !dayData) return;

    servicesEl.innerHTML = dayData.services.map(service => {
      const id = `${service.id}-${todayKey()}`;
      const confirmed = isRsvped(id);
      return `
        <div class="minyan-service">
          <span class="minyan-service-name">${service.name}</span>
          <span class="minyan-service-time">${service.time}</span>
          <div class="minyan-service-rsvp">
            <button
              class="btn-rsvp${confirmed ? ' confirmed' : ''}"
              type="button"
              data-service-id="${id}"
              aria-label="${confirmed ? 'Cancel RSVP for' : 'RSVP for'} ${service.name} at ${service.time}"
            >${confirmed ? "I'm coming ✓" : "I'll be there"}</button>
            <span class="minyan-count" data-count-for="${id}">${confirmed ? "You're confirmed" : ''}</span>
          </div>
        </div>`;
    }).join('');

    servicesEl.querySelectorAll('.btn-rsvp').forEach(btn => {
      btn.addEventListener('click', () => {
        const sid = btn.dataset.serviceId;
        const countEl = servicesEl.querySelector(`[data-count-for="${sid}"]`);
        toggleRsvp(sid, btn, countEl);
      });
    });
  }

  function renderWeeklyGrid() {
    const grid = document.getElementById('weekly-grid');
    if (!grid || !schedule.length) return;

    const today = new Date().getDay();

    grid.innerHTML = schedule.map(day => {
      const isToday = day.dayIndex === today;
      const isShabbat = day.isShabbat;
      let cls = 'day-column';
      if (isToday) cls += ' is-today';
      if (isShabbat) cls += ' is-shabbat';

      const services = day.services.map(s => `
        <div class="day-service">
          <div class="day-service-label">${s.name}</div>
          <div class="day-service-time">${s.time}</div>
        </div>`).join('');

      return `
        <div class="${cls}" ${isToday ? 'aria-current="date"' : ''}>
          <div class="day-header">${isToday ? '★ ' : ''}${day.short}${isToday ? ' (Today)' : ''}</div>
          <div class="day-services">${services}</div>
        </div>`;
    }).join('');
  }

  function renderEventsGrid() {
    const grid = document.getElementById('events-grid');
    if (!grid) return;
    const upcoming = (content.upcomingEvents || []);
    if (!upcoming.length) return;

    grid.innerHTML = upcoming.map(evt => `
      <article class="event-card">
        <span class="tag">${evt.tag}</span>
        <h3>${evt.title}</h3>
        <p><strong>${evt.dateDisplay}</strong></p>
        <p>${evt.description}</p>
        ${evt.rsvpRequired
          ? `<a class="button secondary" href="mailto:${content.email || 'office@bethtephilahtroy.org'}?subject=RSVP: ${encodeURIComponent(evt.title)}" style="margin-top:12px;display:inline-flex">RSVP →</a>`
          : `<a class="button secondary" href="contact.html" style="margin-top:12px;display:inline-flex">Learn more →</a>`
        }
      </article>`).join('');
  }

  // Init
  renderTodayServices();
  renderWeeklyGrid();
  renderEventsGrid();
}());
