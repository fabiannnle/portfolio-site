import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mediaOf } from "./media.js";

export function initSpreads({ reduce }) {
  const mm = gsap.matchMedia();

  // Enlargements: the easel blade lifts and the print develops as it rises into view.
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      const m = mediaOf(el);
      const settle = el.hasAttribute("data-parallax") ? 1.07 : 1;
      m.clip.t = 1;
      m.develop = 0;
      m.zoom = settle + 0.12;
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top 96%", end: "top 55%", scrub: 0.8 } })
        .to(m.clip, { t: 0, ease: "power3.out", duration: 0.55 }, 0)
        .to(m, { zoom: settle, ease: "power2.out", duration: 1 }, 0)
        .to(m, { develop: 1, ease: "none", duration: 0.9 }, 0.1);
    });

    document.querySelectorAll("[data-parallax]").forEach((el) => {
      gsap.fromTo(
        mediaOf(el),
        { shift: -1 },
        { shift: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
    });

    document.querySelectorAll("[data-speed]").forEach((el) => {
      const travel = (1 - parseFloat(el.dataset.speed)) * 320;
      gsap.fromTo(
        el,
        { y: -travel },
        { y: travel, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
      );
    });
  });

  initSequences(reduce);
  initTestStrip(reduce);
}

// The workflows: one print held on the easel, and the visitor steps through it with the arrows or the list.
// Nothing is pinned, so the page always scrolls freely.
function initSequences(reduce) {
  document.querySelectorAll(".sequence").forEach((section) => {
    const print = section.querySelector("[data-sequence]");
    const m = mediaOf(print);
    const items = [...section.querySelectorAll(".sequence__steps li")];
    const buttons = items.map((li) => li.querySelector(".sequence__step"));
    const [prev, next] = section.querySelectorAll("[data-seq-step]");
    const counter = section.querySelector("[data-seq-current]");
    let current = 0;

    const sync = () => {
      items.forEach((li, i) => li.classList.toggle("is-active", i === current));
      buttons.forEach((b, i) => b.setAttribute("aria-pressed", String(i === current)));
      print.dataset.step = String(current);
      counter.textContent = String(current + 1);
      prev.disabled = current === 0;
      next.disabled = current === items.length - 1;
    };

    const go = (to) => {
      const target = Math.max(0, Math.min(items.length - 1, to));
      if (target === current) return;
      gsap.killTweensOf(m, "mix");
      m.texA = current;
      m.texB = target;
      m.mix = 0;
      current = target;
      sync();
      gsap.to(m, {
        mix: 1,
        duration: reduce ? 0 : 1.1,
        ease: "power2.inOut",
        onComplete: () => {
          m.texA = target;
          m.mix = 0;
        },
      });
    };

    buttons.forEach((b, i) => b.addEventListener("click", () => go(i)));
    prev.addEventListener("click", () => go(current - 1));
    next.addEventListener("click", () => go(current + 1));
    section.addEventListener("keydown", (e) => {
      if (e.target.closest("input, textarea")) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(current + 1);
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(current - 1);
      else return;
      e.preventDefault();
    });
    sync();

    if (reduce) return;
    m.develop = 0;
    ScrollTrigger.create({
      trigger: print,
      start: "top 80%",
      once: true,
      onEnter: () => gsap.to(m, { develop: 1, duration: 2.2, ease: "power1.inOut" }),
    });
  });
}

// This site: a test strip the visitor can develop by hand.
function initTestStrip(reduce) {
  const print = document.querySelector("[data-teststrip]");
  const m = mediaOf(print);
  const input = document.querySelector("[data-develop-control]");
  const sync = () => (input.value = String(Math.round(m.develop * 100)));

  input.addEventListener("input", () => {
    gsap.killTweensOf(m, "develop");
    gsap.to(m, { develop: Number(input.value) / 100, duration: 0.35, ease: "power2.out" });
  });

  if (reduce) return;
  m.develop = 0;
  sync();
  ScrollTrigger.create({
    trigger: print,
    start: "top 70%",
    once: true,
    onEnter: () => gsap.to(m, { develop: 1, duration: 3.4, ease: "power1.inOut", onUpdate: sync }),
  });
}
