/* ============================================================
   ELITE Hotel Academy – main.js
   ============================================================ */

'use strict';

/* ===== Preloader ===== */
let preloaderDismissed = false;
function dismissPreloader() {
  if (preloaderDismissed) return;
  preloaderDismissed = true;
  const preloader = document.getElementById('preloader');
  if (preloader) preloader.classList.add('hidden');
}

window.addEventListener('load', () => {
  setTimeout(dismissPreloader, 1800);
});

// Fallback safety for mobile devices on slower connections
setTimeout(dismissPreloader, 3200);

/* ===== AOS Init ===== */
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 40,
  disable: () => window.innerWidth < 768,
});

/* ===== Navbar: stays fixed and always visible ===== */
const nav = document.getElementById('mainNav');

function handleNavbarScroll() {
  if (!nav) return;
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', () => {
  handleNavbarScroll();
  updateActiveNav();
  toggleBackToTop();
  animateProgressBars();
});

handleNavbarScroll();

/* ===== Active Nav Link on scroll ===== */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.btn-nav)');
  let current = '';
  
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 140 && rect.bottom >= 80) {
      current = sec.getAttribute('id');
    }
  });

  if (!current && window.scrollY < 200) {
    current = 'home';
  }

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === `#${current}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ===== Smooth close mobile menu on link click ===== */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const bsCollapse = document.getElementById('navbarNav');
    const collapse = bootstrap.Collapse.getInstance(bsCollapse);
    if (collapse) collapse.hide();
  });
});

/* ===== Hero Background Slider ===== */
const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.hero-slide-dots .dot');
let currentSlide = 0;
let slideInterval;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() {
  goToSlide((currentSlide + 1) % slides.length);
}

function startSlideshow() {
  slideInterval = setInterval(nextSlide, 5500);
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    clearInterval(slideInterval);
    goToSlide(i);
    startSlideshow();
  });
});

startSlideshow();

/* ===== Counter Animation ===== */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    if (counter.dataset.animated) return;
    const target = +counter.getAttribute('data-count');
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    };
    counter.dataset.animated = 'true';
    update();
  });
}

/* Trigger counters when hero is visible */
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  observer.observe(heroStats);
}

/* ===== Progress Bar Animation ===== */
let progressAnimated = false;
function animateProgressBars() {
  if (progressAnimated) return;
  const section = document.getElementById('why-us');
  if (!section) return;
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    progressAnimated = true;
    document.querySelectorAll('.progress-fill').forEach(bar => {
      const width = bar.getAttribute('data-width');
      setTimeout(() => { bar.style.width = width + '%'; }, 200);
    });
  }
}

/* ===== Gallery Filter ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    galleryItems.forEach(item => {
      const category = item.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        item.style.display = '';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 50);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 400);
      }
    });
  });
});

galleryItems.forEach(item => {
  item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
});

/* ===== Gallery 3D Tilt ===== */
const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;

galleryItems.forEach(item => {
  item.addEventListener('mousemove', (e) => {
    if (isTouchDevice()) return;
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -10;  // max ±10deg
    const rotY = ((x - cx) / cx) *  10;
    item.classList.add('tilt-active');
    item.classList.remove('tilt-restore');
    item.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`;
  });

  item.addEventListener('mouseleave', () => {
    if (isTouchDevice()) return;
    item.classList.remove('tilt-active');
    item.classList.add('tilt-restore');
    item.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    setTimeout(() => item.classList.remove('tilt-restore'), 500);
  });
});

/* ===== GLightbox Init ===== */
const lightbox = GLightbox({
  touchNavigation: true,
  loop: true,
  autoplayVideos: true,
  openEffect: 'zoom',
  closeEffect: 'zoom',
  slideEffect: 'slide',
});

/* ===== Testimonials Slider ===== */
const track = document.querySelector('.testimonial-track');
const tDotsContainer = document.getElementById('tDots');
const prevBtn = document.getElementById('tPrev');
const nextBtn = document.getElementById('tNext');

let currentTestimonial = 0;
let itemsVisible = getVisibleItems();
let autoSlideInterval;

function getVisibleItems() {
  if (window.innerWidth >= 992) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

function getAllCards() {
  return document.querySelectorAll('.testimonial-card');
}

function getTotalDots() {
  const cards = getAllCards();
  return Math.max(1, Math.ceil(cards.length / itemsVisible));
}

function buildDots() {
  if (!tDotsContainer) return;
  tDotsContainer.innerHTML = '';
  const totalDots = getTotalDots();
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('span');
    dot.classList.add('t-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      clearInterval(autoSlideInterval);
      goToTestimonial(i);
      startAutoSlide();
    });
    tDotsContainer.appendChild(dot);
  }
}

function goToTestimonial(index) {
  if (!track) return;
  const totalDots = getTotalDots();
  currentTestimonial = Math.max(0, Math.min(index, totalDots - 1));

  const sliderWidth = track.parentElement.offsetWidth;
  const gapPx = parseFloat(getComputedStyle(track).gap) || 24;
  const slideDistance = currentTestimonial * (sliderWidth + gapPx);
  track.style.transform = `translateX(-${slideDistance}px)`;

  document.querySelectorAll('.t-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentTestimonial);
  });
}

function updateTestimonialLayout() {
  if (!track) return;
  itemsVisible = getVisibleItems();
  const allCards = getAllCards();
  const gapRem = 1.5;
  const cardWidth = `calc((100% - ${(itemsVisible - 1) * gapRem}rem) / ${itemsVisible})`;

  allCards.forEach(card => {
    card.style.minWidth = cardWidth;
    card.style.maxWidth = cardWidth;
    card.style.flexShrink = '0';
  });

  buildDots();
  goToTestimonial(Math.min(currentTestimonial, getTotalDots() - 1));
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    clearInterval(autoSlideInterval);
    const totalDots = getTotalDots();
    goToTestimonial(currentTestimonial === 0 ? totalDots - 1 : currentTestimonial - 1);
    startAutoSlide();
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    clearInterval(autoSlideInterval);
    const totalDots = getTotalDots();
    goToTestimonial(currentTestimonial === totalDots - 1 ? 0 : currentTestimonial + 1);
    startAutoSlide();
  });
}

function startAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(() => {
    const totalDots = getTotalDots();
    goToTestimonial(currentTestimonial === totalDots - 1 ? 0 : currentTestimonial + 1);
  }, 4500);
}

window.addEventListener('resize', () => {
  clearInterval(autoSlideInterval);
  updateTestimonialLayout();
  startAutoSlide();
});

updateTestimonialLayout();
startAutoSlide();

/* ===== Back to Top ===== */
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== Footer Year ===== */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===== Smooth scroll for anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===== Reveal on scroll (additional) ===== */
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.program-card, .why-card, .contact-card').forEach(el => {
  revealObserver.observe(el);
});

/* ===== Parallax on Hero (Desktop only) ===== */
window.addEventListener('scroll', () => {
  if (window.innerWidth < 768) return;
  const scrollY = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
    heroContent.style.opacity = `${1 - scrollY / 600}`;
  }
});

/* ===== Touch/Swipe Support for Testimonials ===== */
let touchStartX = 0;
let touchEndX = 0;

const sliderEl = document.querySelector('.testimonials-slider');
if (sliderEl) {
  sliderEl.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  sliderEl.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      clearInterval(autoSlideInterval);
      const totalDots = getTotalDots();
      if (diff > 0) {
        goToTestimonial(currentTestimonial === totalDots - 1 ? 0 : currentTestimonial + 1);
      } else {
        goToTestimonial(currentTestimonial === 0 ? totalDots - 1 : currentTestimonial - 1);
      }
      startAutoSlide();
    }
  }, { passive: true });
}

