const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = siteNav.querySelectorAll("a");

function setMenuOpen(isOpen) {
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.querySelector(".sr-only").textContent = isOpen
    ? "Close navigation"
    : "Open navigation";
  siteNav.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  setMenuOpen(!isOpen);
});

for (const link of navLinks) {
  link.addEventListener("click", () => setMenuOpen(false));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuOpen(false);
    menuButton.focus();
  }
});

const form = document.querySelector("#registration-form");
const formMessage = document.querySelector("#form-message");
const formProgress = document.querySelector(".form-progress");
const steps = Array.from(document.querySelectorAll(".form-step"));
const progressItems = Array.from(document.querySelectorAll(".progress-item"));
const nextButton = document.querySelector(".next-button");
const backButton = document.querySelector(".back-button");
const previousStudyFields = document.querySelector("#previous-study-fields");
const attendanceOptions = document.querySelectorAll('[name="attendedBefore"]');
const successState = document.querySelector("#success-state");
const resetButton = document.querySelector(".reset-form");

function showFormMessage(message) {
  formMessage.textContent = message;
  formMessage.hidden = false;
  formMessage.focus();
}

function clearFormMessage() {
  formMessage.hidden = true;
  formMessage.textContent = "";
}

function validateStep(stepNumber) {
  const step = steps[stepNumber - 1];
  const requiredFields = Array.from(step.querySelectorAll("[required]"));
  let firstInvalidField = null;

  for (const field of requiredFields) {
    field.removeAttribute("aria-invalid");

    if (!field.checkValidity()) {
      field.setAttribute("aria-invalid", "true");
      if (!firstInvalidField) {
        firstInvalidField = field;
      }
    }
  }

  if (firstInvalidField) {
    showFormMessage("Please complete the required fields before continuing.");
    firstInvalidField.focus();
    return false;
  }

  clearFormMessage();
  return true;
}

function showStep(stepNumber) {
  for (const step of steps) {
    const isCurrent = Number(step.dataset.step) === stepNumber;
    step.hidden = !isCurrent;
    step.classList.toggle("is-active", isCurrent);
  }

  for (const item of progressItems) {
    const itemStep = Number(item.dataset.progress);
    item.classList.toggle("is-active", itemStep === stepNumber);
    item.classList.toggle("is-complete", itemStep < stepNumber);
  }

  formProgress.classList.toggle("is-second-step", stepNumber === 2);
  clearFormMessage();

  const currentLegend = steps[stepNumber - 1].querySelector("legend");
  currentLegend.setAttribute("tabindex", "-1");
  currentLegend.focus();
}

nextButton.addEventListener("click", () => {
  if (validateStep(1)) {
    showStep(2);
  }
});

backButton.addEventListener("click", () => showStep(1));

for (const option of attendanceOptions) {
  option.addEventListener("change", () => {
    previousStudyFields.hidden = option.value !== "yes";
  });
}

form.addEventListener("input", (event) => {
  if (event.target.matches("input, select, textarea")) {
    event.target.removeAttribute("aria-invalid");
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateStep(2)) {
    return;
  }

  const studentName = document.querySelector("#student-name").value.trim();
  document.querySelector("#success-name").textContent = studentName || "student";
  form.hidden = true;
  formProgress.hidden = true;
  successState.hidden = false;
  successState.focus();
});

resetButton.addEventListener("click", () => {
  form.reset();
  previousStudyFields.hidden = true;
  successState.hidden = true;
  form.hidden = false;
  formProgress.hidden = false;
  showStep(1);
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
