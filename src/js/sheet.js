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

// Each strip scrolls along its own roll; the arrows step one frame at a time.
function initStripArrows(strip, reduce) {
  const list = strip.querySelector(".strip__frames");
  const nav = strip.querySelector(".strip__nav");
  const [prev, next] = nav.querySelectorAll(".strip__arrow");

  const step = () => {
    const cell = list.querySelector(".strip__cell");
    return cell.offsetWidth + (parseFloat(getComputedStyle(list).columnGap) || 0);
  };
  const update = () => {
    const max = list.scrollWidth - list.clientWidth;
    nav.hidden = max < 4;
    prev.disabled = list.scrollLeft < 4;
    next.disabled = list.scrollLeft > max - 4;
  };
  const move = (dir) => list.scrollBy({ left: dir * step(), behavior: reduce ? "auto" : "smooth" });

  prev.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  list.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

export function initSheet({ openFrame, reduce }) {
  const sheet = document.querySelector(".sheet");
  const frames = [...sheet.querySelectorAll(".frame")];
  const marks = drawMarks(sheet);

  frames.forEach((frame) => frame.addEventListener("click", () => openFrame(Number(frame.dataset.frame), frame)));
  sheet.querySelectorAll(".strip").forEach((strip) => initStripArrows(strip, reduce));

  if (reduce) {
    gsap.set(marks, { drawSVG: "100%" });
    return;
  }

  // Each roll develops as it comes into view, then its select is marked.
  gsap.set(marks, { drawSVG: "0%" });
  sheet.querySelectorAll(".strip").forEach((strip) => {
    const medias = [...strip.querySelectorAll(".frame [data-gl]")].map(mediaOf);
    const stripMarks = marks.filter((path) => strip.contains(path));
    medias.forEach((m) => (m.develop = 0));
    ScrollTrigger.create({
      trigger: strip,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(medias, { develop: 1, duration: 2, ease: "power1.inOut", stagger: 0.1 });
        gsap.to(stripMarks, { drawSVG: "100%", duration: 1.3, ease: "power2.inOut", delay: 1 });
      },
    });
  });
}
