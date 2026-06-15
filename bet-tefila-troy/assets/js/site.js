const content = window.BET_TEFILA_CONTENT || {};
const CONTACT_EMAIL = content.email || 'office@bethtephilahtroy.org';
const CONTACT_PHONE = content.phone || '(518) 272-3182';

const BETH_TEPHILAH_PANO_SCRIPT = 'https://synagogues-360.anumuseum.org.il/wp-content/themes/synagogues360/assets/js/tour.js';
const BETH_TEPHILAH_PANO_XML = 'https://synagogues-360.anumuseum.org.il/wp-content/uploads/krpano/united_states_276.xml';
const BETH_TEPHILAH_PHOTOS = Array.from({ length: 9 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0');
  return {
    full: `https://synagogues-360.anumuseum.org.il/wp-content/uploads/2017/12/united_states_276_${number}.jpg`,
    thumb: `https://synagogues-360.anumuseum.org.il/wp-content/uploads/2017/12/united_states_276_${number}-170x170.jpg`,
    alt: `Beth Tephilah synagogue photo ${index + 1}`
  };
});
let bethTephilahPanoScriptPromise;
let bethTephilahPanoInitialized = false;

function loadBethTephilahPanoScript() {
  if (window.embedpano) return Promise.resolve();
  if (bethTephilahPanoScriptPromise) return bethTephilahPanoScriptPromise;
  const existing = document.querySelector(`script[src="${BETH_TEPHILAH_PANO_SCRIPT}"]`);
  bethTephilahPanoScriptPromise = new Promise((resolve, reject) => {
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = BETH_TEPHILAH_PANO_SCRIPT;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return bethTephilahPanoScriptPromise;
}

function showBethTephilahPanoFallback(hero) {
  const fallback = hero.querySelector('[data-pano-fallback]');
  if (fallback) fallback.hidden = false;
}

function initBethTephilahPano() {
  const target = document.getElementById('beth-tephilah-pano');
  const hero = document.querySelector('.beth-tephilah-360-hero');
  if (!target || !hero || bethTephilahPanoInitialized) return;
  bethTephilahPanoInitialized = true;
  loadBethTephilahPanoScript()
    .then(() => {
      if (!window.embedpano) throw new Error('KRPano embedpano is unavailable');
      window.embedpano({
        xml: BETH_TEPHILAH_PANO_XML,
        target: 'beth-tephilah-pano',
        html5: 'only',
        wmode: 'transparent',
        passQueryParameters: true,
        onready: () => hero.classList.add('is-pano-ready')
      });
      window.setTimeout(() => hero.classList.add('is-pano-ready'), 2400);
    })
    .catch(() => showBethTephilahPanoFallback(hero));
}

function setupBethTephilahPhotoGallery() {
  const host = document.querySelector('[data-beth-tephilah-gallery]');
  if (!host) return;
  host.innerHTML = BETH_TEPHILAH_PHOTOS.map((photo, index) => `
    <button class="beth-tephilah-photo-card reveal" type="button" data-photo-index="${index}" aria-label="Open ${photo.alt}">
      <img src="${photo.thumb}" data-full="${photo.full}" alt="${photo.alt}" loading="lazy" decoding="async" />
    </button>`).join('');

  const modal = document.createElement('div');
  modal.className = 'beth-tephilah-lightbox';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Beth Tephilah photo viewer');
  modal.innerHTML = `
    <button class="beth-tephilah-lightbox-close" type="button" aria-label="Close photo viewer">×</button>
    <figure>
      <img alt="" />
      <figcaption></figcaption>
    </figure>`;
  document.body.appendChild(modal);

  const modalImage = modal.querySelector('img');
  const modalCaption = modal.querySelector('figcaption');
  const closeButton = modal.querySelector('.beth-tephilah-lightbox-close');
  let previousFocus;

  const close = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (previousFocus) previousFocus.focus();
  };
  const open = (index, trigger) => {
    const photo = BETH_TEPHILAH_PHOTOS[index];
    if (!photo) return;
    previousFocus = trigger || document.activeElement;
    modalImage.src = photo.full;
    modalImage.alt = photo.alt;
    modalCaption.textContent = photo.alt;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  };

  host.addEventListener('click', event => {
    const button = event.target.closest('[data-photo-index]');
    if (!button) return;
    open(Number(button.dataset.photoIndex), button);
  });
  closeButton.addEventListener('click', close);
  modal.addEventListener('click', event => {
    if (event.target === modal) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('open')) close();
  });
}

function setupBethTephilahPhotoScroll() {
  document.querySelector('[data-scroll-to-photos]')?.addEventListener('click', event => {
    const target = document.getElementById('beth-tephilah-photos');
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

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
        <a class="brand-link" href="index.html" aria-label="${content.displayName || 'Beth Tephilah Synagogue'} home">
          <img src="assets/img/bet-tefila-mark.svg" alt="" width="52" height="52" />
          <span>
            <span class="brand-kicker">Historic Troy · Est. 1850</span>
            <span class="brand-name">${content.shortName || 'Beth Tephilah'}</span>
          </span>
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
          <h3 style="color:white;font-family:Georgia,serif;font-size:28px;margin:0 0 14px">${content.displayName || 'Beth Tephilah Synagogue'}</h3>
          <p>${content.hebrewMeaning || 'House of Prayer'} · ${content.address || '82 River Street, Troy, NY 12180'}</p>
          <p>Founded 1850 · Building 1909 · National Register 2016</p>
          <a href="${content.facebook || '#'}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;margin-top:12px">Follow on Facebook →</a>
        </div>
        <div>
          <strong style="color:white;font-weight:800;display:block;margin-bottom:10px">Visit & Pray</strong>
          <p>${content.address || '82 River Street, Troy, NY 12180'}</p>
          <a href="tel:+15182723182">${CONTACT_PHONE}</a>
          <a href="schedule.html">Prayer times & schedule</a>
          <a href="contact.html">Plan a visit</a>
          <a href="https://synagogues-360.anumuseum.org.il/gallery/beth-tephilah/" target="_blank" rel="noopener">360° sanctuary tour</a>
        </div>
        <div>
          <strong style="color:white;font-weight:800;display:block;margin-bottom:10px">Celebrate & Support</strong>
          <a href="book.html">Book your simcha</a>
          <a href="donate.html">Donate</a>
          <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
          <p style="margin-top:14px;font-size:13px;color:rgba(248,241,228,.5)">Beth Tephilah Synagogue is a 501(c)(3) nonprofit. Donations are tax-deductible.</p>
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
      <a class="button secondary" href="book.html?event=${encodeURIComponent(event.id)}" style="margin-top:12px;display:inline-flex">Plan this event →</a>
    </article>`).join('');
}

function hydrateEventSelect() {
  const select = document.querySelector('select[name="event"]');
  if (!select) return;
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('event');
  select.innerHTML = '<option value="">Choose a celebration</option>' +
    (content.events || []).map(event => `<option value="${event.id}">${event.title}</option>`).join('');
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
  const subject = data.get('subject') || form.dataset.subject || 'Beth Tephilah Synagogue inquiry';
  const lines = [];
  for (const [key, value] of data.entries()) {
    if (key !== 'subject' && value) lines.push(`${key.replace(/_/g, ' ')}: ${value}`);
  }
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

async function submitToScript(data) {
  const cfg = window.BET_TEFILA_CONFIG || {};
  const url = cfg.GOOGLE_SCRIPT_URL;
  if (!url || url.includes('YOUR_SCRIPT_ID')) return false;
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(data),
    });
    return true;
  } catch (e) {
    return false;
  }
}

function formTypeFromSubject(subject) {
  const s = (subject || '').toLowerCase();
  if (s.includes('simcha') || s.includes('booking')) return 'booking';
  if (s.includes('donation') || s.includes('pledge')) return 'donation';
  return 'contact';
}

function setupForms() {
  document.querySelectorAll('form[data-mailto]').forEach(form => {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      const status = form.querySelector('.form-status');
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      const formData = Object.fromEntries(new FormData(form));
      const subject = formData.subject || form.dataset.subject || 'Beth Tephilah inquiry';
      const type = formTypeFromSubject(subject);
      const sent = await submitToScript({ type, ...formData });

      if (sent) {
        if (status) status.textContent = '✓ Message received. The shul will be in touch within 24–48 hours.';
        form.reset();
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send'; }
      } else {
        if (status) status.textContent = 'Opening your email app…';
        if (submitBtn) { submitBtn.disabled = false; }
        window.location.href = mailtoFromForm(form);
      }
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
  }, { threshold: 0.1 });
  items.forEach(item => observer.observe(item));
}

function renderBottomNav() {
  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.setAttribute('aria-label', 'Quick navigation');
  const page = currentPage();
  nav.innerHTML = [
    { href: 'index.html',    icon: '🏛', label: 'Home' },
    { href: 'schedule.html', icon: '📅', label: 'Schedule' },
    { href: 'book.html',     icon: '✡', label: 'Simchas' },
    { href: 'donate.html',   icon: '💙', label: 'Donate' },
  ].map(({ href, icon, label }) =>
    `<a href="${href}"${page === href ? ' class="active" aria-current="page"' : ''}>
      <span class="bnav-icon">${icon}</span>
      <span>${label}</span>
    </a>`
  ).join('');
  document.body.appendChild(nav);
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

// Boot
renderHeader();
renderFooter();
renderBottomNav();
hydrateEvents();
setupBethTephilahPhotoGallery();
setupBethTephilahPhotoScroll();
initBethTephilahPano();
hydrateEventSelect();
setupDonationChips();
setupForms();
setupScrollProgress();
setupPageEntrance();
setupReveal();
registerServiceWorker();
