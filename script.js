// ====== 1) Set người nhận qua URL: ?to=Ten%20Nguoi%20Ay ======
const params = new URLSearchParams(location.search);
const to = params.get("to");
if (to) document.getElementById("recipient").textContent = to;

// ====== 2) Starfield canvas ======
const starsCanvas = document.getElementById("stars");
const sctx = starsCanvas.getContext("2d");
let SW = 0,
  SH = 0,
  DPR = 1;
let stars = [];

// ====== 3) Fireworks canvas (simple but đẹp) ======
const fwCanvas = document.getElementById("fireworks");
const fwCtx = fwCanvas.getContext("2d");

const particles = [];
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function resizeAll() {
  DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  SW = Math.floor(window.innerWidth);
  SH = Math.floor(window.innerHeight);

  [starsCanvas, fwCanvas].forEach((c) => {
    c.width = Math.floor(SW * DPR);
    c.height = Math.floor(SH * DPR);
    c.style.width = SW + "px";
    c.style.height = SH + "px";
  });

  sctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  fwCtx.setTransform(DPR, 0, 0, DPR, 0, 0);

  // regen stars
  stars = Array.from({ length: Math.floor((SW * SH) / 14000) }, () => ({
    x: Math.random() * SW,
    y: Math.random() * SH,
    r: Math.random() * 1.6 + 0.2,
    a: Math.random() * 0.6 + 0.2,
    tw: Math.random() * 0.02 + 0.005,
  }));
}
window.addEventListener("resize", resizeAll);

function drawStars() {
  // background subtle gradients
  const g1 = sctx.createRadialGradient(
    SW * 0.2,
    SH * 0.2,
    0,
    SW * 0.2,
    SH * 0.2,
    Math.max(SW, SH)
  );
  g1.addColorStop(0, "rgba(168,85,247,0.22)");
  g1.addColorStop(0.55, "rgba(10,8,18,0.0)");

  const g2 = sctx.createRadialGradient(
    SW * 0.8,
    SH * 0.7,
    0,
    SW * 0.8,
    SH * 0.7,
    Math.max(SW, SH)
  );
  g2.addColorStop(0, "rgba(34,211,238,0.18)");
  g2.addColorStop(0.6, "rgba(10,8,18,0.0)");

  sctx.clearRect(0, 0, SW, SH);
  sctx.fillStyle = "#05040a";
  sctx.fillRect(0, 0, SW, SH);
  sctx.fillStyle = g1;
  sctx.fillRect(0, 0, SW, SH);
  sctx.fillStyle = g2;
  sctx.fillRect(0, 0, SW, SH);

  for (const st of stars) {
    st.a += (Math.random() - 0.5) * st.tw;
    st.a = Math.max(0.05, Math.min(0.95, st.a));
    sctx.beginPath();
    sctx.fillStyle = `rgba(255,255,255,${st.a})`;
    sctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
    sctx.fill();
  }
}

function spawnFirework(x, y) {
  const count = Math.floor(rand(60, 110));
  const palette = [
    [255, 79, 216], // pink
    [168, 85, 247], // purple
    [34, 211, 238], // cyan
    [255, 200, 80], // warm
  ];
  const base = palette[Math.floor(Math.random() * palette.length)];

  for (let i = 0; i < count; i++) {
    const ang = Math.PI * 2 * (i / count);
    const sp = rand(2.2, 6.2);
    particles.push({
      x,
      y,
      vx: Math.cos(ang) * sp + rand(-0.6, 0.6),
      vy: Math.sin(ang) * sp + rand(-0.6, 0.6),
      life: rand(50, 90),
      r: rand(1.2, 2.6),
      col: base,
      glow: rand(0.35, 0.7),
      g: rand(0.03, 0.06), // gravity
    });
  }
}

function updateFireworks() {
  // fade trail
  fwCtx.fillStyle = "rgba(0,0,0,0.18)";
  fwCtx.fillRect(0, 0, SW, SH);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= 1;
    p.vx *= 0.985;
    p.vy *= 0.985;
    p.vy += p.g;

    p.x += p.vx;
    p.y += p.vy;

    const t = Math.max(0, p.life / 90);
    const [r, g, b] = p.col;

    fwCtx.beginPath();
    fwCtx.fillStyle = `rgba(${r},${g},${b},${t})`;
    fwCtx.shadowBlur = 18;
    fwCtx.shadowColor = `rgba(${r},${g},${b},${p.glow})`;
    fwCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    fwCtx.fill();
    fwCtx.shadowBlur = 0;

    if (p.life <= 0) particles.splice(i, 1);
  }
}

// Auto fireworks
let autoTimer = 0;
function autoFireworks() {
  autoTimer++;
  if (autoTimer % 18 === 0) {
    spawnFirework(rand(SW * 0.15, SW * 0.85), rand(SH * 0.12, SH * 0.55));
  }
}

// ====== 4) Floating bubbles + photos (giống video) ======
const floatLayer = document.getElementById("floatLayer");

// Bạn thay ảnh ở đây (để trong assets/)
const photos = [
  "assets/anh/img1.jpg",
  "assets/anh/img2.jpg",
  "assets/anh/img3.jpg",
  "assets/anh/img4.jpg",
  "assets/anh/img5.jpg",
  "assets/anh/img6.jpg",
  "assets/anh/img7.jpg",
  "assets/anh/img8.jpg",
];

// Bạn thay câu chữ ở đây
const bubbles = [
  { text: "Happy New Year 2026 ✨", tone: "purple" },
  { text: "Chúc năm mới bình an 🌸", tone: "cyan" },
  { text: "Mãi vui vẻ nhé 💖", tone: "purple" },
  { text: "Thành công rực rỡ 🎆", tone: "cyan" },
  { text: "Gặp người như ý 💗", tone: "purple" },
  { text: "Forever and Always", tone: "cyan" },
];

function makeFloatItem() {
  const isPhoto = Math.random() < 0.55 && photos.length > 0;

  const el = document.createElement("div");
  el.className = "float-item " + (isPhoto ? "photo" : "bubble");

  const x = rand(20, SW - 220);
  const y = rand(20, SH - 120);

  const dx = rand(-220, 220);
  const dy = rand(-260, 260);
  const dur = rand(10, 18);

  el.style.left = x + "px";
  el.style.top = y + "px";
  el.style.setProperty("--dx", dx + "px");
  el.style.setProperty("--dy", dy + "px");
  el.style.animationDuration = dur + "s";

  if (isPhoto) {
    const img = document.createElement("img");
    img.src = photos[Math.floor(Math.random() * photos.length)];
    img.alt = "photo";

    const txt = document.createElement("div");
    txt.style.fontWeight = "800";
    txt.style.fontSize = "13px";
    txt.style.opacity = "0.95";
    txt.textContent =
      "💬 " + bubbles[Math.floor(Math.random() * bubbles.length)].text;

    el.appendChild(img);
    el.appendChild(txt);
  } else {
    const b = bubbles[Math.floor(Math.random() * bubbles.length)];
    el.classList.add(b.tone);
    el.textContent = b.text;
  }

  floatLayer.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000);
}

function floatLoop() {
  if (floatLayer.childElementCount < 18) makeFloatItem();
}

/* =========================================================
   ✅ [BỔ SUNG] 5) BGM: bật nhạc sau lần chạm/click đầu tiên
   (để vượt autoplay policy của Chrome/iOS)
   ========================================================= */
const bgm = document.getElementById("bgm");
let musicStarted = false;

function tryPlayMusic() {
  if (!bgm || musicStarted) return;

  bgm.volume = 0.6; // chỉnh nhỏ lại cho dễ nghe
  const p = bgm.play();
  if (p && typeof p.then === "function") {
    p.then(() => {
      musicStarted = true;
      console.log("🎵 Music started");
    }).catch(() => {
      // bị chặn autoplay -> sẽ thử lại ở lần tương tác tiếp theo
      console.log("Autoplay blocked, waiting for interaction");
    });
  } else {
    // một số browser cũ không trả Promise
    musicStarted = true;
  }
}

/* =========================================================
   ✅ [BỔ SUNG] 6) GỘP pointerdown: vừa bật nhạc vừa bắn pháo hoa
   (tránh đăng ký listener 2 lần gây lỗi/hành vi lạ)
   ========================================================= */
window.addEventListener(
  "pointerdown",
  (e) => {
    tryPlayMusic();
    spawnFirework(e.clientX, e.clientY);
  },
  { passive: true }
);

// (tuỳ chọn) thử bật nhạc sớm nếu browser cho phép (thường sẽ fail, nhưng không hại)
window.addEventListener("load", () => {
  tryPlayMusic();
});

// ====== 7) Main loop ======
function tick() {
  drawStars();
  updateFireworks();
  autoFireworks();
  floatLoop();
  requestAnimationFrame(tick);
}

resizeAll();

// init fireworks background fade
fwCtx.fillStyle = "rgba(0,0,0,1)";
fwCtx.fillRect(0, 0, SW, SH);

tick();
