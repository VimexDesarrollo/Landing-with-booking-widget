/* ============================================================
   VIMEX — INTERACTIONS
   ============================================================ */

(function () {
  /* ------------------ ANIMATION GATE ------------------ */
  // Enable hidden-state reveal styles. Auto-kill after 6s so content
  // is never permanently hidden if animations fail to fire.
  document.body.classList.add("anim-ready");
  setTimeout(() => {
    document.body.classList.remove("anim-ready");
  }, 6000);

  /* ------------------ CUSTOM CURSOR ------------------ */
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  window.addEventListener("mousemove", (e) => {
    if (!document.body.classList.contains("cursor-ready")) document.body.classList.add("cursor-ready");
    mx = e.clientX; my = e.clientY;
    if (dot) dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
  });
  function raf() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    if (ring) ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(raf);
  }
  raf();

  // Cursor hover detection
  const hoverTargets = "a, button, .dest__card, .why__row, .service, .faq__q, [data-cursor='hover']";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverTargets)) document.body.classList.add("cursor-hover");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverTargets)) document.body.classList.remove("cursor-hover");
  });

  /* ------------------ LOADER ------------------ */
  const loader = document.querySelector(".loader");
  const hero = document.querySelector(".hero");
  setTimeout(() => {
    if (loader) loader.classList.add("is-done");
    if (hero) hero.classList.add("is-ready");
  }, 600);
  setTimeout(() => { if (loader) loader.remove(); }, 2900);

  /* ------------------ NAV HIDE ON SCROLL ------------------ */
  const nav = document.querySelector(".nav");
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    document.body.classList.toggle("is-scrolled", y > 60);
    if (y > 80 && y > lastY) nav.classList.add("is-hidden");
    else nav.classList.remove("is-hidden");
    lastY = y;
  }, { passive: true });

  /* ------------------ LANG TOGGLE ------------------ */
  const langButtons = document.querySelectorAll(".nav__lang button");
  function setLang(lang) {
    document.documentElement.dataset.lang = lang;
    langButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.lang === lang));
    document.querySelectorAll("[data-en]").forEach((el) => {
      const key = lang === "en" ? "en" : "es";
      el.innerHTML = el.dataset[key] || el.innerHTML;
    });
    document.querySelectorAll("[data-en-attr]").forEach((el) => {
      const k = lang === "en" ? "enAttr" : "esAttr";
      const v = el.dataset[k];
      if (v) {
        const [attr, ...rest] = v.split("|");
        el.setAttribute(attr, rest.join("|"));
      }
    });
    // Rebuild hero title splits because we changed innerHTML
    splitHero();
    splitFooter();
  }
  langButtons.forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));

  /* ------------------ SPLIT TEXT (hero title) ------------------ */
  function splitWord(el) {
    if (!el || el.dataset.split) return;
    const text = el.textContent;
    el.textContent = "";
    text.split(" ").forEach((w, i, arr) => {
      const word = document.createElement("span");
      word.className = "word";
      const inner = document.createElement("span");
      inner.textContent = w;
      word.appendChild(inner);
      el.appendChild(word);
      if (i < arr.length - 1) el.appendChild(document.createTextNode(" "));
    });
    el.dataset.split = "1";
  }
  function splitHero() {
    document.querySelectorAll(".hero__title .line").forEach((line) => {
      delete line.dataset.split;
      splitWord(line);
    });
  }
  function splitFooter() {
    document.querySelectorAll(".footer__big").forEach((line) => {
      delete line.dataset.split;
      splitWord(line);
    });
  }
  splitHero();
  splitFooter();

  /* ------------------ IN-VIEW REVEAL ------------------ */
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
  function markInView(el) {
    if (el && !el.classList.contains("in-view")) el.classList.add("in-view");
  }
  // Primary: IntersectionObserver
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        markInView(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: "0px 0px -10% 0px" });
  revealEls.forEach((el) => io.observe(el));

  // Fallback A: any element already in viewport at load — reveal immediately
  function revealVisible() {
    const vh = window.innerHeight;
    revealEls.forEach((el) => {
      if (el.classList.contains("in-view")) return;
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.95 && r.bottom > 0) markInView(el);
    });
  }
  requestAnimationFrame(() => requestAnimationFrame(revealVisible));
  window.addEventListener("scroll", revealVisible, { passive: true });
  window.addEventListener("resize", revealVisible);

  // Fallback B: no matter what, force-reveal anything still hidden after 4s
  setTimeout(() => revealEls.forEach(markInView), 4000);

  /* ------------------ HERO PARALLAX ------------------ */
  const heroImg = document.querySelector(".hero__img");
  const heroInner = document.querySelector(".hero__inner");
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (heroImg && y < window.innerHeight) {
      heroImg.style.transform = `scale(${1.1 + y * 0.0004}) translateY(${y * 0.3}px)`;
    }
    if (heroInner && y < window.innerHeight) {
      heroInner.style.transform = `translateY(${y * 0.2}px)`;
      heroInner.style.opacity = String(1 - y / window.innerHeight * 1.5);
    }
  }, { passive: true });

  /* ------------------ RIVIERA PARALLAX ------------------ */
  const rivieraBg = document.querySelector(".riviera__bg");
  if (rivieraBg) {
    window.addEventListener("scroll", () => {
      const rect = rivieraBg.parentElement.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      const off = -center * 0.15;
      rivieraBg.style.transform = `scale(1.15) translateY(${off}px)`;
    }, { passive: true });
  }

  /* ------------------ COUNTERS ------------------ */
  const counters = document.querySelectorAll("[data-count]");
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const duration = 2000;
        const start = performance.now();
        const startVal = 0;
        const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
        function tick(now) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const val = startVal + (target - startVal) * eased;
          el.textContent = val.toFixed(decimals).replace(/\.?0+$/, decimals ? val.toFixed(decimals) : '');
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = target.toFixed(decimals).replace(/\.?0+$/, '');
        }
        requestAnimationFrame(tick);
        countIO.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach((c) => countIO.observe(c));

  /* ------------------ DESTINATIONS HORIZONTAL PROGRESS ------------------ */
  const rail = document.querySelector(".dest__rail");
  const bar = document.querySelector(".dest__bar::after");
  const indicator = document.querySelector(".dest__bar");
  const indicatorCount = document.querySelector(".dest__count");
  if (rail && indicator) {
    rail.addEventListener("scroll", () => {
      const max = rail.scrollWidth - rail.clientWidth;
      const p = max > 0 ? rail.scrollLeft / max : 0;
      indicator.style.setProperty("--p", p);
      indicator.querySelector(":scope")?.style.setProperty?.("--p", p);
      const after = indicator;
      after.style.setProperty("--scroll", `${p * 70}%`);
      // Use direct DOM manipulation
      const inner = indicator;
      inner.style.cssText = `position:relative;flex:1;height:1px;background:var(--line);`;
      // Just update the indicator visually via inline child
    });
  }

  // Prev/Next buttons for destinations
  document.querySelectorAll("[data-dest-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dir = btn.dataset.destNav === "next" ? 1 : -1;
      if (rail) rail.scrollBy({ left: dir * (rail.querySelector(".dest__card").offsetWidth + 32), behavior: "smooth" });
    });
  });

  /* ------------------ STACK PANELS (sticky stack) ------------------ */
  const stackPanels = document.querySelectorAll(".stack__panel");
  const stackIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-active", entry.isIntersecting);
    });
  }, { threshold: 0.4 });
  stackPanels.forEach((p) => stackIO.observe(p));

  /* ------------------ TESTIMONIALS ------------------ */
  const testimonials = document.querySelectorAll(".testimonial");
  const tIndicatorBar = document.querySelector(".testimonials__indicator .bar");
  const tIndicatorCount = document.querySelector(".testimonials__indicator .count");
  let tIndex = 0;
  function showTestimonial(i) {
    testimonials.forEach((t, idx) => t.classList.toggle("is-active", idx === i));
    if (tIndicatorBar) tIndicatorBar.style.setProperty("--p", (i + 1) / testimonials.length);
    if (tIndicatorCount) tIndicatorCount.textContent = `${String(i + 1).padStart(2, '0')} / ${String(testimonials.length).padStart(2, '0')}`;
    tIndex = i;
  }
  document.querySelector("[data-testi='prev']")?.addEventListener("click", () => {
    showTestimonial((tIndex - 1 + testimonials.length) % testimonials.length);
  });
  document.querySelector("[data-testi='next']")?.addEventListener("click", () => {
    showTestimonial((tIndex + 1) % testimonials.length);
  });
  if (testimonials.length) showTestimonial(0);
  // auto rotate
  setInterval(() => {
    if (!document.hidden) showTestimonial((tIndex + 1) % testimonials.length);
  }, 7000);

  /* ------------------ FAQ ACCORDION ------------------ */
  document.querySelectorAll(".faq__q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq__item");
      const isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq__item").forEach((i) => i.classList.remove("is-open"));
      if (!isOpen) item.classList.add("is-open");
    });
  });

  /* ------------------ FORM TOGGLE ------------------ */
  const formToggle = document.querySelector(".form__toggle");
  if (formToggle) {
    formToggle.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => {
        const mode = b.dataset.mode;
        formToggle.classList.toggle("is-guest", mode === "guest");
        formToggle.classList.toggle("is-owner", mode === "owner");
      });
    });
  }

  /* ------------------ MAGNETIC BUTTONS ------------------ */
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0, 0)";
    });
  });

  /* ------------------ SMOOTH SCROLL (light Lenis-like) ------------------ */
  // We use simple anchor smoothing, native scroll otherwise
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
        }
      }
    });
  });

})();
