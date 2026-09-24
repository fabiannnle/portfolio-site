import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mediaOf } from "./media.js";

const SVG = "http://www.w3.org/2000/svg";
// Grease-pencil boxes, each drawn by a slightly different hand.
const MARKS = [
  "M6 9C45 4 104 5 150 8c2 30 0 62-1 95-46 3-97 2-144 0C3 72 4 40 9 4",
  "M8 5c38 3 96 1 143 5-3 31-1 63 0 94-47-1-98 1-145-2 2-31 1-62 3-99",
  "M5 7c50-4 98-2 146 2 1 32 2 62-2 95-48 1-96 2-144-1-1-33 1-65 4-100",
];

function drawMarks(sheet) {
  return [...sheet.querySelectorAll(".strip__cell.is-select")].map((cell, i) => {
    const svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("class", "mark");
    svg.setAttribute("viewBox", "0 0 156 110");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS(SVG, "path");
    path.setAttribute("d", MARKS[i % MARKS.length]);
    svg.appendChild(path);
    cell.appendChild(svg);
    return path;
  });
}

export function initSheet({ openFrame }) {
  const sheet = document.querySelector(".sheet");
  const stage = sheet.querySelector(".sheet__stage");
  const track = sheet.querySelector(".sheet__track");
  const frames = [...sheet.querySelectorAll(".frame")];
  const medias = frames.map((frame) => mediaOf(frame.querySelector("[data-gl]")));
  const marks = drawMarks(sheet);

  frames.forEach((frame) => frame.addEventListener("click", () => openFrame(Number(frame.dataset.frame), frame)));

  const mm = gsap.matchMedia();
  mm.add(
    {
      pan: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
      narrow: "(max-width: 899px)",
      reduce: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const { pan, reduce } = context.conditions;
      sheet.classList.toggle("sheet--static", !pan);

      if (reduce) {
        medias.forEach((m) => (m.develop = 1));
        gsap.set(marks, { drawSVG: "100%" });
        return () => sheet.classList.remove("sheet--static");
      }

      medias.forEach((m) => (m.develop = 0));
      ScrollTrigger.create({
        trigger: stage,
        start: "top 75%",
        once: true,
        onEnter: () => gsap.to(medias, { develop: 1, duration: 2.2, ease: "power1.inOut", stagger: 0.07 }),
      });
      gsap.set(marks, { drawSVG: "0%" });

      if (!pan) {
        marks.forEach((path) =>
          gsap.to(path, {
            drawSVG: "100%",
            duration: 1.2,
            ease: "power2.inOut",
            scrollTrigger: { trigger: path.closest(".strip"), start: "top 70%" },
          }),
        );
        return () => sheet.classList.remove("sheet--static");
      }

      // Each strip is drawn across the light table at its own pace, so every roll
      // reaches its last frame together while the sheet drifts up beneath the pinned view.
      const strips = [...track.querySelectorAll(".strip__frames")];
      const inner = () => track.clientWidth - parseFloat(getComputedStyle(track).paddingLeft) * 2;
      const travel = (strip) => Math.max(0, strip.scrollWidth - inner());
      const top = () => parseFloat(getComputedStyle(track).top) || 0;
      const dy = () => Math.max(0, track.offsetHeight + top() * 1.4 - stage.clientHeight);
      const longest = () => Math.max(...strips.map(travel), dy(), 480);

      const sheetPan = gsap.timeline({
        defaults: { ease: "none", duration: 1 },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${longest() * 1.35}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: drawVisibleMarks,
        },
      });
      strips.forEach((strip) => sheetPan.to(strip, { x: () => -travel(strip) }, 0));
      sheetPan.to(track, { y: () => -dy() }, 0);

      const drawn = new Set();
      function drawVisibleMarks() {
        const edge = stage.clientWidth * 0.8;
        marks.forEach((path) => {
          const inView = path.closest(".strip__cell").getBoundingClientRect().left < edge;
          if (inView === drawn.has(path)) return;
          if (inView) drawn.add(path);
          else drawn.delete(path);
          gsap.to(path, { drawSVG: inView ? "100%" : "0%", duration: inView ? 1.3 : 0.6, ease: "power2.inOut" });
        });
      }
      ScrollTrigger.create({ trigger: stage, start: "top 60%", once: true, onEnter: drawVisibleMarks });
    },
  );
}
