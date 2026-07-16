// ===================== GLOBAL STATE =====================
let lastScrollY = window.scrollY;
let ticking = false;

// ===================== LOADING SCREEN =====================
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  const barFill = document.getElementById('loadingBarFill');
  const percentText = document.getElementById('loadingPercent');

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'auto';
        initParticles();
        initHeroReveal();
      }, 400);
    }
    barFill.style.width = progress + '%';
    percentText.textContent = Math.floor(progress) + '%';
  }, 180);
});

// Lock scroll while loading
document.body.style.overflow = 'hidden';

// ===================== NAVBAR SCROLL BEHAVIOR =====================
const navbar = document.getElementById('navbar');

function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// ===================== MOBILE MENU =====================
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('active');
  mobileNav.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : 'auto';
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
    document.body.style.overflow = 'auto';
  });
});

// ===================== FLOATING PARTICLES =====================
function initParticles() {
  const container = document.getElementById('particles');
  const count = window.innerWidth < 768 ? 12 : 24;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 8 + 4;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 12 + 10) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.opacity = Math.random() * 0.4 + 0.2;
    container.appendChild(p);
  }
}

function initHeroReveal() {
  document.querySelector('.hero-content').style.opacity = '1';
}

// ===================== HERO SCROLL ENGINE (APPLE-STYLE) =====================
const heroBg = document.getElementById('heroBg');
const heroContent = document.getElementById('heroContent');
const scrollIndicator = document.getElementById('scrollIndicator');
const heroSection = document.querySelector('.hero');

function animateHeroScroll() {
  const scrollY = window.scrollY;
  const heroHeight = heroSection.offsetHeight;
  const progress = Math.min(scrollY / heroHeight, 1); // 0 -> 1 across hero height

  // Background: slow zoom + parallax translate
  const bgScale = 1 + progress * 0.25;
  const bgTranslateY = scrollY * 0.4;
  heroBg.style.transform = `translate3d(0, ${bgTranslateY}px, 0) scale(${bgScale})`;
  heroBg.style.filter = `blur(${progress * 8}px)`;

  // Content: fade + scale + move up
  const contentOpacity = Math.max(1 - progress * 1.8, 0);
  const contentScale = 1 - progress * 0.15;
  const contentTranslateY = scrollY * 0.5;
  heroContent.style.transform = `translate3d(0, ${contentTranslateY}px, 0) scale(${contentScale})`;
  heroContent.style.opacity = contentOpacity;

  // Scroll indicator fades fast
  scrollIndicator.style.opacity = Math.max(1 - progress * 4, 0);

  // Navbar
  updateNavbar();

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(animateHeroScroll);
    ticking = true;
  }
}, { passive: true });

// ===================== MOUSE PARALLAX ON HERO =====================
heroSection.addEventListener('mousemove', (e) => {
  const { innerWidth, innerHeight } = window;
  const x = (e.clientX / innerWidth - 0.5) * 20;
  const y = (e.clientY / innerHeight - 0.5) * 20;
  heroContent.style.marginLeft = `${x * 0.3}px`;
  heroBg.style.marginLeft = `${-x * 0.5}px`;
}, { passive: true });

heroSection.addEventListener('mouseleave', () => {
  heroContent.style.marginLeft = '0px';
  heroBg.style.marginLeft = '0px';
});
// ===================== SMOOTH ANCHOR SCROLLING =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = document.getElementById('navbar').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// ===================== ACTIVE NAV LINK ON SCROLL =====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  const navHeight = document.getElementById('navbar').offsetHeight;
  const scrollPos = window.scrollY + navHeight + 40;

  let currentId = sections[0] ? sections[0].id : '';

  sections.forEach(section => {
    if (scrollPos >= section.offsetTop) {
      currentId = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
}

// Combine with existing scroll listener via rAF (debounced)
let navTicking = false;
window.addEventListener('scroll', () => {
  if (!navTicking) {
    requestAnimationFrame(updateActiveNav);
    navTicking = true;
    setTimeout(() => { navTicking = false; }, 50);
  }
}, { passive: true });

// ===================== SCROLL REVEAL (IntersectionObserver) =====================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===================== ANIMATED COUNTERS =====================
const counterElements = document.querySelectorAll('.counter-number');

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    el.textContent = value.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counterElements.forEach(el => counterObserver.observe(el));

// ===================== RIPPLE EFFECT ON BUTTONS =====================
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// ===================== GALLERY LIGHTBOX =====================
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentGalleryIndex = 0;

function openLightbox(index) {
  currentGalleryIndex = index;
  updateLightboxImage();
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'auto';
}

function updateLightboxImage() {
  // Copy the background style class from the matching gallery image
  const activeItem = galleryItems[currentGalleryIndex];
  const imgEl = activeItem.querySelector('.gallery-image');
  lightboxImage.className = 'lightbox-image ' + imgEl.className.replace('gallery-image', '').trim();
}

function showNextImage() {
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
  updateLightboxImage();
}

function showPrevImage() {
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
  updateLightboxImage();
}

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', showNextImage);
lightboxPrev.addEventListener('click', showPrevImage);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showNextImage();
  if (e.key === 'ArrowLeft') showPrevImage();
});

// ===================== REVIEWS SLIDER =====================
const reviewsTrack = document.getElementById('reviewsTrack');
const reviewCards = document.querySelectorAll('.review-card');
const reviewsPrevBtn = document.getElementById('reviewsPrev');
const reviewsNextBtn = document.getElementById('reviewsNext');
const reviewsDotsContainer = document.getElementById('reviewsDots');

let currentReviewIndex = 0;
let reviewAutoTimer = null;

// Build dots
reviewCards.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.className = 'review-dot';
  dot.setAttribute('aria-label', `Go to review ${index + 1}`);
  if (index === 0) dot.classList.add('active');
  dot.addEventListener('click', () => {
    currentReviewIndex = index;
    updateReviewSlider();
    resetReviewAutoplay();
  });
  reviewsDotsContainer.appendChild(dot);
});

const reviewDots = document.querySelectorAll('.review-dot');

function updateReviewSlider() {
  const offset = -currentReviewIndex * 100;
  reviewsTrack.style.transform = `translate3d(${offset}%, 0, 0)`;

  reviewDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentReviewIndex);
  });
}

function nextReview() {
  currentReviewIndex = (currentReviewIndex + 1) % reviewCards.length;
  updateReviewSlider();
}

function prevReview() {
  currentReviewIndex = (currentReviewIndex - 1 + reviewCards.length) % reviewCards.length;
  updateReviewSlider();
}

function startReviewAutoplay() {
  reviewAutoTimer = setInterval(nextReview, 5000);
}

function resetReviewAutoplay() {
  clearInterval(reviewAutoTimer);
  startReviewAutoplay();
}

reviewsNextBtn.addEventListener('click', () => { nextReview(); resetReviewAutoplay(); });
reviewsPrevBtn.addEventListener('click', () => { prevReview(); resetReviewAutoplay(); });

updateReviewSlider();
startReviewAutoplay();

// ===================== BACK TO TOP BUTTON =====================
window.addEventListener('load', () => {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ===================== CONTACT FORM VALIDATION =====================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const nameField = document.getElementById('formName');
  const emailField = document.getElementById('formEmail');
  const phoneField = document.getElementById('formPhone');
  const messageField = document.getElementById('formMessage');
  const formSuccess = document.getElementById('formSuccess');

  function showFieldError(field, message) {
    const errorEl = field.parentElement.querySelector('.field-error');
    field.classList.add('invalid');
    if (errorEl) errorEl.textContent = message;
  }

  function clearFieldError(field) {
    const errorEl = field.parentElement.querySelector('.field-error');
    field.classList.remove('invalid');
    if (errorEl) errorEl.textContent = '';
  }

  function validateField(field) {
    const value = field.value.trim();

    if (field === nameField) {
      if (value.length < 2) {
        showFieldError(field, 'Please enter your full name.');
        return false;
      }
    }

    if (field === emailField) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        showFieldError(field, 'Please enter a valid email address.');
        return false;
      }
    }

    if (field === phoneField && value.length > 0) {
      const phonePattern = /^[\d\s()+-]{7,}$/;
      if (!phonePattern.test(value)) {
        showFieldError(field, 'Please enter a valid phone number.');
        return false;
      }
    }

    if (field === messageField) {
      if (value.length < 10) {
        showFieldError(field, 'Message should be at least 10 characters.');
        return false;
      }
    }

    clearFieldError(field);
    return true;
  }

  [nameField, emailField, phoneField, messageField].forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => clearFieldError(field));
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameField);
    const isEmailValid = validateField(emailField);
    const isPhoneValid = validateField(phoneField);
    const isMessageValid = validateField(messageField);

    if (isNameValid && isEmailValid && isPhoneValid && isMessageValid) {
      formSuccess.textContent = `Thank you, ${nameField.value.trim()}! Your message has been received — we'll get back to you shortly.`;
      formSuccess.classList.add('visible');
      contactForm.reset();

      setTimeout(() => {
        formSuccess.classList.remove('visible');
      }, 6000);
    }
  });
}

// ===================== CURSOR GLOW EFFECT (Desktop only) =====================
if (window.matchMedia('(pointer: fine)').matches) {
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  document.body.appendChild(cursorGlow);

  let glowX = 0, glowY = 0;
  let currentX = 0, currentY = 0;

  window.addEventListener('mousemove', (e) => {
    glowX = e.clientX;
    glowY = e.clientY;
  }, { passive: true });

  function animateCursorGlow() {
    currentX += (glowX - currentX) * 0.15;
    currentY += (glowY - currentY) * 0.15;
    cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(animateCursorGlow);
  }
  animateCursorGlow();
}

// ===================== MAGNETIC BUTTONS =====================
const magneticButtons = document.querySelectorAll('.btn');

magneticButtons.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate3d(0, 0, 0)';
  });
});