/* ============================================
   GLOBAL CONFIG — edit these values only
   ============================================ */
const CONFIG = {
  PHONE: "+91XXXXXXXXXX",
  EMAIL: "your@email.com",
  WHATSAPP: "91XXXXXXXXXX",
  INSTAGRAM: "https://instagram.com/yourprofile",
  FACEBOOK: "https://facebook.com/yourpage",
  YOUTUBE: "https://youtube.com/yourchannel",
  PINTEREST: "https://pinterest.com/yourprofile",
  MAP_EMBED: "YOUR_GOOGLE_MAP_EMBED_URL"
};

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById("loader");
  window.addEventListener("load", () => {
    setTimeout(() => loader?.classList.add("loaded"), 400);
  });

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById("site-header");
  const onScroll = () => {
    if (window.scrollY > 60) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll);
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  const navBackdrop = document.getElementById("nav-backdrop");

  function closeNav() {
    navLinks.classList.remove("open");
    navBackdrop?.classList.remove("visible");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navBackdrop?.classList.toggle("visible", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navBackdrop?.addEventListener("click", closeNav);
  navLinks?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeNav));

  /* ---------- Populate CONFIG-driven elements ---------- */
  const phoneLinks = document.querySelectorAll("#footer-phone, .config-phone");
  phoneLinks.forEach(el => {
    el.textContent = CONFIG.PHONE;
    el.href = `tel:${CONFIG.PHONE.replace(/\s+/g, "")}`;
  });

  const emailLinks = document.querySelectorAll("#footer-email, .config-email");
  emailLinks.forEach(el => {
    el.textContent = CONFIG.EMAIL;
    el.href = `mailto:${CONFIG.EMAIL}`;
  });

  const igLinks = document.querySelectorAll("#footer-instagram, #insta-follow-btn, .config-instagram");
  igLinks.forEach(el => el.href = CONFIG.INSTAGRAM);

  const fbLinks = document.querySelectorAll("#footer-facebook, .config-facebook");
  fbLinks.forEach(el => el.href = CONFIG.FACEBOOK);

  const pinLinks = document.querySelectorAll("#footer-pinterest, .config-pinterest");
  pinLinks.forEach(el => el.href = CONFIG.PINTEREST);

  const ytLinks = document.querySelectorAll("#footer-youtube, .config-youtube");
  ytLinks.forEach(el => el.href = CONFIG.YOUTUBE);

  const waLinks = document.querySelectorAll(".config-whatsapp");
  waLinks.forEach(el => el.href = `https://wa.me/${CONFIG.WHATSAPP}`);

  const mapEmbeds = document.querySelectorAll(".config-map-embed");
  mapEmbeds.forEach(el => el.src = CONFIG.MAP_EMBED);

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Hero entrance timeline ---------- */
  const heroTl = gsap.timeline({ delay: 0.6 });

  heroTl
    .to("#hero-img", { scale: 1, duration: 1.8, ease: "power2.out" }, 0)
    .from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, 0.2)
    .from(".hero-title .reveal-text", {
      yPercent: 110,
      duration: 1,
      ease: "power4.out",
      stagger: 0.12
    }, 0.35)
    .from(".hero-subheading", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, 0.9)
    .from(".hero-actions", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, 1.05)
    .from(".scroll-indicator", { opacity: 0, duration: 1 }, 1.3);

  // Set initial state for hero title lines (masked by overflow:hidden on .line)
  gsap.set(".hero-title .reveal-text", { yPercent: 0 });

  /* ---------- Generic scroll-triggered reveal (.reveal-up) ---------- */
  gsap.utils.toArray(".reveal-up").forEach((el, i) => {
    gsap.fromTo(el,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        delay: (i % 4) * 0.08, // slight stagger for grid siblings
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  /* ---------- "Darkroom reveal" for portfolio/gallery images ---------- */
  gsap.utils.toArray(".portfolio-item, .insta-item").forEach(item => {
    const img = item.querySelector("img");
    gsap.fromTo(img,
      { clipPath: "inset(100% 0% 0% 0%)", scale: 1.15 },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        duration: 1.2,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
  
  /* ---------- Cookie consent ---------- */
const cookieBanner = document.getElementById("cookie-banner");
if (cookieBanner && !localStorage.getItem("cookieConsent")) {
  setTimeout(() => cookieBanner.classList.add("visible"), 1200);
}
document.getElementById("cookie-accept")?.addEventListener("click", () => {
  localStorage.setItem("cookieConsent", "accepted");
  cookieBanner.classList.remove("visible");
});
document.getElementById("cookie-decline")?.addEventListener("click", () => {
  localStorage.setItem("cookieConsent", "declined");
  cookieBanner.classList.remove("visible");
});

/* ---------- Newsletter signup ---------- */
const newsletterForm = document.getElementById("newsletter-form");
newsletterForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const statusEl = document.getElementById("newsletter-status");
  // Replace with a real API call to your email provider (Mailchimp, ConvertKit, etc.)
  statusEl.textContent = "Thanks for subscribing!";
  statusEl.className = "form-status success";
  newsletterForm.reset();
});

  /* ---------- Animated counters (About page stats) ---------- */
  gsap.utils.toArray(".counter").forEach(counter => {
    const target = +counter.dataset.target;
    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: counter,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            counter.textContent = Math.floor(obj.val).toLocaleString();
          }
        });
      }
    });
  });

  /* ---------- Section title underline draw (optional flourish) ---------- */
  gsap.utils.toArray(".section-title").forEach(title => {
    gsap.fromTo(title,
      { backgroundSize: "0% 1px" },
      {
        backgroundSize: "100% 1px",
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: title, start: "top 85%" }
      }
    );
  });

});
document.addEventListener("DOMContentLoaded", () => {

  /* ============================================
     Testimonial Slider (home + testimonials page)
     ============================================ */
  const track = document.getElementById("testimonial-track");
  if (track) {
    const slides = Array.from(track.querySelectorAll(".testimonial-slide"));
    const dotsWrap = document.getElementById("slider-dots");
    const prevBtn = document.getElementById("slider-prev");
    const nextBtn = document.getElementById("slider-next");
    let current = 0;
    let autoTimer;

    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(index) {
      slides[current].classList.remove("active");
      dots[current].classList.remove("active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("active");
      dots[current].classList.add("active");
      resetAutoplay();
    }

    function resetAutoplay() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 6000);
    }

    prevBtn?.addEventListener("click", () => goTo(current - 1));
    nextBtn?.addEventListener("click", () => goTo(current + 1));

    slides[0].classList.add("active");
    resetAutoplay();
  }

  /* ============================================
     Portfolio Lightbox (used on portfolio.html)
     ============================================ */
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeBtn = document.getElementById("lightbox-close");
    const prevBtn = document.getElementById("lightbox-prev");
    const nextBtn = document.getElementById("lightbox-next");

    // Gathers every gallery item marked with [data-lightbox]
    const items = Array.from(document.querySelectorAll("[data-lightbox]"));
    let currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      updateLightbox();
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function updateLightbox() {
      const item = items[currentIndex];
      const fullSrc = item.dataset.full || item.querySelector("img").src;
      const caption = item.dataset.caption || "";

      gsap.fromTo(lightboxImg, { opacity: 0 }, { opacity: 1, duration: 0.4 });
      lightboxImg.src = fullSrc;
      lightboxCaption.textContent = caption;
    }

    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }

    items.forEach((item, index) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        openLightbox(index);
      });
    });

    closeBtn?.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    prevBtn?.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateLightbox();
    });
    nextBtn?.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % items.length;
      updateLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevBtn?.click();
      if (e.key === "ArrowRight") nextBtn?.click();
    });
  }

});
document.addEventListener("DOMContentLoaded", () => {

  /* ============================================
     Generic form validation + fake submit handler
     (Works for both #booking-form and #contact-form)
     ============================================ */
  const forms = document.querySelectorAll("[data-inquiry-form]");

  forms.forEach(form => {
    const statusEl = form.querySelector(".form-status");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors(form);

      const requiredFields = form.querySelectorAll("[required]");
      let isValid = true;

      requiredFields.forEach(field => {
        const value = field.value.trim();

        if (!value) {
          showError(field, "This field is required.");
          isValid = false;
          return;
        }

        if (field.type === "email" && !isValidEmail(value)) {
          showError(field, "Please enter a valid email address.");
          isValid = false;
        }

        if (field.type === "tel" && !isValidPhone(value)) {
          showError(field, "Please enter a valid phone number.");
          isValid = false;
        }
      });

      if (!isValid) {
        setStatus(statusEl, "Please fix the highlighted fields.", "error");
        return;
      }

      // ---- SMTP submission hook ----
      // Replace this block with a real fetch() call to your backend / form
      // endpoint (e.g. Formspree, EmailJS, or your own PHP/Node mailer) once
      // SMTP_SETTINGS are configured. Example:
      //
      // fetch("YOUR_ENDPOINT", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(Object.fromEntries(new FormData(form)))
      // })
      //   .then(() => setStatus(statusEl, "Thank you! Your inquiry has been sent.", "success"))
      //   .catch(() => setStatus(statusEl, "Something went wrong. Please try again.", "error"));

      setStatus(statusEl, "Thank you! Your inquiry has been received. We'll be in touch shortly.", "success");
      form.reset();
    });
  });

  function showError(field, message) {
    field.classList.add("field-error");
    const errorEl = field.parentElement.querySelector(".field-error-msg");
    if (errorEl) errorEl.textContent = message;
  }

  function clearErrors(form) {
    form.querySelectorAll(".field-error").forEach(f => f.classList.remove("field-error"));
    form.querySelectorAll(".field-error-msg").forEach(e => e.textContent = "");
  }

  function setStatus(el, message, type) {
    if (!el) return;
    el.textContent = message;
    el.className = `form-status ${type}`;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    return /^[\d\s()+-]{7,20}$/.test(value);
  }

  /* ============================================
     Click-to-call / email / WhatsApp quick actions
     (buttons use .config-phone/.config-email/.config-whatsapp
      classes already populated by main.js CONFIG)
     ============================================ */
  document.querySelectorAll(".quick-action-call").forEach(btn => {
    btn.href = `tel:${CONFIG.PHONE.replace(/\s+/g, "")}`;
  });
  document.querySelectorAll(".quick-action-email").forEach(btn => {
    btn.href = `mailto:${CONFIG.EMAIL}`;
  });
  document.querySelectorAll(".quick-action-whatsapp").forEach(btn => {
    const prefill = encodeURIComponent("Hi VÉRITÉ, I'd like to inquire about a photography session.");
    btn.href = `https://wa.me/${CONFIG.WHATSAPP}?text=${prefill}`;
  });

});

/* ---------- Page transition (fade/wipe between internal links) ---------- */
  const transitionEl = document.getElementById("page-transition");

  // Reveal current page on load
  if (transitionEl) {
    gsap.to(transitionEl, {
      scaleY: 0,
      transformOrigin: "top",
      duration: 0.8,
      ease: "power3.inOut",
      delay: 0.1
    });
  }

  // Intercept internal link clicks to play exit animation first
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      const isSamePage = href === window.location.pathname.split("/").pop();
      const opensNewTab = link.target === "_blank";

      if (!isSamePage && !opensNewTab) {
        e.preventDefault();
        gsap.to(transitionEl, {
          scaleY: 1,
          transformOrigin: "bottom",
          duration: 0.6,
          ease: "power3.inOut",
          onComplete: () => { window.location.href = href; }
        });
      }
    });
  });