import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  TextureLoader,
  DataTexture,
  Vector2,
  Vector4,
  Color,
  NoColorSpace,
  LinearMipmapLinearFilter,
  LinearFilter,
} from "three";
import { gsap } from "gsap";
import { vertex, fragment } from "./shaders.js";

const TINT_LIGHT = [1, 1, 1];
const TINT_DARK = [1, 0.88, 0.76];

function readColor(name) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new Color(value);
}

export function createStage(medias) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
  } catch {
    return null;
  }

  const canvas = renderer.domElement;
  canvas.className = "stage";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, -10, 10);
  const geometry = new PlaneGeometry(1, 1, 16, 8);
  const loader = new TextureLoader();
  const maxAniso = renderer.capabilities.getMaxAnisotropy();

  const blank = new DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
  blank.needsUpdate = true;

  const shared = {
    uPaper: { value: new Color() },
    uGround: { value: new Color() },
    uTint: { value: new Color(...TINT_LIGHT) },
    uRing: { value: new Color() },
    uTime: { value: 0 },
    uDpr: { value: dpr },
    uVel: { value: 0 },
    uRoom: { value: 0 },
  };
  const pageAlpha = { value: 1 };
  const viewerAlpha = { value: 1 };

  // The colour at a screenshot's corner fills the frame around a contained image.
  const probe = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  function edgeColor(image) {
    try {
      probe.canvas.width = probe.canvas.height = 1;
      probe.drawImage(image, 2, 2, 1, 1, 0, 0, 1, 1);
      const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
      return new Color(r / 255, g / 255, b / 255);
    } catch {
      return null;
    }
  }

  const textures = new Map();
  function texture(url) {
    if (textures.has(url)) return textures.get(url);
    const entry = { tex: blank, w: 1, h: 1, loaded: false, promise: null };
    entry.promise = new Promise((resolve) => {
      loader.load(
        url,
        (tex) => {
          tex.colorSpace = NoColorSpace;
          tex.minFilter = LinearMipmapLinearFilter;
          tex.magFilter = LinearFilter;
          tex.anisotropy = maxAniso;
          entry.tex = tex;
          entry.w = tex.image.naturalWidth || tex.image.width;
          entry.h = tex.image.naturalHeight || tex.image.height;
          entry.edge = edgeColor(tex.image);
          entry.loaded = true;
          renderer.initTexture(tex);
          resolve(entry);
        },
        undefined,
        () => resolve(entry),
      );
    });
    textures.set(url, entry);
    return entry;
  }

  function load(m) {
    if (m.tex || !m.sources.length) return;
    m.loaded = 0;
    m.tex = m.sources.map(texture);
    m.tex[0]?.promise.then(() => gsap.to(m, { loaded: 1, duration: 0.8, ease: "power2.out" }));
  }

  for (const m of medias) {
    const material = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      premultipliedAlpha: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        ...shared,
        uAlpha: m.viewer ? viewerAlpha : pageAlpha,
        uTexA: { value: blank },
        uTexB: { value: blank },
        uEdgeA: { value: new Color() },
        uEdgeB: { value: new Color() },
        uImgA: { value: new Vector2(1, 1) },
        uImgB: { value: new Vector2(1, 1) },
        uMix: { value: 0 },
        uRes: { value: new Vector2(1, 1) },
        uFit: { value: m.fit },
        uZoom: { value: 1 },
        uShift: { value: 0 },
        uDevelop: { value: 1 },
        uMono: { value: m.mono },
        uHover: { value: 0 },
        uMouse: { value: new Vector2(-9999, -9999) },
        uLens: { value: 90 },
        uMag: { value: 1.9 },
        uClip: { value: new Vector4() },
        uFocus: { value: new Vector2(m.focus.x, m.focus.y) },
        uBounds: { value: new Vector4(-1e5, -1e5, 1e5, 1e5) },
        uBands: { value: m.bands },
        uLoaded: { value: 0 },
      },
    });
    m.clips = [];
    for (let p = m.el.parentElement?.closest("[data-gl-clip]"); p; p = p.parentElement?.closest("[data-gl-clip]")) {
      m.clips.push(p);
    }
    const mesh = new Mesh(geometry, material);
    mesh.renderOrder = m.viewer ? 1000 : m.index;
    mesh.visible = false;
    m.mesh = mesh;
    scene.add(mesh);
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const m = entry.target._media;
        m.near = entry.isIntersecting;
        if (m.near) load(m);
      }
    },
    { rootMargin: "80% 80% 80% 80%" },
  );
  medias.forEach((m) => !m.viewer && io.observe(m.el));

  let W = 0;
  let H = 0;
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    renderer.setSize(W, H);
    camera.left = -W / 2;
    camera.right = W / 2;
    camera.top = H / 2;
    camera.bottom = -H / 2;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  function setTheme() {
    const dark = document.documentElement.dataset.theme === "dark";
    shared.uPaper.value.copy(readColor("--paper"));
    shared.uGround.value.copy(readColor("--ground"));
    shared.uRing.value.copy(readColor("--ink"));
    shared.uTint.value.setRGB(...(dark ? TINT_DARK : TINT_LIGHT));
    shared.uRoom.value = dark ? 0.6 : 0;
  }
  setTheme();

  function render(time = performance.now() / 1000) {
    shared.uTime.value = time;
    const clipRects = new Map();
    const clipRect = (el) => {
      if (!clipRects.has(el)) clipRects.set(el, el.getBoundingClientRect());
      return clipRects.get(el);
    };
    for (const m of medias) {
      const mesh = m.mesh;
      if (!(m.near || m.viewer) || !m.tex) {
        mesh.visible = false;
        continue;
      }
      const r = m.el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1 || r.bottom < -40 || r.top > H + 40 || r.right < -40 || r.left > W + 40) {
        mesh.visible = false;
        continue;
      }
      mesh.visible = true;
      mesh.position.set(r.left + r.width / 2 - W / 2, H / 2 - r.top - r.height / 2, 0);
      mesh.scale.set(r.width, r.height, 1);

      const u = mesh.material.uniforms;
      const a = m.tex[m.texA] || m.tex[0];
      const b = m.tex[m.texB] || a;
      u.uTexA.value = a.tex;
      u.uImgA.value.set(a.w, a.h);
      u.uTexB.value = b.tex;
      u.uEdgeA.value.copy(a.edge || shared.uGround.value);
      u.uEdgeB.value.copy(b.edge || shared.uGround.value);
      u.uImgB.value.set(b.w, b.h);
      u.uMix.value = m.mix;
      u.uRes.value.set(r.width, r.height);
      u.uZoom.value = m.zoom;
      u.uShift.value = m.shift;
      u.uDevelop.value = m.develop;
      u.uHover.value = m.hover;
      u.uMono.value = m.mono;
      u.uMouse.value.set(m.mouse.x, m.mouse.y);
      u.uLens.value = m.lens;
      u.uMag.value = m.mag;
      u.uClip.value.set(m.clip.t, m.clip.r, m.clip.b, m.clip.l);
      let bl = -1e5, bt = -1e5, br = 1e5, bb = 1e5;
      for (const el of m.clips) {
        const c = clipRect(el);
        bl = Math.max(bl, c.left - r.left);
        bt = Math.max(bt, c.top - r.top);
        br = Math.min(br, c.right - r.left);
        bb = Math.min(bb, c.bottom - r.top);
      }
      u.uBounds.value.set(bl, bt, br, bb);
      u.uLoaded.value = a.loaded ? m.loaded : 0;
    }
    renderer.render(scene, camera);
  }

  return {
    canvas,
    render,
    setTheme,
    texture,
    load,
    setVelocity(v) {
      shared.uVel.value = v;
    },
    pageAlpha,
    viewerAlpha,
  };
}
