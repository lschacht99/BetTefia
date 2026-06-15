const content = window.BET_TEFILA_CONTENT || {};
const CONTACT_EMAIL = content.email || 'office@bethtephilahtroy.org';
const CONTACT_PHONE = content.phone || '(518) 272-3182';

const BETH_TEPHILAH_PHOTOS = Array.from({ length: 9 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0');
  return {
    full: `https://synagogues-360.anumuseum.org.il/wp-content/uploads/2017/12/united_states_276_${number}.jpg`,
    thumb: `https://synagogues-360.anumuseum.org.il/wp-content/uploads/2017/12/united_states_276_${number}-170x170.jpg`,
    alt: `Beth Tephila synagogue photo ${index + 1}`
  };
});

function setupBethTephilahHostedTour() {
  const hero = document.querySelector('.beth-tephilah-360-hero');
  const iframe = document.getElementById('beth-tephilah-pano');
  if (!hero || !iframe) return;
  iframe.addEventListener('load', () => hero.classList.add('is-pano-ready'), { once: true });
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
  modal.setAttribute('aria-label', 'Beth Tephila photo viewer');
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
        <a class="brand-link" href="index.html" aria-label="${content.displayName || 'Beth Tephila Synagogue'} home">
          <img src="assets/img/bet-tefila-mark.svg" alt="" width="52" height="52" />
          <span><span class="brand-kicker">Historic Troy</span><span class="brand-name">${content.displayName || 'Beth Tephila Synagogue'}</span></span>
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
          <h3>${content.displayName || 'Beth Tephila Synagogue'}</h3>
          <p>A living historic house of prayer on River Street, welcoming students, travelers, neighbors, and anyone looking for Jewish life in Troy.</p>
        </div>
        <div>
          <strong>Visit</strong>
          <p>${content.address || '82 River Street, Troy, NY 12180'}</p>
          <p>${CONTACT_PHONE}</p>
          <a href="contact.html">Plan a visit</a>
          <a href="event-registration.html">Join an event</a>
        </div>
        <div>
          <strong>Support</strong>
          <a href="donate.html">Donate</a>
          <a href="events.html">Upcoming events</a>
          <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
          <a href="${content.facebook || '#'}">Facebook updates</a>
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
  const subject = data.get('subject') || form.dataset.subject || 'Beth Tephila Synagogue inquiry';
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
setupBethTephilahPhotoGallery();
setupBethTephilahPhotoScroll();
setupBethTephilahHostedTour();
hydrateEventSelect();
setupDonationChips();
setupForms();
setupScrollProgress();
setupPageEntrance();
setupReveal();
