const content = window.BET_TEFILA_CONTENT || {};
const CONTACT_EMAIL = content.email || 'office@bethtephilahtroy.org';

function currentPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  return path === '' ? 'index.html' : path;
}

function renderHeader() {
  const host = document.querySelector('[data-shared-header]');
  if (!host) return;
  const nav = (content.nav || []).map(item => {
    const active = currentPage() === item.href ? ' aria-current="page"' : '';
    return `<a href="${item.href}"${active}>${item.label}</a>`;
  }).join('');
  host.innerHTML = `
    <div class="scroll-progress" data-scroll-progress></div>
    <header class="site-header">
      <div class="container navbar">
        <a class="brand-link" href="index.html" aria-label="${content.displayName || 'Bet Tefila Troy'} home">
          <img src="assets/img/bet-tefila-mark.svg" alt="" width="52" height="52" />
          <span><span class="brand-kicker">Historic Troy</span><span class="brand-name">${content.displayName || 'Bet Tefila Troy'}</span></span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
        <nav id="site-nav" class="nav-links" aria-label="Main navigation">${nav}</nav>
      </div>
    </header>`;
  const button = host.querySelector('.menu-toggle');
  const navEl = host.querySelector('.nav-links');
  button?.addEventListener('click', () => {
    const open = navEl.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });
}

function renderFooter() {
  const host = document.querySelector('[data-shared-footer]');
  if (!host) return;
  host.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <h3>${content.displayName || 'Bet Tefila Troy'}</h3>
          <p>A historic house of prayer on River Street, welcoming students, travelers, neighbors, and anyone looking for Jewish life in Troy.</p>
        </div>
        <div>
          <strong>Visit</strong>
          <p>${content.address || '82 River Street, Troy, NY 12180'}</p>
          <a href="contact.html">Plan a visit</a>
          <a href="event-registration.html">Join an event</a>
        </div>
        <div>
          <strong>Support</strong>
          <a href="donate.html">Donate</a>
          <a href="events.html">Upcoming events</a>
          <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
        </div>
      </div>
    </footer>`;
}

function hydrateEvents() {
  const host = document.querySelector('[data-events-grid]');
  if (!host) return;
  host.innerHTML = (content.events || []).map(event => `
    <article class="card reveal">
      <span class="tag">${event.tag}</span>
      <h3>${event.title}</h3>
      <p><strong>${event.date}</strong></p>
      <p>${event.description}</p>
      <a class="button secondary" href="event-registration.html?event=${encodeURIComponent(event.id)}">Join this event</a>
    </article>`).join('');
}

function hydrateEventSelect() {
  const select = document.querySelector('select[name="event"]');
  if (!select) return;
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('event');
  select.innerHTML = '<option value="">Choose an event</option>' + (content.events || []).map(event => `<option value="${event.id}">${event.title}</option>`).join('');
  if (requested) select.value = requested;
}

function setupDonationChips() {
  const amount = document.querySelector('input[name="amount"]');
  document.querySelectorAll('[data-amount]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-amount]').forEach(item => item.classList.remove('active'));
      chip.classList.add('active');
      if (amount) amount.value = chip.getAttribute('data-amount') || '';
    });
  });
}

function mailtoFromForm(form) {
  const data = new FormData(form);
  const subject = data.get('subject') || form.dataset.subject || 'Bet Tefila Troy inquiry';
  const lines = [];
  for (const [key, value] of data.entries()) {
    if (key !== 'subject') lines.push(`${key}: ${value}`);
  }
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

function setupForms() {
  document.querySelectorAll('form[data-mailto]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const status = form.querySelector('.form-status');
      if (status) status.textContent = 'Opening your email app with the form details. Please review and send.';
      window.location.href = mailtoFromForm(form);
    });
  });
}


function setupScrollProgress() {
  const progress = document.querySelector('[data-scroll-progress]');
  if (!progress) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

function setupPageEntrance() {
  requestAnimationFrame(() => document.documentElement.classList.add('page-ready'));
}
function setupReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(item => observer.observe(item));
}

renderHeader();
renderFooter();
hydrateEvents();
hydrateEventSelect();
setupDonationChips();
setupForms();
setupScrollProgress();
setupPageEntrance();
setupReveal();
