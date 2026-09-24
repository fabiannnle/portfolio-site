// Every image on the page is a "print": a plain state object that GSAP animates and
// either the WebGL stage or the CSS fallback draws.
export const medias = [];

export function collectMedia() {
  const els = document.querySelectorAll("[data-gl], [data-gl-viewer]");
  els.forEach((el, index) => {
    const imgs = [...el.querySelectorAll("img")];
    const media = {
      el,
      imgs,
      index,
      viewer: el.hasAttribute("data-gl-viewer"),
      fit: el.dataset.fit === "contain" ? 1 : 0,
      mono: el.hasAttribute("data-mono") ? 1 : 0,
      bands: el.hasAttribute("data-teststrip") ? 1 : 0,
      sources: imgs.map((img) => img.getAttribute("src")).filter(Boolean),
      focus: { x: 0, y: parseFloat(el.dataset.focusY) || 0 },
      clip: { t: 0, r: 0, b: 0, l: 0 },
      develop: 1,
      hover: 0,
      mouse: { x: -9999, y: -9999 },
      lens: 90,
      mag: 1.9,
      shift: 0,
      zoom: 1,
      mix: 0,
      texA: 0,
      texB: 0,
      near: false,
    };
    if (media.focus.y) imgs.forEach((img) => (img.style.objectPosition = `50% ${50 - media.focus.y * 50}%`));
    el._media = media;
    medias.push(media);
  });
  return medias;
}

export const mediaOf = (el) => el?._media;

// CSS stand-in for the shader, used when WebGL is unavailable.
export function applyFallback(m) {
  const { t, r, b, l } = m.clip;
  const clip = t || r || b || l ? `inset(${t * 100}% ${r * 100}% ${b * 100}% ${l * 100}%)` : "";
  const dev = m.develop;
  const filter = dev < 1 ? `brightness(${1 + (1 - dev) * 1.4}) contrast(${0.35 + dev * 0.65})` : "";
  const transform =
    m.zoom !== 1 || m.shift ? `scale(${m.zoom}) translateY(${m.shift * (1 - 1 / m.zoom) * -50}%)` : "";
  const key = clip + filter + transform;
  if (key === m.css) return;
  m.css = key;
  m.el.style.clipPath = clip;
  m.el.style.filter = filter;
  m.imgs.forEach((img) => (img.style.transform = transform));
}
