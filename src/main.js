import "@fontsource-variable/bodoni-moda/opsz.css";
import "@fontsource-variable/archivo/wdth.css";
import "lenis/dist/lenis.css";
import "./styles/main.css";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";

import { collectMedia, medias, applyFallback } from "./js/media.js";
import { createStage } from "./js/gl/stage.js";
import { initScroll, scrollVelocity, lockScroll } from "./js/scroll.js";
import { initTheme } from "./js/theme.js";
import { initHero } from "./js/hero.js";
import { initSheet } from "./js/sheet.js";
import { initSpreads } from "./js/spreads.js";
import { initViewer } from "./js/viewer.js";
import { initCursor } from "./js/cursor.js";
import { initForm } from "./js/form.js";
import { initMenu } from "./js/menu.js";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText);

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;

collectMedia();
initScroll(reduce);

const wantsGL = !new URLSearchParams(location.search).has("nogl");
const stage = wantsGL ? createStage(medias) : null;

if (stage) {
  root.classList.add("gl-on");
  let velocity = 0;
  gsap.ticker.add((time) => {
    velocity += (scrollVelocity() - velocity) * 0.12;
    stage.setVelocity(reduce ? 0 : velocity);
    stage.render(time);
  });
} else {
  gsap.ticker.add(() => medias.forEach(applyFallback));
}

initTheme(() => {
  stage?.setTheme();
  stage?.render();
});
paintGrain();

const viewer = initViewer({ reduce, stage, lock: lockScroll });
initHero({ reduce });
initSheet({ openFrame: viewer.open, reduce });
initSpreads({ reduce });
initCursor();
initForm();
initMenu({ lock: lockScroll, reduce });
initMasthead();

// Once anything scrolls under it, the masthead gets a paper band, and it steps aside while you read downward.
function initMasthead() {
  const head = document.querySelector(".masthead");
  let last = window.scrollY;
  const update = () => {
    const y = window.scrollY;
    if (head.classList.contains("is-menu")) {
      last = y;
      return;
    }
    const banded = y > 40;
    head.classList.toggle("is-banded", banded);
    if (!banded || y < last - 4) head.classList.remove("is-hidden");
    else if (y > last + 4 && !head.contains(document.activeElement)) head.classList.add("is-hidden");
    last = y;
  };
  window.addEventListener("scroll", update, { passive: true });
  head.addEventListener("focusin", () => head.classList.remove("is-hidden"));
  update();
}

window.addEventListener("load", () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());

function paintGrain() {
  const size = 180;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const data = ctx.createImageData(size, size);
  for (let i = 0; i < data.data.length; i += 4) {
    const v = Math.random() * 255;
    data.data[i] = data.data[i + 1] = data.data[i + 2] = v;
    data.data[i + 3] = 255;
  }
  ctx.putImageData(data, 0, 0);
  document.querySelector(".grain").style.backgroundImage = `url(${canvas.toDataURL()})`;
}
