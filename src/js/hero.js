import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { mediaOf } from "./media.js";

// The one orchestrated moment: the easel's blades open on a print, the print
// develops shadows-first, and the name is set beneath it.
export async function initHero({ reduce }) {
  const root = document.documentElement;
  const hero = document.querySelector(".hero");
  const print = hero.querySelector("[data-hero]");
  const media = mediaOf(print);
  const name = hero.querySelector(".hero__name");
  const strip = hero.querySelector(".hero__strip");
  const stripMedias = [...strip.querySelectorAll("[data-gl]")].map(mediaOf);
  const fadeIns = [
    hero.querySelector(".hero__offer"),
    hero.querySelector(".hero__print .caption"),
    hero.querySelector(".easel"),
    document.querySelector(".masthead"),
  ];

  const setEasel = () => hero.style.setProperty("--easel-h", `${print.offsetHeight}px`);
  setEasel();
  window.addEventListener("resize", setEasel);

  if (reduce) {
    root.classList.remove("is-intro");
    return;
  }

  window.__intro = true;
  media.develop = 0;
  media.clip = { t: 0.4985, r: 0.5, b: 0.4985, l: 0.5 };
  stripMedias.forEach((m) => (m.develop = 0));

  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]);
  const split = SplitText.create(name, { type: "words,chars", mask: "words", wordsClass: "word" });
  gsap.set(split.chars, { yPercent: 108 });
  gsap.set(fadeIns, { opacity: 0 });
  root.classList.remove("is-intro");

  const tl = gsap.timeline({ delay: 0.25 });
  tl.to(media.clip, { l: 0, r: 0, duration: 0.9, ease: "expo.inOut" })
    .to(media.clip, { t: 0, b: 0, duration: 1.3, ease: "expo.inOut" }, ">-0.1")
    .to(media, { develop: 1, duration: 2.6, ease: "power1.inOut" }, "<0.15")
    .to(split.chars, { yPercent: 0, duration: 1.5, ease: "expo.out", stagger: 0.028 }, 0.55)
    .to(fadeIns, { opacity: 1, duration: 0.9, ease: "power2.out", stagger: 0.08 }, 1.7)
    .to(stripMedias, { develop: 1, duration: 1.8, ease: "power1.inOut", stagger: 0.15 }, 1.9);

  // Depth by overlap: the name sits nearest, then the strip, then the print.
  const scrub = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
  gsap.to(hero.querySelector(".hero__print"), { y: () => innerHeight * -0.12, ease: "none", scrollTrigger: scrub });
  gsap.to(name, { y: () => innerHeight * -0.3, ease: "none", scrollTrigger: { ...scrub } });
  gsap.to(strip, { y: () => innerHeight * -0.55, ease: "none", scrollTrigger: { ...scrub } });
}
