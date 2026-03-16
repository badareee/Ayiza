/* ============================================
   BIRTHDAY SURPRISE — script.js
   ============================================ */

// ===== PAGE TRANSITIONS =====
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.zIndex = '0';
  });
  const target = document.getElementById(id);
  target.style.zIndex = '1';
  // Force reflow
  void target.offsetWidth;
  target.classList.add('active');
}

// ===== STEP 1 — COUNTDOWN =====
// ===== STEP 1 — COUNTDOWN =====
(function initCountdown() {
  const target = new Date('2026-03-23T00:00:00');

  function pad(n) { return String(n).padStart(2, '0'); }

  let timer;

  function tick() {
    const now  = new Date();
    const diff = target - now;

    if (diff <= 0) {
      document.getElementById('days').textContent    = '00';
      document.getElementById('hours').textContent   = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      clearInterval(timer);
      setTimeout(() => showPage('login-page'), 0.001);
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    document.getElementById('days').textContent    = pad(d);
    document.getElementById('hours').textContent   = pad(h);
    document.getElementById('minutes').textContent = pad(m);
    document.getElementById('seconds').textContent = pad(s);
  }

  tick();
  timer = setInterval(tick, 1.0000);
})();
 
// ===== STARS CANVAS (countdown) =====
(function initStars() {
  const canvas = document.getElementById('stars-canvas');
  const ctx    = canvas.getContext('2d');
  let stars    = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    makeStars();
  }

  function makeStars() {
    stars = [];
    const count = Math.floor((W * H) / 5000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x:    Math.random() * W,
        y:    Math.random() * H,
        r:    Math.random() * 1.6 + 0.3,
        a:    Math.random(),
        da:   (Math.random() - 0.5) * 0.008,
        color: Math.random() > 0.6
          ? `rgba(245,214,128,${Math.random() * 0.6 + 0.2})`
          : `rgba(232,160,180,${Math.random() * 0.5 + 0.2})`
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.a += s.da;
      if (s.a <= 0 || s.a >= 1) s.da *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.a;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// ===== FLOATING PARTICLES (countdown) =====
(function initParticles() {
  const container = document.getElementById('particles');
  const icons = ['✨', '🌸', '💫', '⭐', '🌷', '✦'];

  function spawnParticle() {
    const el = document.createElement('span');
    el.className = 'particle';
    el.textContent = icons[Math.floor(Math.random() * icons.length)];
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: -20px;
      font-size: ${Math.random() * 14 + 10}px;
      opacity: 0;
      animation: particle-float ${Math.random() * 6 + 8}s linear forwards;
      animation-delay: ${Math.random() * 2}s;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 12000);
  }

  setInterval(spawnParticle, 700);
})();

// ===== STEP 2 — LOGIN =====
(function initLogin() {
  const btn      = document.getElementById('login-btn');
  const nameIn   = document.getElementById('name-input');
  const passIn   = document.getElementById('pass-input');
  const errorMsg = document.getElementById('error-msg');

  // Login stars
  const canvas = document.getElementById('login-canvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];

  function resizeLogin() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    makeLoginParticles();
  }

  function makeLoginParticles() {
    particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random()
      });
    }
  }

  function drawLogin() {
    if (!document.getElementById('login-page').classList.contains('active')) {
      requestAnimationFrame(drawLogin);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.a += 0.005;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,160,180,${Math.abs(Math.sin(p.a)) * 0.5 + 0.1})`;
      ctx.fill();
    });
    requestAnimationFrame(drawLogin);
  }

  window.addEventListener('resize', resizeLogin);
  resizeLogin();
  drawLogin();

  function attempt() {
    const name = nameIn.value.trim();
    const pass = passIn.value.trim();
    errorMsg.classList.remove('visible');

    if (name.toLowerCase() === 'ayiza' && pass === 'BirthdayQueen') {
      btn.innerHTML = '<span>✓ Welcome, Queen!</span>';
      btn.style.background = 'linear-gradient(135deg, #2d8b4a 0%, #1a5e30 100%)';
      setTimeout(() => {
        showPage('loader-page');
        startLoader();
      }, 800);
    } else {
      errorMsg.classList.add('visible');
      nameIn.style.borderColor = 'rgba(255,100,100,0.5)';
      passIn.style.borderColor = 'rgba(255,100,100,0.5)';
      setTimeout(() => {
        nameIn.style.borderColor = '';
        passIn.style.borderColor = '';
      }, 1500);
      // Shake
      const card = document.querySelector('.login-card');
      card.style.animation = 'none';
      card.style.transform = 'translateX(-8px)';
      setTimeout(() => { card.style.transform = 'translateX(8px)'; }, 80);
      setTimeout(() => { card.style.transform = 'translateX(-5px)'; }, 160);
      setTimeout(() => { card.style.transform = 'translateX(5px)'; }, 240);
      setTimeout(() => { card.style.transform = 'translateX(0)'; }, 320);
    }
  }

  btn.addEventListener('click', attempt);
  passIn.addEventListener('keydown', e => { if (e.key === 'Enter') attempt(); });
  nameIn.addEventListener('keydown', e => { if (e.key === 'Enter') passIn.focus(); });
})();

// ===== STEP 3 — LOADER =====
function startLoader() {
  const container = document.getElementById('loader-hearts');
  const sparklesRow = document.getElementById('sparkles-row');
  const hearts = ['💖', '💗', '💓', '✨', '🌸', '💫'];

  // Sparkles text
  sparklesRow.textContent = '✨ ✦ ✨ ✦ ✨';

  // Floating hearts
  function spawnHeart() {
    const el = document.createElement('span');
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      bottom: 0;
      font-size: ${Math.random() * 18 + 12}px;
      animation: heart-float ${Math.random() * 3 + 4}s ease-out forwards;
      pointer-events: none;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 7000);
  }

  const heartInterval = setInterval(spawnHeart, 400);

  setTimeout(() => {
    clearInterval(heartInterval);
    showPage('surprise-page');
    startSurprise();
  }, 3800);
}

// ===== STEP 4 — SURPRISE =====
function startSurprise() {
  spawnConfetti();
  initSurpriseCanvas();
}

function spawnConfetti() {
  const container = document.getElementById('confetti');
  const colors = ['#e8a0b4', '#f5d680', '#c96a8a', '#ffffff', '#8b3a62', '#ffd700'];

  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      const size = Math.random() * 8 + 4;
      el.style.cssText = `
        left: ${Math.random() * 100}%;
        top: 0;
        width: ${size}px;
        height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
        animation-delay: 0s;
        opacity: 0.9;
      `;
      container.appendChild(el);
      setTimeout(() => el.remove(), 6000);
    }, i * 60);
  }
}

function initSurpriseCanvas() {
  const canvas = document.getElementById('surprise-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  let stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    makeStars();
  }

  function makeStars() {
    stars = [];
    const count = Math.floor((W * H) / 6000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random(),
        da: (Math.random() - 0.5) * 0.006
      });
    }
  }

  function draw() {
    if (!document.getElementById('surprise-page').classList.contains('active')) {
      requestAnimationFrame(draw);
      return;
    }
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.a += s.da;
      if (s.a <= 0 || s.a >= 1) s.da *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,214,128,${s.a * 0.6})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
  showPage('countdown-page');

  // For testing: add ?skip=login or ?skip=loader or ?skip=surprise to URL
  const params = new URLSearchParams(window.location.search);
  const skip = params.get('skip');
  if (skip === 'login') {
    setTimeout(() => showPage('login-page'), 300);
  } else if (skip === 'loader') {
    setTimeout(() => { showPage('loader-page'); startLoader(); }, 300);
  } else if (skip === 'surprise') {
    setTimeout(() => { showPage('surprise-page'); startSurprise(); }, 300);
  }
});