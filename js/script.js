// Week 5: JavaScript fundamentals — variables, functions, conditionals, loops

const name = "Fabian";

console.log(`Portfolio site loaded for ${name}.`);

function getGreeting(hour) {
  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

const currentHour = new Date().getHours();
console.log(`${getGreeting(currentHour)} — thanks for visiting.`);

const skills = ["HTML", "CSS", "JavaScript"];

for (let i = 0; i < skills.length; i++) {
  console.log(`Skill ${i + 1}: ${skills[i]}`);
}

// Week 6: JavaScript & the DOM — this is where the page starts actually
// changing, and where last week's "visitCount always shows 1" problem
// gets a real fix.

// DOM SELECTION: getElementById grabs the one element with that id from
// the actual page, so JS can read or change it.
const themeToggleBtn = document.getElementById("theme-toggle");

// LOCAL STORAGE: a small key-value store the browser keeps for this site,
// which survives page reloads and closing the tab — unlike a plain
// variable, which resets to nothing every time the script re-runs.
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggleBtn.textContent = "☀️";
}

// EVENT LISTENER: registers a function that runs every time this specific
// event ("click") happens on this specific element.
themeToggleBtn.addEventListener("click", function () {
  // classList.toggle adds the class if it's missing, removes it if it's
  // present — flipping it on every click.
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  themeToggleBtn.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// The real fix for last week's counter: read the last saved count from
// localStorage (or start at 0 if there isn't one yet), add 1, then save it
// straight back — so it actually accumulates across reloads now.
const storedCount = localStorage.getItem("visitCount");
const visitCount = storedCount ? parseInt(storedCount) + 1 : 1;
localStorage.setItem("visitCount", visitCount);
console.log(
  `Times this page has loaded, now actually persisted: ${visitCount}`,
);

// Week 7: events, forms, and basic validation

const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", function (event) {
  // preventDefault() stops the browser's default reaction to this event.
  // For a form submit, the default is "reload the page and send the data
  // somewhere" — we want to handle it with our own JS instead.
  event.preventDefault();

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const messageError = document.getElementById("message-error");
  const successMessage = document.getElementById("form-success");

  // Clear any error messages left over from a previous attempt.
  nameError.textContent = "";
  emailError.textContent = "";
  messageError.textContent = "";
  successMessage.textContent = "";

  let isValid = true;

  // .trim() strips leading/trailing spaces, so typing just spaces doesn't
  // count as "filled in."
  if (nameInput.value.trim() === "") {
    nameError.textContent = "Please enter your name.";
    isValid = false;
  }

  // A basic (not perfect) pattern: something@something.something
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value.trim())) {
    emailError.textContent = "Please enter a valid email address.";
    isValid = false;
  }

  if (messageInput.value.trim() === "") {
    messageError.textContent = "Please enter a message.";
    isValid = false;
  }

  if (isValid) {
    successMessage.textContent =
      "Thanks! This looks good — we'll connect this to a real backend service later so it actually sends.";
    contactForm.reset();
  }
});
