/* ============================================================
   PIZZA PARADISE — Complete JavaScript
   Features: Particles, Kinetic Type, Games (Catcher, Memory,
             Wheel), Pizza Builder, Scroll Reveal, Navbar,
             Gallery Lightbox, Toast Notifications, Confetti
   ============================================================ */

'use strict';

// ─── On DOM Ready ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initKineticHero();
  initParticles();
  initScrollReveal();
  initMenuFilter();
  initPizzaBuilder();
  initGameTabs();
  initCatcherGame();
  initMemoryGame();
  initSpinWheel();
  initGallery();
  initContactForm();
  initCounters();
});

// ════════════════════════════════════════════════════════════
// NAVBAR
// ════════════════════════════════════════════════════════════
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    highlightActiveSection();
  }, { passive: true });

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    mobileNav?.classList.toggle('open');
  });

  // Smooth scroll for all nav links
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        mobileNav?.classList.remove('open');
      }
    });
  });

  // Active section highlighting
  function highlightActiveSection() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }
}

// ════════════════════════════════════════════════════════════
// KINETIC HERO TYPOGRAPHY
// ════════════════════════════════════════════════════════════
function initKineticHero() {
  const titleEl = document.getElementById('hero-title');
  if (!titleEl) return;

  const lines = titleEl.querySelectorAll('[data-kinetic]');
  lines.forEach((line, lineIdx) => {
    const text = line.dataset.kinetic;
    line.innerHTML = '';
    const wrap = document.createElement('span');
    wrap.className = 'kinetic-word';
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'kinetic-letter';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = `${0.5 + lineIdx * 0.4 + i * 0.04}s`;
      wrap.appendChild(span);
    });
    line.appendChild(wrap);
  });
}

// ════════════════════════════════════════════════════════════
// PARTICLE SYSTEM — floating pizza toppings
// ════════════════════════════════════════════════════════════
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];
  const EMOJIS = ['🍕','🧀','🍅','🌿','🫒','🧅','🌶️','🍄','🧄','⭐'];
  const COUNT = 28;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  for (let i = 0; i < COUNT; i++) {
    particles.push(createParticle(true));
  }

  function createParticle(randomY = false) {
    return {
      x:     Math.random() * canvas.width,
      y:     randomY ? Math.random() * canvas.height : canvas.height + 40,
      size:  Math.random() * 18 + 10,
      speed: Math.random() * 0.4 + 0.15,
      drift: (Math.random() - 0.5) * 0.3,
      rot:   Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.01,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      opacity: Math.random() * 0.4 + 0.1,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, 0, 0);
      ctx.restore();

      p.y -= p.speed;
      p.x += p.drift;
      p.rot += p.rotSpeed;

      if (p.y < -40) {
        Object.assign(p, createParticle(false));
        p.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ════════════════════════════════════════════════════════════
// SCROLL REVEAL
// ════════════════════════════════════════════════════════════
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => io.observe(el));
}

// ════════════════════════════════════════════════════════════
// MENU FILTER
// ════════════════════════════════════════════════════════════
function initMenuFilter() {
  const pills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.menu-card');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
        if (show) {
          card.style.animation = 'fadeIn 0.4s ease forwards';
        }
      });
    });
  });

  // Order button toasts
  document.querySelectorAll('.menu-card-order').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.closest('.menu-card').querySelector('.menu-card-name')?.textContent;
      showToast(`🍕 ${name} added to your order!`, 'success');
    });
  });
}

// ════════════════════════════════════════════════════════════
// ANIMATED COUNTERS
// ════════════════════════════════════════════════════════════
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const updateCounters = () => {
    const year = new Date().getFullYear();
    counters.forEach(el => {
      const baseCount = Number(el.dataset.count);
      const yearStart = Number(el.dataset.yearStart);
      const count = Number.isFinite(yearStart)
        ? baseCount + Math.max(0, year - yearStart)
        : baseCount;
      el.textContent = `${count}${el.dataset.suffix || ''}`;
    });

    const now = new Date();
    const nextYear = new Date(now.getFullYear() + 1, 0, 1);
    window.setTimeout(updateCounters, nextYear.getTime() - now.getTime());
  };

  updateCounters();
}

// ════════════════════════════════════════════════════════════
// PIZZA BUILDER
// ════════════════════════════════════════════════════════════
function initPizzaBuilder() {
  const pizzaCanvas = document.getElementById('pizza-canvas');
  const toppingsLayer = document.getElementById('pizza-toppings');
  const priceEl = document.getElementById('builder-price');
  if (!pizzaCanvas) return;

  const bases = {
    thin:   { name: 'Thin Crust',   price: 8,  style: 'radial-gradient(circle at 40% 35%, #e8c840 0%, #c8980a 50%, #8b5a0a 100%)' },
    thick:  { name: 'Thick Crust',  price: 9,  style: 'radial-gradient(circle at 40% 35%, #f0d060 0%, #d4a020 50%, #9a6010 100%)' },
    cheese: { name: 'Cheese Crust', price: 11, style: 'radial-gradient(circle at 40% 35%, #ffe060 0%, #e8b830 50%, #b07820 100%)' },
    gluten: { name: 'GF Crust',     price: 13, style: 'radial-gradient(circle at 40% 35%, #d8c880 0%, #b89850 40%, #806030 100%)' },
  };

  const sauces = {
    tomato:  { name: 'Tomato',   price: 0, overlay: 'radial-gradient(circle at 50% 50%, rgba(200,60,40,0.55) 0%, transparent 70%)' },
    white:   { name: 'White',    price: 1, overlay: 'radial-gradient(circle at 50% 50%, rgba(240,240,200,0.35) 0%, transparent 70%)' },
    pesto:   { name: 'Pesto',    price: 2, overlay: 'radial-gradient(circle at 50% 50%, rgba(60,140,60,0.4) 0%, transparent 70%)' },
    bbq:     { name: 'BBQ',      price: 2, overlay: 'radial-gradient(circle at 50% 50%, rgba(100,40,20,0.5) 0%, transparent 70%)' },
  };

  const toppingOptions = {
    '🧀': { name: 'Mozzarella', price: 2 },
    '🍅': { name: 'Tomatoes',   price: 1 },
    '🌶️': { name: 'Jalapeños',  price: 1.5 },
    '🫒': { name: 'Olives',     price: 1.5 },
    '🍄': { name: 'Mushrooms',  price: 2 },
    '🧅': { name: 'Onions',     price: 1 },
    '🥓': { name: 'Bacon',      price: 3 },
    '🍖': { name: 'Pepperoni',  price: 3 },
    '🧄': { name: 'Garlic',     price: 1 },
    '🫑': { name: 'Peppers',    price: 1.5 },
    '🌿': { name: 'Basil',      price: 1 },
    '🍍': { name: 'Pineapple',  price: 1.5 },
  };

  let state = {
    base: null, sauce: null,
    toppings: new Set(),
    get price() {
      let p = this.base ? bases[this.base].price : 0;
      if (this.sauce && sauces[this.sauce].price) p += sauces[this.sauce].price;
      this.toppings.forEach(t => p += toppingOptions[t].price);
      return p;
    }
  };

  function updateVisual() {
    // Base style
    if (state.base) {
      pizzaCanvas.style.background = bases[state.base].style;
    }
    // Sauce overlay via box-shadow trick using a pseudo element — just update overlay child
    const sauceEl = document.getElementById('pizza-sauce-layer');
    if (sauceEl) {
      sauceEl.style.background = state.sauce ? sauces[state.sauce].overlay : 'transparent';
    }
    // Price
    priceEl.textContent = `$${state.price.toFixed(2)}`;
  }

  function renderToppings() {
    if (!toppingsLayer) return;
    toppingsLayer.innerHTML = '';
    const placed = [];
    state.toppings.forEach(emoji => {
      const count = Math.floor(Math.random() * 3) + 5;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 35 + 8;
        const x = 50 + Math.cos(angle) * r;
        const y = 50 + Math.sin(angle) * r;
        // Avoid overlaps roughly
        const spot = document.createElement('span');
        spot.className = 'topping-dot';
        spot.textContent = emoji;
        spot.style.cssText = `left:${x}%;top:${y}%;font-size:${Math.random()*8+14}px;animation-delay:${Math.random()*0.3}s`;
        toppingsLayer.appendChild(spot);
      }
    });
  }

  // Wire up option buttons
  document.querySelectorAll('[data-base]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-base]').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.base = btn.dataset.base;
      updateVisual();
    });
  });

  document.querySelectorAll('[data-sauce]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-sauce]').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.sauce = btn.dataset.sauce;
      updateVisual();
    });
  });

  document.querySelectorAll('[data-topping]').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.topping;
      if (state.toppings.has(t)) {
        state.toppings.delete(t);
        btn.classList.remove('selected');
      } else {
        if (state.toppings.size >= 8) {
          showToast('Max 8 toppings!', 'error'); return;
        }
        state.toppings.add(t);
        btn.classList.add('selected');
      }
      renderToppings();
      updateVisual();
    });
  });

  // Place order
  document.getElementById('builder-order-btn')?.addEventListener('click', () => {
    if (!state.base) { showToast('Please choose a crust first!', 'error'); return; }
    if (!state.sauce){ showToast('Please choose a sauce!', 'error'); return; }
    launchConfetti();
    showToast(`🎉 Order placed! $${state.price.toFixed(2)}`, 'success');
  });
}

// ════════════════════════════════════════════════════════════
// GAME TABS
// ════════════════════════════════════════════════════════════
function initGameTabs() {
  const tabs = document.querySelectorAll('.game-tab');
  const panels = document.querySelectorAll('.game-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.game)?.classList.add('active');
    });
  });
}

// ════════════════════════════════════════════════════════════
// GAME 1 — TOPPING CATCHER
// ════════════════════════════════════════════════════════════
function initCatcherGame() {
  const gameArea  = document.getElementById('catcher-game-area');
  const panEl     = document.getElementById('catcher-pan');
  const scoreEl   = document.getElementById('catcher-score');
  const timerEl   = document.getElementById('catcher-timer');
  const livesEl   = document.getElementById('catcher-lives');
  const overlay   = document.getElementById('catcher-overlay');
  const startBtn  = document.getElementById('catcher-start');
  const restartBtn= document.getElementById('catcher-restart');
  const finalScore= document.getElementById('catcher-final');
  if (!gameArea) return;

  const GOOD = ['🧀','🍅','🫒','🍄','🌿','🧅','🫑','🧄'];
  const BAD  = ['💀','🤢','❌','⚡'];
  const GAME_DURATION = 30;

  let score = 0, lives = 3, timeLeft = GAME_DURATION;
  let panX = 50, running = false;
  let toppingInterval, timerInterval, accelInterval, animFrame, lastFrameTime = 0;
  let toppings = [];

  function updateLives() {
    if (!livesEl) return;
    livesEl.innerHTML = Array.from({length:3}, (_,i) => `<span>${i < lives ? '❤️' : '🖤'}</span>`).join('');
  }

  function startGame() {
    clearInterval(toppingInterval);
    clearInterval(timerInterval);
    clearInterval(accelInterval);
    score = 0; lives = 3; timeLeft = GAME_DURATION;
    toppings = [];
    running = true;
    lastFrameTime = 0;
    if (scoreEl) scoreEl.textContent = 'SCORE: 0';
    if (timerEl) timerEl.textContent = `⏱ ${GAME_DURATION}s`;
    updateLives();
    overlay && (overlay.style.display = 'none');
    gameArea.querySelectorAll('.falling-topping, .catcher-float').forEach(el => el.remove());
    if (panEl && panEl.parentNode !== gameArea) gameArea.appendChild(panEl);

    gameArea.addEventListener('pointermove', movePan);
    gameArea.addEventListener('pointerdown', movePan);

    // Spawn toppings
    toppingInterval = setInterval(spawnTopping, 800);

    // Timer
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timerEl) timerEl.textContent = `⏱ ${timeLeft}s`;
      if (timeLeft <= 0) endGame();
    }, 1000);

    // Accelerate every 5 seconds
    let speed = 800;
    accelInterval = setInterval(() => {
      if (!running) { clearInterval(accelInterval); return; }
      speed = Math.max(350, speed - 80);
      clearInterval(toppingInterval);
      toppingInterval = setInterval(spawnTopping, speed);
    }, 5000);

    animFrame = requestAnimationFrame(gameLoop);
  }

  function movePan(e) {
    const rect = gameArea.getBoundingClientRect();
    panX = ((e.clientX - rect.left) / rect.width) * 100;
    panX = Math.max(6, Math.min(94, panX));
    panEl.style.left = `${panX}%`;
  }

  function spawnTopping() {
    if (!running) return;
    const areaW = gameArea.clientWidth;
    const isGood = Math.random() > 0.25;
    const emoji = isGood
      ? GOOD[Math.floor(Math.random() * GOOD.length)]
      : BAD[Math.floor(Math.random() * BAD.length)];
    const el = document.createElement('div');
    el.className = `falling-topping${isGood ? '' : ' bad-topping'}`;
    el.textContent = emoji;
    el.dataset.good = isGood;
    el.dataset.speed = (Math.random() * 108 + 72).toFixed(2);
    el.dataset.y = '-40';
    el.dataset.x = String(Math.random() * Math.max(0, areaW - 36) + 3);
    el.style.left = `${el.dataset.x}px`;
    gameArea.appendChild(el);
    toppings.push(el);
  }

  function gameLoop(now) {
    if (!running) return;
    const delta = lastFrameTime ? Math.min(now - lastFrameTime, 50) : 16.67;
    lastFrameTime = now;
    const movement = delta / 1000;
    const areaH = gameArea.offsetHeight;
    const areaW = gameArea.offsetWidth;
    const panTop = areaH - 48;
    const panLeft  = (panX / 100) * areaW - 45;
    const panRight = panLeft + 90;

    toppings = toppings.filter(t => {
      if (!t.parentNode) return false;
      const topNow = Number(t.dataset.y) + Number(t.dataset.speed) * movement;
      t.dataset.y = String(topNow);
      t.style.transform = `translate3d(0, ${topNow}px, 0)`;

      // Check catch
      const tLeft = Number(t.dataset.x);
      const tRight = tLeft + 30;
      const caught = topNow >= panTop - 10 && topNow <= panTop + 30 && tRight > panLeft && tLeft < panRight;

      if (caught) {
        if (t.dataset.good === 'true') {
          score += 10;
          if (scoreEl) scoreEl.textContent = `SCORE: ${score}`;
          showFloatText('+10', tLeft, panTop - 20, '#ff6b35');
        } else {
          lives--;
          updateLives();
          showFloatText('-1 ❤️', tLeft, panTop - 20, '#e63946');
          if (lives <= 0) { t.remove(); endGame(); return false; }
        }
        t.remove();
        return false;
      }
      // Missed
      if (topNow > areaH + 10) {
        if (t.dataset.good === 'true') {
          lives--;
          updateLives();
          if (lives <= 0) { t.remove(); endGame(); return false; }
        }
        t.remove();
        return false;
      }
      return true;
    });

    animFrame = requestAnimationFrame(gameLoop);
  }

  function showFloatText(text, x, y, color) {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.cssText = `position:absolute;left:${x}px;top:${y}px;color:${color};font-family:'Bebas Neue',sans-serif;font-size:1.2rem;pointer-events:none;z-index:20;animation:floatUp 0.8s ease forwards`;
    gameArea.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }

  function endGame() {
    running = false;
    clearInterval(toppingInterval);
    clearInterval(timerInterval);
    clearInterval(accelInterval);
    cancelAnimationFrame(animFrame);
    toppings.forEach(t => t.remove());
    toppings = [];
    gameArea.removeEventListener('pointermove', movePan);
    gameArea.removeEventListener('pointerdown', movePan);
    if (finalScore) finalScore.textContent = score;
    if (overlay) overlay.style.display = 'flex';
    const titleEl = overlay?.querySelector('.catcher-overlay-title');
    if (titleEl) titleEl.textContent = score >= 100 ? '🎉 Pizza Master!' : score >= 50 ? '👍 Nice Catch!' : '😅 Keep Trying!';
    const finalWrap = document.getElementById('catcher-final-wrap');
    if (finalWrap) finalWrap.style.display = 'block';
    startBtn && (startBtn.style.display = 'none');
    if (score >= 150) launchConfetti();
  }

  function resetOverlayForStart() {
    const titleEl = overlay?.querySelector('.catcher-overlay-title');
    if (titleEl) titleEl.textContent = '🧺 Topping Catcher';
    const finalWrap = document.getElementById('catcher-final-wrap');
    if (finalWrap) finalWrap.style.display = 'none';
    if (startBtn) startBtn.style.display = '';
  }

  startBtn?.addEventListener('click', () => { resetOverlayForStart(); startGame(); });
  restartBtn?.addEventListener('click', () => { resetOverlayForStart(); startGame(); });

  // Float text keyframe
  const style = document.createElement('style');
  style.textContent = `@keyframes floatUp { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-40px)} }`;
  document.head.appendChild(style);
}

// ════════════════════════════════════════════════════════════
// GAME 2 — MEMORY MATCH
// ════════════════════════════════════════════════════════════
function initMemoryGame() {
  const grid      = document.getElementById('memory-grid');
  const movesEl   = document.getElementById('memory-moves');
  const timerEl   = document.getElementById('memory-timer');
  const restartBtn= document.getElementById('memory-restart');
  if (!grid) return;

  const EMOJIS = ['🍕','🧀','🍅','🌶️','🫒','🍄','🧅','🥓'];
  let cards = [], flipped = [], matched = 0, moves = 0;
  let timeElapsed = 0, timerInterval = null, canFlip = true;

  function buildGrid() {
    grid.innerHTML = '';
    cards = []; flipped = []; matched = 0; moves = 0; timeElapsed = 0; canFlip = true;
    if (movesEl) movesEl.textContent = 'Moves: 0';
    if (timerEl) timerEl.textContent = '⏱ 0s';
    clearInterval(timerInterval);

    const deck = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);

    deck.forEach((emoji, i) => {
      const card = document.createElement('div');
      card.className = 'mem-card';
      card.dataset.emoji = emoji;
      card.dataset.index = i;
      card.innerHTML = `
        <div class="mem-card-face mem-card-back">🍕</div>
        <div class="mem-card-face mem-card-front">${emoji}</div>
      `;
      card.addEventListener('click', () => flipCard(card));
      grid.appendChild(card);
      cards.push(card);
    });
  }

  function flipCard(card) {
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (flipped.length === 0 && timeElapsed === 0) startTimer();

    card.classList.add('flipped');
    flipped.push(card);

    if (flipped.length === 2) {
      moves++;
      if (movesEl) movesEl.textContent = `Moves: ${moves}`;
      canFlip = false;
      const [a, b] = flipped;
      if (a.dataset.emoji === b.dataset.emoji) {
        a.classList.add('matched');
        b.classList.add('matched');
        matched++;
        flipped = [];
        canFlip = true;
        if (matched === EMOJIS.length) {
          clearInterval(timerInterval);
          setTimeout(() => {
            launchConfetti();
            showToast(`🏆 Completed in ${moves} moves & ${timeElapsed}s!`, 'success');
          }, 400);
        }
      } else {
        setTimeout(() => {
          a.classList.remove('flipped');
          b.classList.remove('flipped');
          flipped = [];
          canFlip = true;
        }, 900);
      }
    }
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      timeElapsed++;
      if (timerEl) timerEl.textContent = `⏱ ${timeElapsed}s`;
    }, 1000);
  }

  restartBtn?.addEventListener('click', buildGrid);
  buildGrid();
}

// ════════════════════════════════════════════════════════════
// GAME 3 — SPIN THE WHEEL
// ════════════════════════════════════════════════════════════
function initSpinWheel() {
  const canvas = document.getElementById('wheel-canvas');
  const spinBtn = document.getElementById('spin-btn');
  const resultEl = document.getElementById('wheel-result');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const SLICES = [
    { label: 'Margherita', emoji: '🍅', color: '#e63946' },
    { label: 'Pepperoni',  emoji: '🍖', color: '#ff6b35' },
    { label: 'BBQ Chicken',emoji: '🍗', color: '#c47a15' },
    { label: 'Veggie',     emoji: '🥦', color: '#2d6a4f' },
    { label: '4 Cheese',   emoji: '🧀', color: '#f4a261' },
    { label: 'Hawaiian',   emoji: '🍍', color: '#e9c46a' },
    { label: 'Spicy Hell', emoji: '🌶️', color: '#9b2226' },
    { label: 'Truffle',    emoji: '🍄', color: '#6b4226' },
  ];

  const W = canvas.width, H = canvas.height;
  const CX = W / 2, CY = H / 2;
  const R = CX - 8;
  const ARC = (Math.PI * 2) / SLICES.length;

  let currentAngle = 0, spinning = false;

  function drawWheel(angle) {
    ctx.clearRect(0, 0, W, H);
    SLICES.forEach((slice, i) => {
      const startAngle = angle + i * ARC;
      const endAngle   = startAngle + ARC;

      // Slice fill
      ctx.beginPath();
      ctx.moveTo(CX, CY);
      ctx.arc(CX, CY, R, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();

      // Border
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Emoji
      ctx.save();
      ctx.translate(CX, CY);
      ctx.rotate(startAngle + ARC / 2);
      ctx.textAlign = 'right';
      ctx.font = '22px serif';
      ctx.fillText(slice.emoji, R - 14, 7);
      ctx.restore();

      // Label
      ctx.save();
      ctx.translate(CX, CY);
      ctx.rotate(startAngle + ARC / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = `bold 11px Inter, sans-serif`;
      ctx.fillText(slice.label, R - 42, 7);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(CX, CY, 26, 0, Math.PI * 2);
    ctx.fillStyle = '#0d0500';
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.stroke();
    // Center emoji
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🍕', CX, CY);
  }

  function spin() {
    if (spinning) return;
    spinning = true;
    if (resultEl) resultEl.textContent = 'Spinning…';
    const totalRotation = Math.PI * 2 * (8 + Math.random() * 8);
    const duration = 4000 + Math.random() * 2000;
    const start = performance.now();
    const startAngle = currentAngle;

    function frame(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quintic
      const eased = 1 - Math.pow(1 - progress, 5);
      currentAngle = startAngle + totalRotation * eased;
      drawWheel(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        spinning = false;
        // Determine result — pointer is at top (−π/2)
        const norm = ((currentAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const pointerAngle = (Math.PI * 2 * 2 - norm + Math.PI * 1.5) % (Math.PI * 2);
        const idx = Math.floor(pointerAngle / ARC) % SLICES.length;
        const winner = SLICES[idx];
        if (resultEl) resultEl.textContent = `${winner.emoji} Your lucky pizza: ${winner.label}! ${winner.emoji}`;
        showToast(`${winner.emoji} ${winner.label} — great choice!`, 'success');
      }
    }
    requestAnimationFrame(frame);
  }

  spinBtn?.addEventListener('click', spin);
  canvas.addEventListener('click', spin);
  drawWheel(0);
}

// ════════════════════════════════════════════════════════════
// GALLERY LIGHTBOX
// ════════════════════════════════════════════════════════════
function initGallery() {
  const items   = document.querySelectorAll('.gallery-item');
  const lightbox= document.getElementById('lightbox');
  const lbImg   = document.getElementById('lightbox-img');
  const lbClose = document.getElementById('lightbox-close');
  if (!lightbox) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img || !lbImg) return;
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lbClose?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

// ════════════════════════════════════════════════════════════
// CONTACT FORM
// ════════════════════════════════════════════════════════════
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.querySelector('#contact-name')?.value.trim();
    if (!name) { showToast('Please enter your name!', 'error'); return; }
    showToast(`Thanks, ${name}! We'll reach out soon 🍕`, 'success');
    form.reset();
  });

  // Newsletter
  document.getElementById('newsletter-form')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('🎉 Subscribed! Enjoy 10% off your first order!', 'success');
    e.target.reset();
  });
}

// ════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ════════════════════════════════════════════════════════════
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// ════════════════════════════════════════════════════════════
// CONFETTI
// ════════════════════════════════════════════════════════════
function launchConfetti() {
  const colors = ['#ff6b35','#ffd700','#e63946','#ff9f1c','#ffffff','#fef3e2'];
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        left: ${Math.random() * 100}vw;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        width: ${Math.random() * 10 + 6}px;
        height: ${Math.random() * 10 + 6}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${Math.random() * 2 + 2}s;
        animation-delay: ${Math.random() * 0.5}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }, i * 18);
  }
}

// ════════════════════════════════════════════════════════════
// TOASTING THE CATCHER CSS STYLE HELPER
// ════════════════════════════════════════════════════════════
// (Toast out animation)
const toastOutStyle = document.createElement('style');
toastOutStyle.textContent = `
  @keyframes toastOut {
    from { transform: translateX(0); opacity: 1; }
    to   { transform: translateX(120%); opacity: 0; }
  }
`;
document.head.appendChild(toastOutStyle);
