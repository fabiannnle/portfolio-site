import { gsap } from "gsap";

// Phone and tablet navigation: a full-screen sheet of large links behind the masthead.
export function initMenu({ lock, reduce }) {
  const button = document.querySelector(".menu-toggle");
  const menu = document.getElementById("site-menu");
  const head = document.querySelector(".masthead");
  const words = [...menu.querySelectorAll(".menu__links a span")];
  let open = false;

  const set = (value) => {
    if (open === value) return;
    open = value;
    button.setAttribute("aria-expanded", String(value));
    button.setAttribute("aria-label", value ? "Close menu" : "Open menu");
    head.classList.toggle("is-menu", value);
    head.classList.remove("is-hidden");
    lock(value);
    gsap.killTweensOf([menu, ...words]);

    if (value) {
      menu.hidden = false;
      gsap.fromTo(menu, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: reduce ? 0 : 0.7, ease: "expo.inOut" });
      gsap.fromTo(
        words,
        { yPercent: reduce ? 0 : 110 },
        { yPercent: 0, duration: reduce ? 0 : 1, ease: "expo.out", stagger: 0.07, delay: reduce ? 0 : 0.25 },
      );
      menu.querySelector("a").focus({ preventScroll: true });
    } else {
      gsap.to(menu, {
        clipPath: "inset(0 0 100% 0)",
        duration: reduce ? 0 : 0.55,
        ease: "expo.inOut",
        onComplete: () => (menu.hidden = true),
      });
    }
  };

  button.addEventListener("click", () => set(!open));
  // Links close the menu first, so the page is unlocked before the scroll handler runs.
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) set(false);
  });
  document.addEventListener("keydown", (event) => {
    if (open && event.key === "Escape") {
      set(false);
      button.focus();
    }
  });
  matchMedia("(min-width: 900px)").addEventListener("change", (event) => event.matches && set(false));
}
