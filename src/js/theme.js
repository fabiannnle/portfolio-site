// The light table by day, the darkroom by night: same room, same layout, different light.
export function initTheme(onChange) {
  const root = document.documentElement;
  const button = document.querySelector(".switch");
  const metas = document.querySelectorAll('meta[name="theme-color"]');

  const sync = () => {
    const dark = root.dataset.theme === "dark";
    button.setAttribute("aria-pressed", String(dark));
    const paper = getComputedStyle(root).getPropertyValue("--paper").trim();
    metas.forEach((meta) => meta.setAttribute("content", paper));
  };
  sync();

  button.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    const apply = () => {
      if (next === "dark") root.dataset.theme = "dark";
      else delete root.dataset.theme;
      try {
        localStorage.setItem("theme", next);
      } catch {}
      sync();
      onChange?.();
    };

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) {
      apply();
      return;
    }

    // The new light spreads out from the lamp in the switch.
    const lamp = button.querySelector(".switch__lamp").getBoundingClientRect();
    const x = lamp.left + lamp.width / 2;
    const y = lamp.top + lamp.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 950, easing: "cubic-bezier(0.7, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  });
}
