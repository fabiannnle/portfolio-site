const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validates in the browser, then posts to Netlify Forms without leaving the page.
export function initForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const button = form.querySelector('button[type="submit"]');

  const rules = [
    { field: form.elements.name, test: (v) => v !== "", message: "Enter your name." },
    { field: form.elements.email, test: (v) => EMAIL.test(v), message: "Enter an email address, like name@example.com." },
    { field: form.elements.message, test: (v) => v !== "", message: "Write a few lines about your project." },
  ];

  const check = (rule) => {
    const ok = rule.test(rule.field.value.trim());
    const error = document.getElementById(`${rule.field.id}-error`);
    error.textContent = ok ? "" : rule.message;
    rule.field.setAttribute("aria-invalid", String(!ok));
    return ok;
  };

  rules.forEach((rule) =>
    rule.field.addEventListener("blur", () => {
      if (rule.field.value.trim() !== "" || rule.field.getAttribute("aria-invalid") === "true") check(rule);
    }),
  );

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";
    const results = rules.map(check);
    const firstInvalid = rules[results.indexOf(false)];
    if (firstInvalid) {
      firstInvalid.field.focus();
      return;
    }

    button.disabled = true;
    button.textContent = "Sending…";
    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      rules.forEach((rule) => rule.field.removeAttribute("aria-invalid"));
      status.textContent = "Thanks, your message is on its way. I’ll reply by email.";
    } catch {
      status.textContent = "Your message didn’t send. Check your connection and try again.";
    } finally {
      button.disabled = false;
      button.textContent = "Send enquiry";
    }
  });
}
