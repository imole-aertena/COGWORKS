document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nav ---------- */
  const nav = $(".nav"), toggle = $("#navToggle"), menu = $("#mobileMenu");
  const closeMenu = () => {
    menu.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = menu.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
  });
  $$("a", menu).forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("click", (e) => { if (!menu.contains(e.target)) closeMenu(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  addEventListener("resize", () => { if (innerWidth > 640) closeMenu(); });

  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 30);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  // Highlight the nav link of the section in view (home page only)
  const sections = $$("main section[id]");
  if (sections.length > 1) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        $$(".nav-links a").forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href").endsWith("#" + en.target.id)));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => io.observe(s));
  }

  // Hide gallery images that fail to load
  $$(".gallery img").forEach((img) => {
    const drop = () => img.closest("figure").remove();
    if (img.complete && !img.naturalWidth) drop();
    else img.addEventListener("error", drop);
  });

  /* ---------- Interest list (saved in this browser) ---------- */
  const KEY = "cogworks-interest";
  let list = [];
  try { list = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} };
  const badge = $("#badge");
  const renderBadge = () => { badge.textContent = list.length; badge.hidden = !list.length; };
  renderBadge();

  const cards = $$(".card[data-product]");
  if (cards.length) {
    const text = $("#interestText"), count = $("#interestCount");
    const render = () => {
      cards.forEach((c) => {
        const on = list.includes(c.dataset.product), btn = $(".btn", c);
        btn.classList.toggle("selected", on);
        btn.setAttribute("aria-pressed", on);
        $("span", btn).textContent = on ? "Interest registered" : "Register interest";
        $("i", btn).className = on ? "fa-solid fa-check" : "fa-solid fa-arrow-right";
      });
      count.textContent = list.length;
      text.textContent = list.length
        ? "Selected: " + list.join(", ") + "."
        : "No pieces selected yet. Choose a piece above to add it here.";
      renderBadge();
    };
    cards.forEach((c) => $(".btn", c).addEventListener("click", () => {
      const p = c.dataset.product;
      list = list.includes(p) ? list.filter((x) => x !== p) : [...list, p];
      save(); render();
      if (window.gsap && !reduce)
        gsap.fromTo("#interestSummary", { scale: 0.98 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
    }));
    render();
  }

  /* ---------- Contact form (opens the visitor's email app) ---------- */
  const form = $("#contactForm");
  if (form) {
    const status = $("#formStatus"), msg = $("#message");
    if (list.length && !msg.value) msg.value = "I'm interested in: " + list.join(", ") + ".\n\n";
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const d = new FormData(form);
      const subject = encodeURIComponent("Cogworks inquiry from " + d.get("name"));
      const body = encodeURIComponent(d.get("message") + "\n\n" + d.get("name") + " (" + d.get("email") + ")");
      location.href = `mailto:nyxcor3n@gmail.com?subject=${subject}&body=${body}`;
      status.textContent = "Opening your email app to send the message.";
    });
  }

  /* ---------- GSAP ---------- */
  if (!window.gsap || !window.ScrollTrigger || reduce) return;
  gsap.registerPlugin(ScrollTrigger);

  // One orchestrated entrance for the hero
  gsap.from(".hero-txt > *", { opacity: 0, y: 24, duration: 1, stagger: 0.15, delay: 0.2, ease: "power2.out" });

  // Generic scroll reveal for anything marked data-reveal
  gsap.set("[data-reveal]", { opacity: 0, y: 40 });
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 90%",
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: "power2.out", overwrite: true }),
  });

  // Product rows slide in from their own side
  $$(".product").forEach((row) => {
    const dir = row.classList.contains("reverse") ? 1 : -1;
    gsap.timeline({ scrollTrigger: { trigger: row, start: "top 80%", once: true } })
      .from($(".product-img", row), { opacity: 0, x: 60 * dir, duration: 1, ease: "power2.out" })
      .from($(".product-txt", row), { opacity: 0, x: -60 * dir, duration: 1, ease: "power2.out" }, 0.15);
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
});
