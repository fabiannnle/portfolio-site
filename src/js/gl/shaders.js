export const vertex = /* glsl */ `
uniform float uVel;
uniform vec2 uRes;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 p = position;
  // A print bows very slightly with scroll speed, like paper lifted off the easel.
  p.y -= sin(uv.x * 3.14159265) * clamp(uVel, -40.0, 40.0) * 0.3 / max(uRes.y, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

export const fragment = /* glsl */ `
precision highp float;

uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform vec2 uImgA;
uniform vec2 uImgB;
uniform float uMix;

uniform vec2 uRes;
uniform float uFit;
uniform float uZoom;
uniform float uShift;

uniform vec3 uPaper;
uniform vec3 uEdgeA;
uniform vec3 uEdgeB;
uniform vec2 uFocus;
uniform vec3 uRing;

uniform float uDevelop;
uniform float uMono;
uniform float uHover;
uniform vec2 uMouse;
uniform float uLens;
uniform float uMag;
uniform vec4 uClip;
uniform vec4 uBounds;
uniform float uBands;
uniform float uTime;
uniform float uDpr;
uniform float uLoaded;
uniform float uAlpha;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

// object-fit for a texture inside the plane: 0 = cover, 1 = contain.
vec2 fitUv(vec2 uv, vec2 img, out float inside) {
  float rs = uRes.x / max(uRes.y, 1.0);
  float ri = img.x / max(img.y, 1.0);
  vec2 s = uFit < 0.5
    ? vec2(min(rs / ri, 1.0), min(ri / rs, 1.0))
    : vec2(max(rs / ri, 1.0), max(ri / rs, 1.0));
  s /= uZoom;
  vec2 o = (uv - 0.5) * s + 0.5;
  o += (1.0 - s) * uFocus * 0.5 * step(uFit, 0.5);
  o.y += uShift * (1.0 - 1.0 / uZoom) * 0.5;
  inside = step(0.0, o.x) * step(o.x, 1.0) * step(0.0, o.y) * step(o.y, 1.0);
  return o;
}

vec3 sampleImg(vec2 uv) {
  float inA;
  float inB;
  vec2 a = fitUv(uv, uImgA, inA);
  vec2 b = fitUv(uv, uImgB, inB);
  vec3 ca = mix(uEdgeA, texture2D(uTexA, a).rgb, inA);
  if (uMix <= 0.0) return ca;
  vec3 cb = mix(uEdgeB, texture2D(uTexB, b).rgb, inB);
  // Dissolve through soft noise, washing toward paper at the seam as if re-developed.
  float n = noise(uv * vec2(uRes.x / max(uRes.y, 1.0), 1.0) * 5.0);
  float t = smoothstep(n - 0.12, n + 0.12, uMix * 1.24 - 0.12);
  vec3 c = mix(ca, cb, t);
  return mix(c, uPaper, t * (1.0 - t) * 2.2);
}

void main() {
  vec2 uv = vUv;
  float fromTop = 1.0 - uv.y;
  if (uv.x < uClip.w || uv.x > 1.0 - uClip.y || fromTop < uClip.x || fromTop > 1.0 - uClip.z) discard;

  vec2 px = vec2(uv.x, fromTop) * uRes;
  if (px.x < uBounds.x || px.y < uBounds.y || px.x > uBounds.z || px.y > uBounds.w) discard;

  // Loupe
  float d = distance(px, uMouse);
  float R = uLens;
  float lens = (1.0 - smoothstep(R - 1.5, R, d)) * step(0.001, uHover);
  float mag = mix(1.0, uMag, uHover);
  vec2 lpx = uMouse + (px - uMouse) / mag;
  vec2 luv = vec2(lpx.x / uRes.x, 1.0 - lpx.y / uRes.y);
  vec2 suv = mix(uv, luv, lens);

  float rim = smoothstep(R * 0.5, R, d) * lens;
  vec2 dir = (px - uMouse) / max(d, 1.0);
  vec2 ab = vec2(dir.x, -dir.y) / uRes * rim * 3.5;

  vec3 col;
  if (rim > 0.001) {
    col.r = sampleImg(suv + ab).r;
    col.g = sampleImg(suv).g;
    col.b = sampleImg(suv - ab).b;
  } else {
    col = sampleImg(suv);
  }

  // Silver gelatin: neutral monochrome with a gentle toe and shoulder. Prints look the same in either theme.
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  vec3 silver = vec3(smoothstep(0.02, 0.98, lum));
  vec3 c = mix(silver, col, max(1.0 - uMono, lens));

  // Test strip: six bands, each exposed twice as long as the last.
  if (uBands > 0.5) {
    float band = floor(uv.x * 6.0);
    c = pow(max(c, 0.0), vec3(0.55 + band * 0.3)) * mix(1.0, 0.42, band / 5.0);
    float seam = step(fract(uv.x * 6.0) * uRes.x / 6.0, 1.0);
    c = mix(c, uPaper, seam * 0.9);
  }

  // Developing: the darkest tones arrive first, highlights last.
  float nz = noise(px * 0.018) * 0.18 + hash(floor(px * 0.5)) * 0.05;
  float l2 = dot(c, vec3(0.2126, 0.7152, 0.0722));
  float appear = smoothstep(0.0, 0.22, uDevelop * 1.6 - l2 * 1.1 - nz);
  c = mix(uPaper, c, appear * uLoaded);

  // Loupe barrel and a faint hush around it.
  float ring = smoothstep(R - 2.5, R - 1.0, d) * (1.0 - smoothstep(R, R + 1.0, d)) * uHover;
  c *= 1.0 - 0.07 * uHover * (1.0 - lens);
  c = mix(c, uRing, ring * 0.85);

  // Grain at a fixed on-screen size, independent of the print's scale.
  float g = hash(floor(gl_FragCoord.xy / uDpr) + floor(uTime * 12.0) * vec2(13.1, 7.7)) - 0.5;
  c += g * 0.012;

  gl_FragColor = vec4(c * uAlpha, uAlpha);
}
`;
