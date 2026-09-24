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

  initSequence(mm, reduce);
  initTestStrip(reduce);
}

// Focus Timer: one print held on the easel while its states are exposed in turn.
function initSequence(mm, reduce) {
  const print = document.querySelector("[data-sequence]");
  const m = mediaOf(print);
  const steps = [...document.querySelectorAll(".sequence__steps li")];
  let current = 0;

  const go = (next) => {
    if (next === current) return;
    steps.forEach((li, i) => li.classList.toggle("is-active", i === next));
    print.dataset.step = String(next);
    gsap.killTweensOf(m, "mix");
    m.texA = current;
    m.texB = next;
    m.mix = 0;
    current = next;
    gsap.to(m, {
      mix: 1,
      duration: reduce ? 0 : 1.1,
      ease: "power2.inOut",
      onComplete: () => {
        m.texA = next;
        m.mix = 0;
      },
    });
  };

  mm.add(
    {
      pin: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
      stack: "(max-width: 899px), (prefers-reduced-motion: reduce)",
    },
    (context) => {
      if (context.conditions.pin) {
        m.develop = 0;
        ScrollTrigger.create({
          trigger: print,
          start: "top 80%",
          once: true,
          onEnter: () => gsap.to(m, { develop: 1, duration: 2.2, ease: "power1.inOut" }),
        });
        ScrollTrigger.create({
          trigger: ".sequence__pin",
          start: "top top",
          end: "+=180%",
          pin: true,
          onUpdate: (self) => go(Math.min(steps.length - 1, Math.floor(self.progress * steps.length))),
        });
      } else {
        steps.forEach((li, i) =>
          ScrollTrigger.create({
            trigger: li,
            start: "top 65%",
            end: "bottom 65%",
            onToggle: (self) => self.isActive && go(i),
          }),
        );
      }
    },
  );
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
