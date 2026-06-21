// ============================================================
//  Happy Father's Day card
//  Two jobs: (1) open the envelope, (2) float cute hearts.
// ============================================================

// 💡 Personalize me! These emojis are what drift up the screen.
const HEART_EMOJIS = ["💙", "❤️", "👔", "⭐", "🧡"];

const envelope = document.getElementById("envelope");
const heartsLayer = document.getElementById("hearts");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// ---- 1. Open / close the card -------------------------------
function toggleCard() {
  const isOpening = !envelope.classList.contains("open");
  envelope.classList.toggle("open");
  if (isOpening) celebrate(); // little burst when it opens
}

envelope.addEventListener("click", toggleCard);
envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleCard();
  }
});

// ---- 2. Floating hearts -------------------------------------
// Spawns one heart at a random horizontal spot, with a random
// size and drift speed so the motion never looks uniform.
function spawnHeart() {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent =
    HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];

  const size = 0.9 + Math.random() * 1.4;          // 0.9–2.3rem
  const duration = 6 + Math.random() * 5;          // 6–11s to rise
  const drift = (Math.random() - 0.5) * 60;        // gentle side sway

  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = size + "rem";
  heart.style.animationDuration = duration + "s";
  heart.style.setProperty("--drift", drift + "px");

  heartsLayer.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000);
}

// A happy burst of hearts when the card pops open.
function celebrate() {
  if (prefersReducedMotion) return;
  for (let i = 0; i < 14; i++) {
    setTimeout(spawnHeart, i * 90);
  }
}

// Gentle ambient hearts in the background.
if (!prefersReducedMotion) {
  setInterval(spawnHeart, 900);
}
