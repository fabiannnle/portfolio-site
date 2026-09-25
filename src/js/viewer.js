import { gsap } from "gsap";
import { mediaOf } from "./media.js";
import { scrollToTarget } from "./scroll.js";

const PROJECTS = {
  nova: { title: "NOVA", href: "#nova" },
  "pasar-malam": { title: "Pasar Malam", href: "#pasar-malam" },
  "aldergrove-hours": { title: "Aldergrove Hours", href: "#aldergrove-hours" },
  greenleaf: { title: "GreenLeaf Cleaning Co.", href: "#greenleaf" },
  "focus-timer": { title: "Focus Timer", href: "#focus-timer" },
  "github-app": { title: "Profile and skills app", href: "#github-app" },
};

// Any frame can be printed large on the easel: from a click, a typed frame number, or a #frame-N link.
export function initViewer({ reduce, stage, lock }) {
  const viewer = document.getElementById("viewer");
  const backdrop = document.querySelector(".viewer-backdrop");
  const box = viewer.querySelector(".viewer__stage");
  const print = viewer.querySelector("[data-gl-viewer]");
  const img = print.querySelector("img");
  const title = viewer.querySelector(".viewer__title");
  const caption = viewer.querySelector(".viewer__caption");
  const count = viewer.querySelector(".viewer__count");
  const more = viewer.querySelector(".viewer__more");
  const chrome = viewer.querySelectorAll(".viewer__info, .viewer__controls");
  const frames = [...document.querySelectorAll(".sheet .frame")].sort(
    (a, b) => Number(a.dataset.frame) - Number(b.dataset.frame),
  );

  const m = mediaOf(print);
  m.sources = frames.map((f) => f.dataset.lg);
  m.lens = 150;
  m.mag = 1.8;

  let index = -1;
  let returnFocus = null;
  const isOpen = () => !viewer.hidden;

  function fitSize(i) {
    const thumb = frames[i].querySelector("img");
    const ratio = Number(thumb.getAttribute("width")) / Number(thumb.getAttribute("height"));
    const area = box.getBoundingClientRect();
    let w = area.width;
    let h = w / ratio;
    if (h > area.height) {
      h = area.height;
      w = h * ratio;
    }
    return { w, h };
  }

  function fill(i) {
    const frame = frames[i];
    const project = PROJECTS[frame.dataset.project];
    title.textContent = project.title;
    caption.textContent = frame.dataset.caption;
    count.textContent = `Frame ${i + 1} of ${frames.length}`;
    more.setAttribute("href", project.href);
    img.src = frame.dataset.lg;
    img.alt = `${project.title}. ${frame.dataset.caption}`;
    history.replaceState(null, "", `#frame-${i + 1}`);
  }

  function open(n, origin) {
    const i = n - 1;
    if (!frames[i]) return;
    if (isOpen()) {
      go(i - index);
      return;
    }
    returnFocus = document.activeElement;
    index = i;
    viewer.hidden = false;
    backdrop.hidden = false;
    lock(true);
    fill(i);
    const { w, h } = fitSize(i);
    gsap.set(print, { width: w, height: h, x: 0, y: 0, scaleX: 1, scaleY: 1 });
    stage?.load(m);
    m.texA = i;
    m.texB = i;
    m.mix = 0;
    m.loaded = 1;
    if (stage) stage.viewerAlpha.value = 1;

    const from = (origin || frames[i]).getBoundingClientRect();
    const to = print.getBoundingClientRect();
    const d = reduce ? 0 : 1;
    gsap.fromTo(
      print,
      { x: from.left - to.left, y: from.top - to.top, scaleX: from.width / to.width, scaleY: from.height / to.height },
      { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 1.1 * d, ease: "expo.inOut" },
    );
    gsap.fromTo(m, { mono: 1 }, { mono: 0, duration: 1.2 * d, ease: "power2.inOut", delay: 0.3 * d });
    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.6 * d });
    if (stage) gsap.to(stage.pageAlpha, { value: 0, duration: 0.6 * d });
    gsap.fromTo(chrome, { opacity: 0 }, { opacity: 1, duration: 0.6 * d, delay: 0.6 * d });
    viewer.querySelector('[data-viewer="close"]').focus({ preventScroll: true });
  }

  function go(delta) {
    const prev = index;
    index = (index + delta + frames.length) % frames.length;
    if (index === prev) return;
    fill(index);
    const { w, h } = fitSize(index);
    gsap.to(print, { width: w, height: h, duration: reduce ? 0 : 0.9, ease: "expo.inOut" });
    gsap.killTweensOf(m, "mix");
    m.texA = prev;
    m.texB = index;
    m.mix = 0;
    gsap.to(m, {
      mix: 1,
      duration: reduce ? 0 : 1,
      ease: "power2.inOut",
      onComplete: () => {
        m.texA = index;
        m.mix = 0;
      },
    });
  }

  function close(then) {
    if (!isOpen()) return;
    const target = frames[index].getBoundingClientRect();
    const current = print.getBoundingClientRect();
    const onScreen = target.bottom > 0 && target.top < innerHeight && target.right > 0 && target.left < innerWidth;
    const d = reduce ? 0 : 1;
    const tl = gsap.timeline({
      onComplete: () => {
        viewer.hidden = true;
        backdrop.hidden = true;
        lock(false);
        history.replaceState(null, "", location.pathname + location.search);
        if (typeof then === "function") then();
        else returnFocus?.focus({ preventScroll: true });
      },
    });
    tl.to(chrome, { opacity: 0, duration: 0.3 * d }, 0);
    if (onScreen && typeof then !== "function") {
      tl.to(
        print,
        {
          x: `+=${target.left - current.left}`,
          y: `+=${target.top - current.top}`,
          scaleX: target.width / current.width,
          scaleY: target.height / current.height,
          duration: 0.95 * d,
          ease: "expo.inOut",
        },
        0,
      );
      tl.to(m, { mono: 1, duration: 0.8 * d, ease: "power2.inOut" }, 0.1 * d);
    } else if (stage) {
      tl.to(stage.viewerAlpha, { value: 0, duration: 0.45 * d }, 0);
    }
    tl.to(backdrop, { opacity: 0, duration: 0.6 * d }, 0.3 * d);
    if (stage) tl.to(stage.pageAlpha, { value: 1, duration: 0.6 * d }, 0.3 * d);
  }

  viewer.addEventListener("click", (event) => {
    const action = event.target.closest("[data-viewer]")?.dataset.viewer;
    if (action === "prev") go(-1);
    else if (action === "next") go(1);
    else if (action === "close") close();
    else if (event.target === box || event.target === viewer) close();
  });

  more.addEventListener("click", (event) => {
    event.preventDefault();
    const target = document.querySelector(more.getAttribute("href"));
    close(() => scrollToTarget(target));
  });

  // Keyboard: arrows and Escape in the viewer; typed frame numbers anywhere.
  let digits = "";
  let digitTimer;
  document.addEventListener("keydown", (event) => {
    if (isOpen()) {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
      else if (event.key === "Tab") trapFocus(event);
    }
    const typing = event.target.closest("input, textarea, select, [contenteditable]");
    if (typing || event.metaKey || event.ctrlKey || event.altKey || !/^\d$/.test(event.key)) return;
    digits = (digits + event.key).slice(-2);
    clearTimeout(digitTimer);
    digitTimer = setTimeout(() => {
      const n = Number(digits);
      digits = "";
      if (n >= 1 && n <= frames.length) open(n);
    }, 450);
  });

  function trapFocus(event) {
    const focusables = [...viewer.querySelectorAll("a[href], button")];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  window.addEventListener("resize", () => {
    if (!isOpen()) return;
    const { w, h } = fitSize(index);
    gsap.set(print, { width: w, height: h });
  });

  const fromHash = location.hash.match(/^#frame-(\d+)$/);
  if (fromHash) setTimeout(() => open(Number(fromHash[1])), 400);

  return { open };
}
