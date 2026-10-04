/* ========== 1. GET THE ELEMENTS WE NEED ========== */
const navbar = document.getElementById("navbar");
const navLinks = document.getElementById("nav-links");
const menuToggle = document.getElementById("menu-toggle");
const themeToggle = document.getElementById("theme-toggle");
const backToTop = document.getElementById("back-to-top");
const form = document.getElementById("contact-form");

/* ========== 2. MOBILE HAMBURGER MENU ========== */
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  // Update Flaticon icon (Cross when open, Burger when closed)
  menuToggle.innerHTML = isOpen ? '<i aria-hidden="true" class="fi fi-rr-cross"></i>' : '<i aria-hidden="true" class="fi fi-rr-menu-burger"></i>';
});

// Close the menu after clicking a link
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.innerHTML = '<i aria-hidden="true" class="fi fi-rr-menu-burger"></i>';
  });
});

/* ========== 3. DARK / LIGHT THEME ========== */
function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    // Sun icon for light mode
    themeToggle.innerHTML = '<i aria-hidden="true" class="fi fi-rr-sun"></i>';
  } else {
    document.documentElement.removeAttribute("data-theme");
    // Moon icon for dark mode
    themeToggle.innerHTML = '<i aria-hidden="true" class="fi fi-rr-moon-stars"></i>';
  }
}

// Load the saved choice (works even if storage is blocked)
let savedTheme = "dark";
try { savedTheme = localStorage.getItem("theme") || "dark"; } catch (e) {}
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.hasAttribute("data-theme") ? "dark" : "light";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

/* ========== 4. SCROLL EFFECTS (navbar shadow + back-to-top) ========== */
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
  backToTop.classList.toggle("show", window.scrollY > 500);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ========== 5. SCROLL REVEAL ========== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ========== 6. ANIMATED NUMBER COUNTERS ========== */
function runCounter(el) {
  const target = Number(el.dataset.target);
  const duration = 1500; 
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll(".count").forEach((el) => counterObserver.observe(el));

/* ========== 7. CONTACT FORM VALIDATION ========== */
function showError(fieldId, message) {
  document.getElementById(fieldId).classList.add("invalid");
  document.getElementById(fieldId + "-error").textContent = message;
}

function clearError(fieldId) {
  document.getElementById(fieldId).classList.remove("invalid");
  document.getElementById(fieldId + "-error").textContent = "";
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); 

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const success = document.getElementById("form-success");
  let valid = true;

  ["name", "email", "message"].forEach(clearError);
  success.textContent = "";

  if (name.length < 2) {
    showError("name", "Please enter your name (at least 2 letters).");
    valid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showError("email", "Please enter a valid email, like name@example.com.");
    valid = false;
  }

  if (message.length < 10) {
    showError("message", "Please write at least 10 characters about your project.");
    valid = false;
  }

  if (valid) {
    success.textContent = `Thanks, ${name}! We'll reply to ${email} within one working day.`;
    form.reset();
  }
});