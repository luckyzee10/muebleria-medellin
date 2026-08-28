document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  initNavigation();
  initContactForm();
  initRevealEffects();

  const currentYear = document.getElementById('currentYear');
  if (currentYear) currentYear.textContent = new Date().getFullYear();
});

function applyConfig() {
  if (typeof SITE_CONFIG === 'undefined') return;

  const { instagram, whatsapp, whatsappDisplay, address } = SITE_CONFIG;
  const instagramUrl = `https://www.instagram.com/${instagram}`;
  const whatsappUrl = `https://wa.me/${whatsapp}`;

  document.querySelectorAll('#instagramLink, #instagramLinkContact').forEach((element) => {
    element.href = instagramUrl;
    if (element.id === 'instagramLinkContact') {
      const label = element.querySelector('strong');
      if (label) label.textContent = `@${instagram}`;
    }
  });

  document.querySelectorAll('#whatsappLink, #whatsappFloat').forEach((element) => {
    element.href = whatsappUrl;
  });

  const whatsappLabel = document.querySelector('#whatsappLink strong');
  if (whatsappLabel) whatsappLabel.textContent = whatsappDisplay;

  const addressText = document.getElementById('addressText');
  if (addressText) addressText.textContent = address;
}

function initNavigation() {
  const header = document.getElementById('header');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!header || !toggle || !links) return;

  const setHeaderState = () => header.classList.toggle('scrolled', window.scrollY > 40);
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  const closeMenu = () => {
    links.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    document.body.classList.remove('menu-open');
  };

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('menu-open', isOpen);
  });

  links.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const interes = document.getElementById('interes').value;
    const mensaje = document.getElementById('mensaje').value.trim();

    let text = `Hola, soy ${nombre}.`;
    if (interes) text += ` Estoy buscando ${interes}.`;
    if (telefono) text += ` Mi teléfono es ${telefono}.`;
    text += `\n\n${mensaje}`;

    const whatsapp = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG.whatsapp : '57XXXXXXXXXX';
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  });
}

function initRevealEffects() {
  const elements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

  elements.forEach((element) => observer.observe(element));
}
