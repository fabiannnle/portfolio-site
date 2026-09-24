import { gsap } from "gsap";
import { mediaOf } from "./media.js";

// The loupe: hovering a frame magnifies it and shows its true colour inside the lens.
export function initCursor() {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const cursor = document.querySelector(".cursor");
  const label = cursor.querySelector(".cursor__label");
  const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
  const pointer = { x: -9999, y: -9999 };
  let active = null;

  window.addEventListener(
    "pointermove",
    (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      xTo(pointer.x);
      yTo(pointer.y);
    },
    { passive: true },
  );

  // The print moves under a still pointer while scrolling, so track it every frame.
  gsap.ticker.add(() => {
    if (!active) return;
    const r = active.el.getBoundingClientRect();
    active.mouse.x = pointer.x - r.left;
    active.mouse.y = pointer.y - r.top;
  });

  const targets = document.querySelectorAll(".frame [data-gl]");
  targets.forEach((el) => {
    const m = mediaOf(el);
    const host = el.closest(".frame") || el;
    const isFrame = host.classList.contains("frame");

    host.addEventListener("pointerenter", () => {
      active = m;
      if (isFrame) m.lens = Math.min(120, Math.max(64, el.offsetWidth * 0.26));
      const r = el.getBoundingClientRect();
      m.mouse.x = pointer.x - r.left;
      m.mouse.y = pointer.y - r.top;
      gsap.to(m, { hover: 1, duration: 0.7, ease: "expo.out" });
      if (isFrame) {
        cursor.style.setProperty("--lens", `${m.lens}px`);
        label.textContent = `Open frame ${host.dataset.frame}`;
        cursor.classList.add("is-on");
      }
    });

    host.addEventListener("pointerleave", () => {
      gsap.to(m, { hover: 0, duration: 0.45, ease: "power2.out" });
      if (active === m) active = null;
      cursor.classList.remove("is-on");
    });
  });
}
