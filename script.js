document.addEventListener("DOMContentLoaded", () => {

  /* ---------------- Mobile nav toggle ---------------- */
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen);
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- GSAP scroll reveals ---------------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".hero-txt h3", { 
      opacity: 0,
      y: -16, 
      duration: 1,
      ease: "power2.out", 
       delay: 0.2 
    });
    gsap.from(".hero-txt h1, .hero-txt h2", { 
      opacity: 0, y: 30, 
      duration: 1.1, 
      ease: "power2.out", 
      delay: 0.35 
    });
    gsap.from(".hero-txt h4", { 
      opacity: 0, 
      y: 20, 
      duration: 1, 
      ease: "power2.out", 
      delay: 0.55 
    });
    gsap.from(".hero a", { 
      opacity: 0, 
      y: 20, 
      duration: 1, 
      ease: "power2.out", 
      delay: 0.75 
    });

    gsap.from(".collection h1", {
      scrollTrigger: { 
        trigger: ".collection h1", 
        start: "top 85%", 
        toggleActions: "play pause resume reverse" 
      },
      opacity: 0, y: 30, duration: 1, ease: "power2.out",
    });
    gsap.from(".abt-header h1", {
      scrollTrigger: {
        trigger: ".abt-header h1",
        start: "top 85%",
        toggleActions: "play none none reverse" 
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out",
      
    });

    gsap.from (".pillar",{
      scrollTrigger: {
        trigger: ".pillar",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 50,
      x: -30,
      stagger: 0.5,
      ease: "power2.out",
    })
    document.querySelectorAll(".prod-col > div").forEach((el, i) => {
      // tags fade in fast, product rows fade+slide from their own side
      if (el.classList.contains("product-tag")) {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
          opacity: 0, x: -20, duration: 0.7, ease: "power2.out",
        });
      } else if (el.classList.contains("collecion1")) {
        const fromLeft = !el.classList.contains("reverse");
        gsap.from(el.querySelector(".col-img"), {
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" },
          opacity: 0, x: fromLeft ? -50 : 50, duration: 1, ease: "power2.out",
        });
        gsap.from(el.querySelector(".col-sub"), {
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" },
          opacity: 0, x: fromLeft ? 50 : -50, duration: 1, delay: 0.15, ease: "power2.out",
        });
      }
    });

    window.addEventListener("load", () => ScrollTrigger.refresh());
  }
});