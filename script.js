// JavaScript Logic for Pizza Paradise

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initMenuFilters();
  initPizzaBuilder();
  initMinigames();
  initScrollSpy();
});

/* 1. HERO PARTICLES SYSTEM */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const colors = ['#ff6b35', '#ffd700', '#e63946', '#ffffff'];

  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 4 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.8,
      vy: -Math.random() * 1.5 - 0.2,
      opacity: Math.random() * 0.7 + 0.3
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < 0) {
        p.y = canvas.height;
        p.x = Math.random() * canvas.width;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* 2. MENU FILTER SYSTEM */
function initMenuFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      menuCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 3. PIZZA BUILDER LOGIC */
function initPizzaBuilder() {
  const checkboxes = document.querySelectorAll('.topping-checkbox');
  const basePriceEl = document.getElementById('total-price');
  const toppingLayer = document.getElementById('topping-layer');
  const basePrice = 14.99;

  function updatePizza() {
    let total = basePrice;
    let selectedToppings = [];

    checkboxes.forEach(cb => {
      if (cb.checked) {
        total += parseFloat(cb.dataset.price);
        selectedToppings.push(cb.value);
      }
    });

    if (basePriceEl) basePriceEl.textContent = `$${total.toFixed(2)}`;

    // Render simple visual representations
    if (toppingLayer) {
      toppingLayer.innerHTML = '';
      selectedToppings.forEach(t => {
        const span = document.createElement('span');
        span.style.position = 'absolute';
        span.style.left = `${Math.random() * 60 + 20}%`;
        span.style.top = `${Math.random() * 60 + 20}%`;
        span.style.fontSize = '1.8rem';
        span.textContent = getToppingEmoji(t);
        toppingLayer.appendChild(span);
      });
    }
  }

  function getToppingEmoji(type) {
    const map = {
      pepperoni: '🍕',
      mushrooms: '🍄',
      olives: '🫒',
      basil: '🌿',
      onions: '🧅',
      extraCheese: '🧀'
    };
    return map[type] || '✨';
  }

  checkboxes.forEach(cb => cb.addEventListener('change', updatePizza));
}

/* 4. MINIGAMES LOGIC */
function initMinigames() {
  // Tab Switcher
  const gameTabs = document.querySelectorAll('.game-tab-btn');
  const gameBoxes = document.querySelectorAll('.game-box');

  gameTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      gameTabs.forEach(t => t.classList.remove('active'));
      gameBoxes.forEach(b => b.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.game).classList.add('active');
    });
  });

  // Game 1: Topping Catcher
  initCatcherGame();

  // Game 2: Memory Match
  initMemoryGame();

  // Game 3: Spin Wheel
  initWheelGame();
}

/* GAME 1: CATCHER GAME */
function initCatcherGame() {
  const canvas = document.getElementById('catcher-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('start-catcher');
  const scoreEl = document.getElementById('catcher-score');

  let score = 0;
  let gameRunning = false;
  let basketX = 175;
  const basketWidth = 70;
  let toppings = [];

  function spawnTopping() {
    const emojis = ['🍄', '🫒', '🧀', '🌿'];
    toppings.push({
      x: Math.random() * (canvas.width - 30),
      y: 0,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      speed: Math.random() * 2 + 2
    });
  }

  function update() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Crust Basket
    ctx.fillStyle = '#ff6b35';
    ctx.fillRect(basketX, canvas.height - 20, basketWidth, 15);

    // Update Toppings
    for (let i = toppings.length - 1; i >= 0; i--) {
      const t = toppings[i];
      t.y += t.speed;

      ctx.font = '24px serif';
      ctx.fillText(t.emoji, t.x, t.y);

      // Check collision
      if (t.y >= canvas.height - 30 && t.x >= basketX - 10 && t.x <= basketX + basketWidth) {
        score += 10;
        scoreEl.textContent = score;
        toppings.splice(i, 1);
        continue;
      }

      if (t.y > canvas.height) {
        toppings.splice(i, 1);
      }
    }

    if (Math.random() < 0.04) spawnTopping();
    requestAnimationFrame(update);
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    basketX = e.clientX - rect.left - basketWidth / 2;
  });

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      score = 0;
      scoreEl.textContent = score;
      toppings = [];
      gameRunning = true;
      update();
    });
  }
}

/* GAME 2: MEMORY GAME */
function initMemoryGame() {
  const grid = document.getElementById('memory-grid');
  if (!grid) return;
  const emojis = ['🍕', '🍕', '🧀', '🧀', '🍄', '🍄', '🌿', '🌿'];
  let flipped = [];
  let matchedCount = 0;

  emojis.sort(() => 0.5 - Math.random());
  grid.innerHTML = '';

  emojis.forEach((emoji, idx) => {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.dataset.emoji = emoji;
    card.dataset.index = idx;
    card.textContent = '❓';

    card.addEventListener('click', () => {
      if (flipped.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        card.textContent = emoji;
        flipped.push(card);

        if (flipped.length === 2) {
          if (flipped[0].dataset.emoji === flipped[1].dataset.emoji) {
            matchedCount += 2;
            flipped = [];
            if (matchedCount === emojis.length) {
              alert('🎉 You won a FREE Garlic Dip!');
            }
          } else {
            setTimeout(() => {
              flipped.forEach(c => {
                c.classList.remove('flipped');
                c.textContent = '❓';
              });
              flipped = [];
            }, 800);
          }
        }
      }
    });
    grid.appendChild(card);
  });
}

/* GAME 3: SPIN WHEEL */
function initWheelGame() {
  const wheel = document.getElementById('wheel');
  const spinBtn = document.getElementById('spin-btn');
  const resultEl = document.getElementById('wheel-result');
  if (!wheel || !spinBtn) return;

  let currentDegree = 0;

  spinBtn.addEventListener('click', () => {
    const randomSpin = Math.floor(Math.random() * 360) + 1440;
    currentDegree += randomSpin;
    wheel.style.transform = `rotate(${currentDegree}deg)`;

    setTimeout(() => {
      const prizes = ['10% OFF', 'Free Drink', '20% OFF', 'Free Crust', 'Free Cookie', 'Try Again'];
      const prizeIndex = Math.floor(Math.random() * prizes.length);
      resultEl.textContent = `🎉 You Won: ${prizes[prizeIndex]}!`;
    }, 4000);
  });
}

/* 5. SCROLLSPY */
function initScrollSpy() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
