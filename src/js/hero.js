import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { mediaOf } from "./media.js";

// The one orchestrated moment: the introduction is set line by line,
// then a strip of frames develops beneath it and drifts as you scroll.
export async function initHero({ reduce }) {
  const root = document.documentElement;
  const hero = document.querySelector(".hero");
  const intro = hero.querySelector(".hero__intro");
  const more = hero.querySelector(".hero__more");
  const stack = hero.querySelector(".hero__stack");
  const reel = hero.querySelector(".reel");
  const reelMedias = [...reel.querySelectorAll("[data-gl]")].map(mediaOf);
  const masthead = document.querySelector(".masthead");

  if (reduce) {
    root.classList.remove("is-intro");
    return;
  }

  window.__intro = true;
  reelMedias.forEach((m) => (m.develop = 0));

  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]);
  // Split on plain spaces only, so a non-breaking space keeps "web apps." on one line.
  const split = SplitText.create(intro, { type: "lines", mask: "lines", wordDelimiter: " ", reduceWhiteSpace: false });
  gsap.set(split.lines, { yPercent: 105 });
  gsap.set([more, stack, masthead], { opacity: 0 });
  root.classList.remove("is-intro");

  gsap
    .timeline({ delay: 0.2 })
    .to(split.lines, { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.12 })
    .to([more, stack, masthead], { opacity: 1, duration: 0.9, ease: "power2.out", stagger: 0.1 }, 0.7)
    .to(reelMedias, { develop: 1, duration: 2, ease: "power1.inOut", stagger: 0.12 }, 0.9);

  gsap.to(reel, {
    x: () => -window.innerWidth * 0.18,
    ease: "none",
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true },
  });
}
