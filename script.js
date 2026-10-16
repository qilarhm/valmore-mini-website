const slides = [
  {
    title: 'Go further.<br><em>Move lighter.</em>',
    description: 'Engineered to power every journey, with a lighter footprint.',
    image: 'assets/hero-sunset.jpg',
    alt: 'Sunset over layered mountain ridges',
    caption: 'LONG RANGE. FAST CHARGING.'
  },
  {
    title: 'Power that<br><em>keeps moving.</em>',
    description: 'Intelligent battery technology that makes every kilometer count.',
    image: 'assets/hero-charging.jpg',
    alt: 'Electric vehicle charging at home',
    caption: 'MADE FOR THE EVERYDAY.'
  },
  {
    title: 'The future<br><em>is on the road.</em>',
    description: 'Discover a new way to travel with a lighter footprint.',
    image: 'assets/hero-mountains.jpg',
    alt: 'Alpine lake and mountains at dusk',
    caption: 'NEW ENERGY. YOUR NEXT CHAPTER.'
  }
];

const photo = document.querySelector('#hero-photo');
const dots = document.querySelector('#slider-dots');
const title = document.querySelector('#hero-title');
const description = document.querySelector('#hero-description');
const count = document.querySelector('#slide-count');
const caption = document.querySelector('#hero-caption');
let activeSlide = 0;
let autoplay;

function renderSlide(index) {
  if (!photo) return;
  activeSlide = (index + slides.length) % slides.length;
  const slide = slides[activeSlide];
  photo.style.opacity = '0.45';
  window.setTimeout(() => {
    photo.style.backgroundImage = `url("${slide.image}")`;
    photo.setAttribute('aria-label', slide.alt);
    photo.style.opacity = '1';
  }, 140);
  title.innerHTML = slide.title;
  description.textContent = slide.description;
  count.innerHTML = `0${activeSlide + 1} <i>/ 0${slides.length}</i>`;
  caption.textContent = slide.caption;
  [...dots.children].forEach((dot, dotIndex) => {
    const isCurrent = dotIndex === activeSlide;
    dot.classList.toggle('active', isCurrent);
    dot.setAttribute('aria-current', String(isCurrent));
  });
}

function stopAutoplay() {
  window.clearInterval(autoplay);
}

function startAutoplay() {
  stopAutoplay();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && !document.hidden) {
    autoplay = window.setInterval(() => renderSlide(activeSlide + 1), 6500);
  }
}

if (photo && dots) {
  slides.forEach((slide, index) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show slide ${index + 1}: ${slide.caption.toLowerCase()}`);
    dot.addEventListener('click', () => {
      renderSlide(index);
      startAutoplay();
    });
    dots.append(dot);
  });
  document.querySelector('#previous-slide').addEventListener('click', () => {
    renderSlide(activeSlide - 1);
    startAutoplay();
  });
  document.querySelector('#next-slide').addEventListener('click', () => {
    renderSlide(activeSlide + 1);
    startAutoplay();
  });
  document.querySelector('.hero').addEventListener('mouseenter', stopAutoplay);
  document.querySelector('.hero').addEventListener('mouseleave', startAutoplay);
  document.addEventListener('visibilitychange', startAutoplay);
  renderSlide(0);
  startAutoplay();
}

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    }
  });
}

const themeToggle = document.querySelector('.theme-toggle');
const themeStorageKey = 'valmore-theme';
let savedTheme;
try {
  savedTheme = window.localStorage.getItem(themeStorageKey);
} catch {
  savedTheme = null;
}
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (!themeToggle) return;
  const light = theme === 'light';
  themeToggle.setAttribute('aria-pressed', String(light));
  themeToggle.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} mode`);
  themeToggle.querySelector('.theme-icon').textContent = light ? '☾' : '☼';
  themeToggle.querySelector('.theme-label').textContent = light ? 'Dark' : 'Light';
}
applyTheme(savedTheme || (prefersLight ? 'light' : 'dark'));
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    try {
      window.localStorage.setItem(themeStorageKey, nextTheme);
    } catch {
      // Keep the toggle usable when storage is unavailable.
    }
    applyTheme(nextTheme);
  });
}

const quoteForm = document.querySelector('#quote-form');
if (quoteForm) {
  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!quoteForm.reportValidity()) return;
    const values = new FormData(quoteForm);
    const subject = encodeURIComponent(`Voltra One enquiry from ${values.get('name')}`);
    const body = encodeURIComponent(
      `Name: ${values.get('name')}\nEmail: ${values.get('email')}\n\n${values.get('message')}`
    );
    window.location.href = `mailto:hello@valmore.id?subject=${subject}&body=${body}`;
  });
}
