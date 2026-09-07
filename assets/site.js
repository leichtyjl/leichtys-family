document.documentElement.classList.add('js');

const toggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-mobile-menu]');

if (toggle && menu) {
  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    menu.hidden = true;
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    menu.hidden = isOpen;
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

// ---- Reunion 2027 contact form ----
const contactForm = document.querySelector('#contactForm');
const contactStatus = document.querySelector('[data-contact-status]');
let tsWidgetId = null;

(function initTurnstile() {
  const holder = document.querySelector('.cf-turnstile');
  if (!holder) return;
  fetch('/api/contact').then((r) => r.json()).then((data) => {
    const key = data && data.siteKey;
    if (!key) return;
    holder.dataset.sitekey = key;
    const start = () => { tsWidgetId = window.turnstile.render(holder, { sitekey: key, theme: 'light' }); };
    if (window.turnstile) start();
    else window.addEventListener('load', () => { if (window.turnstile) start(); });
  }).catch(() => {});
})();

function setStatus(message, kind = 'info') {
  if (!contactStatus) return;
  contactStatus.textContent = message;
  contactStatus.hidden = false;
  contactStatus.dataset.kind = kind;
  contactStatus.className = 'form-status' + (kind ? ' is-' + kind : '');
}

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = contactForm.querySelector('[name="name"]').value.trim();
    const email = contactForm.querySelector('[name="email"]').value.trim();
    const message = contactForm.querySelector('[name="message"]').value.trim();
    const company = contactForm.querySelector('[name="company"]').value.trim(); // honeypot
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const errs = [];
    if (!name) errs.push('Please enter your name.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.push('Please enter a valid email address.');
    if (!message || message.length < 10) errs.push('Please enter a message.');
    if (errs.length) { setStatus(errs.join(' '), 'error'); return;
    }
    if (submitBtn) submitBtn.disabled = true;
    setStatus('Sending…', 'info');
    try {

      let token = '';
      if (tsWidgetId !== null && window.turnstile) {
        token = window.turnstile.getResponse(tsWidgetId) || '';
        if (!token) { setStatus('Please complete the verification check.', 'error'); if (submitBtn) submitBtn.disabled = false; return; }
      }
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, 'company': company, turnstileToken: token })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus('Thanks — your message has been received and forwarded. Please allow up to one week for a response before submitting another message.', 'success');
        contactForm.reset();
        if (window.turnstile) window.turnstile.reset();
      } else {
        setStatus(data.message || 'Your message could not be sent right now. Please try again in a few minutes.', 'error');
      }
    } catch (e) {
      setStatus('Your message could not be sent right now. Please try again in a few minutes.', 'error');
    } finally {
if (submitBtn) submitBtn.disabled = false;
    }
  });
}
