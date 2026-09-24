import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenis = null;

export function initScroll(reduce) {
  if (!reduce) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.closest(".viewer")) return;
    const id = link.getAttribute("href");
    if (id.length < 2) return;
    const target = id === "#top" ? document.body : document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    scrollToTarget(target);
    history.replaceState(null, "", id === "#top" ? location.pathname : id);
  });
}

export function scrollToTarget(target) {
  const focusTarget = () => {
    if (target === document.body) return;
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };
  if (lenis) {
    lenis.scrollTo(target === document.body ? 0 : target, {
      duration: 1.6,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      onComplete: focusTarget,
    });
  } else {
    if (target === document.body) window.scrollTo(0, 0);
    else target.scrollIntoView();
    focusTarget();
  }
}

export const scrollVelocity = () => lenis?.velocity ?? 0;

export function lockScroll(locked) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
