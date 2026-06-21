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

// ============================================================
//  3. Redeem gift button + fireworks 🎆
// ============================================================

// 💡 Change this date to set when the "gift" unlocks.
const UNLOCK_DATE = new Date(2050, 5, 1); // month is 0-based, so 5 = June

const redeemBtn = document.getElementById("redeemBtn");
const lockedEl = document.getElementById("locked");

function showRedeemStatus() {
  const now = new Date();
  if (now >= UNLOCK_DATE) {
    lockedEl.innerHTML =
      "🎉 It's finally time! Your gift is <b>unlocked</b> — go redeem it!";
  } else {
    const daysLeft = Math.ceil((UNLOCK_DATE - now) / 86400000);
    lockedEl.innerHTML =
      "🔒 Locked until <b>June 1, 2050</b>.<br>" +
      "Come back then to redeem — only " +
      daysLeft.toLocaleString() + " days to go!";
  }
  lockedEl.hidden = false;
}

redeemBtn.addEventListener("click", () => {
  showRedeemStatus();
  // restart the little shake for tactile feedback
  redeemBtn.classList.remove("shake");
  void redeemBtn.offsetWidth;
  redeemBtn.classList.add("shake");
  fireworksShow();
});

// ----- Fireworks: a tiny canvas particle system --------------
const fwCanvas = document.getElementById("fireworks");
const fwCtx = fwCanvas.getContext("2d");
let fwParticles = [];
let fwRunning = false;
let fwW = 0;
let fwH = 0;

// 💡 The look of every burst lives in these constants.
const FW_COLORS = ["#ffd54a", "#ff7a8a", "#6aa9d6", "#9b6ad6", "#62d29a", "#ff9f5a"];

function sizeFwCanvas() {
  const dpr = window.devicePixelRatio || 1;
  fwW = window.innerWidth;
  fwH = window.innerHeight;
  fwCanvas.width = fwW * dpr;
  fwCanvas.height = fwH * dpr;
  fwCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
sizeFwCanvas();
window.addEventListener("resize", sizeFwCanvas);

// One burst: a ring of sparks flung outward from (x, y).
function launchBurst(x, y) {
  const count = 38 + Math.floor(Math.random() * 22); // 38–60 sparks
  const color = FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
    const speed = 2 + Math.random() * 4;
    fwParticles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.012 + Math.random() * 0.012,
      size: 2 + Math.random() * 2,
      color,
    });
  }
  if (!fwRunning) {
    fwRunning = true;
    requestAnimationFrame(fwTick);
  }
}

// The animation loop: gravity + drag pull sparks down as they fade.
function fwTick() {
  fwCtx.clearRect(0, 0, fwW, fwH);
  fwCtx.globalCompositeOperation = "lighter"; // additive glow where sparks overlap
  for (let i = fwParticles.length - 1; i >= 0; i--) {
    const p = fwParticles[i];
    p.vy += 0.045;  // gravity
    p.vx *= 0.99;   // air drag
    p.vy *= 0.99;
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;
    if (p.life <= 0) {
      fwParticles.splice(i, 1);
      continue;
    }
    fwCtx.globalAlpha = p.life;
    fwCtx.fillStyle = p.color;
    fwCtx.beginPath();
    fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    fwCtx.fill();
  }
  fwCtx.globalAlpha = 1;
  fwCtx.globalCompositeOperation = "source-over";
  if (fwParticles.length > 0) {
    requestAnimationFrame(fwTick);
  } else {
    fwCtx.clearRect(0, 0, fwW, fwH); // stop the loop when nothing's left
    fwRunning = false;
  }
}

// Fire several staggered bursts across the top of the screen.
function fireworksShow() {
  if (prefersReducedMotion) return;
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const x = fwW * (0.2 + Math.random() * 0.6);
      const y = fwH * (0.2 + Math.random() * 0.35);
      launchBurst(x, y);
    }, i * 220);
  }
}
