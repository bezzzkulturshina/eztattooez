/* ===========================================================
   EZ Tattoo — full site logic
   =========================================================== */

/* ---------- CONFIG ---------- */
const CONFIG = {
  whatsapp: "393455379200", // no + and no spaces
  instagram: "https://www.instagram.com/elena_z_tattoo/",
};

/* ===========================================================
   1. MENU (burger + smooth scroll)
   =========================================================== */
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const header = document.getElementById("header");

burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  nav.classList.toggle("open");
});

window.addEventListener("scroll", () => {
  header.classList.toggle("solid", window.scrollY > 60);
});

/* Smooth scroll */
function smoothScrollTo(targetY, duration = 1400) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let start = null;

  function step(ts) {
    if (start === null) start = ts;
    const t = Math.min((ts - start) / duration, 1);
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    window.scrollTo(0, startY + diff * eased);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.querySelectorAll("[data-scroll]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(el.getAttribute("data-scroll"));
    if (!target) return;
    burger.classList.remove("open");
    nav.classList.remove("open");
    const y = target.getBoundingClientRect().top + window.scrollY - 60;
    smoothScrollTo(y, 1500);
  });
});

/* ===========================================================
   2. REVEAL SECTIONS ON SCROLL
   =========================================================== */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ===========================================================
   3. CAROUSEL (3D Circle)
   =========================================================== */
const slides = Array.from(document.querySelectorAll(".slide"));
let current = 0;

function renderCarousel() {
  const n = slides.length;
  slides.forEach((slide, i) => {
    let offset = i - current;
    if (offset > n / 2) offset -= n;
    if (offset < -n / 2) offset += n;

    const abs = Math.abs(offset);
    const x = offset * 210;
    const z = -abs * 260;
    const rotY = offset * -22;
    const scale = offset === 0 ? 1 : 0.82 - (abs - 1) * 0.08;

    slide.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`;
    slide.style.filter = offset === 0 ? "grayscale(0) brightness(1)" : `grayscale(1) brightness(${0.5 - abs * 0.08})`;
    slide.style.opacity = abs > 2 ? 0 : 1;
    slide.style.zIndex = 10 - abs;
    slide.style.pointerEvents = abs > 2 ? "none" : "auto";
  });
}

function move(dir) {
  current = (current + dir + slides.length) % slides.length;
  renderCarousel();
}

document.querySelector(".prev").addEventListener("click", () => move(-1));
document.querySelector(".next").addEventListener("click", () => move(1));
slides.forEach((s, i) =>
  s.addEventListener("click", () => {
    current = i;
    renderCarousel();
  })
);
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") move(-1);
  if (e.key === "ArrowRight") move(1);
});
renderCarousel();

/* ===========================================================
   4. MODALS
   =========================================================== */
function openModal(id) {
  document.getElementById(id).classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeModal(id) {
  document.getElementById(id).classList.remove("show");
  document.body.style.overflow = "";
}
document.querySelectorAll("[data-open]").forEach((b) =>
  b.addEventListener("click", () => openModal(b.dataset.open))
);
document.querySelectorAll("[data-close]").forEach((b) =>
  b.addEventListener("click", () => closeModal(b.dataset.close))
);
document.querySelectorAll(".modal").forEach((m) =>
  m.addEventListener("click", (e) => {
    if (e.target === m) closeModal(m.id);
  })
);

/* ===========================================================
   5. STYLES SWITCHER IN BOOKING
   =========================================================== */

const styles = [
  {
    name: "Realism",
    image: "eztattoo2/IMG_9539.png"
  },
  {
    name: "Portrait",
    image: "portrait/IMG_0886.png"
  },
  {
    name: "Chicano",
    image: "chicano/chicano.jpg"
  },
  {
    name: "Linework",
    image: "linework/IMG_4643.png"
  },
  {
    name: "Black and grey",
    image: "Black and grey/IMG_4738.png"
  },
  {
    name: "Concept tattoo",
    image: "portrait3/IMG_1502.png"
  }
];

let styleIdx = 0;

const styleImage = document.getElementById("styleImage");
const styleLabel = document.getElementById("styleLabel");
const stylePrev = document.getElementById("stylePrev");
const styleNext = document.getElementById("styleNext");

function renderStyle() {
  const style = styles[styleIdx];

  styleLabel.textContent = style.name;
  styleImage.src = style.image;
  styleImage.alt = style.name + " tattoo";
}

stylePrev.addEventListener("click", () => {
  styleIdx = (styleIdx - 1 + styles.length) % styles.length;
  renderStyle();
});

styleNext.addEventListener("click", () => {
  styleIdx = (styleIdx + 1) % styles.length;
  renderStyle();
});

renderStyle();
/* ===========================================================
   6. FORM → MESSENGER CHOICE (ENGLISH)
   =========================================================== */

const form = document.getElementById("bookingForm");
let messageText = "";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const contact = form.contact.value.trim();
  const wish = form.wish.value.trim();

  let ok = true;

  [form.name, form.contact, form.wish].forEach((f) => {
    const empty = !f.value.trim();
    f.classList.toggle("field-error", empty);
    if (empty) ok = false;
  });

  if (!ok) return;

  messageText =
    `Hello! Request from EZ Tattoo website:\n` +
    `Name: ${name}\n` +
    `Phone / Email: ${contact}\n` +
    `Details: ${wish}`;

  document.getElementById("waStatus").classList.remove("show");
  document.getElementById("igStatus").classList.remove("show");

  document.getElementById("styleChoiceHint").textContent =
    "Your request is ready. Choose where to send it:";

  openModal("sendModal");
});

/* ---------- WhatsApp ---------- */

document.getElementById("sendWa").addEventListener("click", () => {
  const url =
    `https://wa.me/${CONFIG.whatsapp}?text=` +
    encodeURIComponent(messageText);

  const st = document.getElementById("waStatus");

  st.innerHTML =
    "The text was automatically pasted into WhatsApp.<br>" +
    `If it didn't open automatically — ` +
    `<a href="${url}" target="_blank" rel="noopener">click here</a>.`;

  st.classList.add("show");
  document.getElementById("igStatus").classList.remove("show");

  window.open(url, "_blank", "noopener");
});

/* ---------- Instagram ---------- */

document.getElementById("sendIg").addEventListener("click", async () => {
  const st = document.getElementById("igStatus");

  try {
    await navigator.clipboard.writeText(messageText);
  } catch (err) {
    const ta = document.createElement("textarea");
    ta.value = messageText;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }

  st.innerHTML =
    "Text copied to clipboard — paste it into Direct.<br>" +
    `If it didn't open automatically — ` +
    `<a href="${CONFIG.instagram}" target="_blank" rel="noopener">click here</a>.`;

  st.classList.add("show");
  document.getElementById("waStatus").classList.remove("show");

  window.open(CONFIG.instagram, "_blank", "noopener");
});
