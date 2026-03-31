document.addEventListener("DOMContentLoaded", () => {

  /* ─── Mobile Menu ─── */
  const navLinks        = document.querySelectorAll(".nav-menu .nav-link");
  const menuOpenButton  = document.querySelector("#menu-open-button");
  const menuCloseButton = document.querySelector("#menu-close-button");

  const toggleMenu = () => {
    const isOpen = document.body.classList.toggle("show-mobile-menu");
    menuOpenButton.setAttribute("aria-expanded", String(isOpen));
  };

  menuOpenButton.addEventListener("click", toggleMenu);
  menuCloseButton.addEventListener("click", toggleMenu);
  navLinks.forEach(link => link.addEventListener("click", () => {
    if (document.body.classList.contains("show-mobile-menu")) toggleMenu();
  }));

  /* ─── Navbar scroll state ─── */
  const header = document.getElementById("site-header");
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
    scrollToTopBtn.classList.toggle("visible", window.scrollY > 300);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load

  /* ─── Scroll To Top ─── */
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  scrollToTopBtn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ─── Animated counter (Intersection Observer) ─── */
  const counters = document.querySelectorAll(".stat-number[data-target]");
  const countUp  = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const step     = 16;
    const increment = target / (duration / step);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, step);
  };

  if (counters.length) {
    const statsObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          statsObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => statsObs.observe(c));
  }

  /* ─── Staggered reveal on scroll ─── */
  const revealEls = document.querySelectorAll(
    ".service-card, .gallery-item, .contact-info, .pillar, .badge, .about-img-frame"
  );

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // slight cascade delay based on sibling index
        const siblings = [...entry.target.parentElement.children];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 70}ms`;
        entry.target.classList.add("revealed");
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  revealEls.forEach(el => {
    el.classList.add("will-reveal");
    revealObs.observe(el);
  });

  /* ─── Gallery Lightbox ─── */
  const lightbox     = document.getElementById("lightbox");
  const lightboxImg  = document.getElementById("lightbox-img");
  const closeBtn     = document.getElementById("lightbox-close");
  const prevBtn      = document.getElementById("lightbox-prev");
  const nextBtn      = document.getElementById("lightbox-next");
  const galleryImgs  = [...document.querySelectorAll(".gallery-item .gallery-image")];

  let currentIdx = 0;

  const openLightbox = (idx) => {
    currentIdx = idx;
    lightboxImg.src = galleryImgs[idx].src;
    lightboxImg.alt = galleryImgs[idx].alt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  };

  const showNext = () => openLightbox((currentIdx + 1) % galleryImgs.length);
  const showPrev = () => openLightbox((currentIdx - 1 + galleryImgs.length) % galleryImgs.length);

  document.querySelectorAll(".gallery-item").forEach((item, idx) => {
    item.addEventListener("click", () => openLightbox(idx));
  });
  closeBtn.addEventListener("click", closeLightbox);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    // Lightbox keys
    if (lightbox.classList.contains("active")) {
      if (e.key === "Escape")      closeLightbox();
      if (e.key === "ArrowRight")  showNext();
      if (e.key === "ArrowLeft")   showPrev();
      return;
    }
    // Modal Escape
    if (e.key === "Escape") {
      document.querySelectorAll(".policy-modal.active").forEach(m => closeModal(m.id));
    }
  });

  /* ─── Contact form via Formspree ─── */
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");

  // TODO: Replace YOUR_FORM_ID below with your actual Formspree form ID
  // Sign up free at https://formspree.io, create a form, and paste the ID here
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector(".btn-primary");
      const btnText = btn.querySelector("span");

      btn.disabled = true;
      btnText.textContent = "Sending…";

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: new FormData(contactForm),
        });

        if (response.ok) {
          contactForm.reset();
          formSuccess.hidden = false;
          formSuccess.textContent = "✓ Message sent! We'll be in touch soon.";
          formSuccess.style.color = "#2d7a4f";
          setTimeout(() => { formSuccess.hidden = true; }, 6000);
        } else {
          const data = await response.json();
          const errMsg = data?.errors?.map(e => e.message).join(", ") || "Something went wrong. Please try again.";
          formSuccess.hidden = false;
          formSuccess.textContent = "✗ " + errMsg;
          formSuccess.style.color = "#c0392b";
        }
      } catch (err) {
        formSuccess.hidden = false;
        formSuccess.textContent = "✗ Network error. Please try again.";
        formSuccess.style.color = "#c0392b";
      } finally {
        btn.disabled = false;
        btnText.textContent = "Send Message";
      }
    });
  }

  /* ─── Policy Modals ─── */
  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  const privacyBtn = document.getElementById("open-privacy");
  const termsBtn   = document.getElementById("open-terms");
  if (privacyBtn) privacyBtn.addEventListener("click", () => openModal("privacy-modal"));
  if (termsBtn)   termsBtn.addEventListener("click",   () => openModal("terms-modal"));

  document.querySelectorAll(".policy-modal-close").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.dataset.close));
  });

  document.querySelectorAll(".policy-modal").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal.id);
    });
  });

  /* ─── Email (Cloudflare obfuscation workaround) ─── */
  const u = "info";
  const d = "tistasurveyors.com";
  const addr = u + "@" + d;

  // Contact section
  const contactEmail = document.getElementById("contact-email");
  if (contactEmail) {
    contactEmail.href = "mailto:" + addr;
    contactEmail.textContent = addr;
  }

  // Modal email links
  ["privacy-email-1", "privacy-email-2", "terms-email-1"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.href = "mailto:" + addr;
      el.textContent = addr;
    }
  });

});
