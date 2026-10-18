// ===== Config =====
const CODE_LINES = [
  { text: 'public class KishoreSaravanan implements ', accent: 'kw' },
  { text: 'FullstackDeveloper', accent: 'type' },
  { text: ' {', accent: 'plain' },
];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SOURCE = [
  { kw: 'public class ', name: 'KishoreSaravanan', mid: ' implements ', type: 'FullStackDeveloper', tail: ' {' },
  { indent: true, kw: 'private String ', name: 'role', mid: '   = ', str: '"Aspiring Java Fullstack Developer"', tail: ';' },
  { indent: true, kw: 'private String ', name: 'base', mid: '   = ', str: '"Coimbatore, Tamil Nadu"', tail: ';' },
  { indent: true, kw: 'private double ', name: 'cgpa', mid: '   = ', num: '8.1', tail: ';' },
  { indent: true, kw: 'private String[] ', name: 'core', mid: ' = ', str: '{"Java", "OOP", "Java 8+", "DBMS"}', tail: ';' },
  { indent: true, kw: 'private String[] ', name: 'learning', mid: ' = ', str: '{"Spring","Spring Boot","Spring MVC", "REST APIs","SOAP", "JPA", "Hibernate","Maven"}', tail: ';' },
  { blank: true },
  { indent: true, kw: 'public static void ', name: 'main', mid: '(', type: 'String[] args', tail: ') {' },
  { indent: 2, kw: 'System.out.', name: 'println', mid: '(', str: '"Building real things, one class at a time."', tail: ');' },
  { indent: true, tail: '}' },
  { tail: '}' },
];

function lineToHTML(line){
  if(line.blank) return '';
  let indent = '';
  if(line.indent === true) indent = '    ';
  if(line.indent === 2) indent = '        ';
  let html = indent;
  if(line.kw) html += `<span class="tok-kw">${line.kw}</span>`;
  if(line.name) html += `<span class="tok-fn">${line.name}</span>`;
  if(line.mid) html += `<span class="tok-plain">${line.mid}</span>`;
  if(line.type) html += `<span class="tok-type">${line.type}</span>`;
  if(line.str) html += `<span class="tok-str">${line.str}</span>`;
  if(line.num) html += `<span class="tok-num">${line.num}</span>`;
  if(line.tail) html += `<span class="tok-plain">${line.tail}</span>`;
  return html;
}

function renderStatic(){
  const el = document.getElementById('typedCode');
  if(!el) return;
  el.innerHTML = SOURCE.map(lineToHTML).join('\n');
  const caret = document.getElementById('caret');
  if(caret) caret.style.display = 'none';
}

function typeCode(){
  const el = document.getElementById('typedCode');
  if(!el) return;
  const fullLines = SOURCE.map(lineToHTML);
  let lineIndex = 0;
  let charIndex = 0;
  let currentHTML = '';

  // We type by revealing characters of the plain-text version, then swap in the
  // final highlighted HTML for completed lines to keep tags intact.
  const plainLines = SOURCE.map(l => {
    if(l.blank) return '';
    let indent = l.indent === true ? '    ' : l.indent === 2 ? '        ' : '';
    return indent + (l.kw||'') + (l.name||'') + (l.mid||'') + (l.type||'') + (l.str||'') + (l.num||'') + (l.tail||'');
  });

  function step(){
    if(lineIndex >= plainLines.length){
      el.innerHTML = fullLines.join('\n');
      return;
    }
    const line = plainLines[lineIndex];
    if(charIndex <= line.length){
      const doneLines = fullLines.slice(0, lineIndex).join('\n');
      const partial = line.slice(0, charIndex);
      el.textContent = ''; // reset, then build mixed content
      el.innerHTML = (doneLines ? doneLines + '\n' : '') + escapeHTML(partial);
      charIndex++;
      setTimeout(step, 10 + Math.random() * 18);
    } else {
      lineIndex++;
      charIndex = 0;
      setTimeout(step, 70);
    }
  }
  step();
}

function escapeHTML(str){
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ===== Nav: active tab on scroll =====
function setupActiveTab(){
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const sections = tabs.map(t => document.querySelector(t.getAttribute('href')));
  if(!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const id = '#' + entry.target.id;
        tabs.forEach(t => t.classList.toggle('active', t.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => { if(s) observer.observe(s); });
}

// ===== Mobile menu =====
function setupMobileMenu(){
  const btn = document.getElementById('menuBtn');
  const tabs = document.getElementById('tabs');
  if(!btn || !tabs) return;
  btn.addEventListener('click', () => {
    const open = tabs.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  tabs.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => {
      tabs.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== Scroll reveal =====
function setupReveal(){
  const targets = document.querySelectorAll('.stat-card, .file-card, .contact-card, .cert-block, .log-entry, .skill-group, .cert-card, .resume-card');
  targets.forEach(t => t.classList.add('reveal'));
  if(!('IntersectionObserver' in window) || prefersReducedMotion){
    targets.forEach(t => t.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(t => io.observe(t));
}

// ===== Bubble collision sim (canvas, with sparks on impact) =====
function setupBubbleCanvas(){
  const canvas = document.getElementById('bubbleCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);

  function resize(){
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const N = window.innerWidth < 640 ? 14 : 24;
  const bubbles = [];
  for(let i = 0; i < N; i++){
    const r = 9 + Math.random() * 24;
    bubbles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
    });
  }

  let sparks = [];
  function spawnSparks(x, y, n){
    for(let i = 0; i < n; i++){
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 2.4;
      sparks.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.025 + Math.random() * 0.02,
      });
    }
  }

  // Pale yellow in both themes; the light theme uses a slightly deeper tone so bubbles stay visible on white.
  function palette(){
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    return light
      ? { core: 'rgba(252,242,170,0.55)', mid: 'rgba(238,216,112,0.28)', edge: 'rgba(238,216,112,0.04)', stroke: 'rgba(190,165,60,0.40)', spark: [214, 184, 70] }
      : { core: 'rgba(255,249,208,0.42)', mid: 'rgba(241,228,160,0.20)', edge: 'rgba(241,228,160,0.03)', stroke: 'rgba(241,228,160,0.30)', spark: [255, 245, 190] };
  }
  let pal = palette();

  function drawBubble(b){
    const g = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.1, b.x, b.y, b.r);
    g.addColorStop(0, pal.core);
    g.addColorStop(0.55, pal.mid);
    g.addColorStop(1, pal.edge);
    ctx.beginPath();
    ctx.fillStyle = g;
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = pal.stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawSpark(s){
    const [r, g, bl] = pal.spark;
    ctx.beginPath();
    ctx.fillStyle = `rgba(${r},${g},${bl},${s.life})`;
    ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Re-read colours when the theme changes (the static reduced-motion frame is redrawn too).
  window.addEventListener('ks-theme-change', () => {
    pal = palette();
    if(prefersReducedMotion){ ctx.clearRect(0, 0, W, H); for(const b of bubbles) drawBubble(b); }
  });

  function tick(){
    ctx.clearRect(0, 0, W, H);

    // move + wall bounce
    for(const b of bubbles){
      b.x += b.vx;
      b.y += b.vy;
      if(b.x - b.r < 0){ b.x = b.r; b.vx *= -1; }
      if(b.x + b.r > W){ b.x = W - b.r; b.vx *= -1; }
      if(b.y - b.r < 0){ b.y = b.r; b.vy *= -1; }
      if(b.y + b.r > H){ b.y = H - b.r; b.vy *= -1; }
    }

    // pairwise collisions
    for(let i = 0; i < bubbles.length; i++){
      for(let j = i + 1; j < bubbles.length; j++){
        const a = bubbles[i], b = bubbles[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const minDist = a.r + b.r;
        if(dist < minDist){
          const nx = dx / dist, ny = dy / dist;
          const overlap = (minDist - dist) / 2;
          a.x -= nx * overlap; a.y -= ny * overlap;
          b.x += nx * overlap; b.y += ny * overlap;

          const avn = a.vx * nx + a.vy * ny;
          const bvn = b.vx * nx + b.vy * ny;
          const diff = bvn - avn;
          a.vx += diff * nx; a.vy += diff * ny;
          b.vx -= diff * nx; b.vy -= diff * ny;

          spawnSparks((a.x + b.x) / 2, (a.y + b.y) / 2, 7);
        }
      }
    }

    for(const b of bubbles) drawBubble(b);

    for(const s of sparks){
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.015;
      s.life -= s.decay;
    }
    sparks = sparks.filter(s => s.life > 0);
    for(const s of sparks) drawSpark(s);

    requestAnimationFrame(tick);
  }

  if(prefersReducedMotion){
    for(const b of bubbles) drawBubble(b);
  } else {
    tick();
  }
}

// ===== Preloader: types "Kishore Saravanan" then reveals the page =====
function setupPreloader(){
  const el = document.getElementById('preloader');
  const nameEl = document.getElementById('preloaderName');
  if(!el || !nameEl) return;

  const FULL_NAME = 'Kishore Saravanan';

  function dismiss(){
    el.classList.add('hide');
    setTimeout(() => el.remove(), 600);
  }

  if(prefersReducedMotion){
    nameEl.textContent = FULL_NAME;
    nameEl.style.borderRight = 'none';
    setTimeout(dismiss, 400);
    return;
  }

  let i = 0;
  function typeName(){
    if(i <= FULL_NAME.length){
      nameEl.textContent = FULL_NAME.slice(0, i);
      i++;
      setTimeout(typeName, 45);
    } else {
      setTimeout(dismiss, 500);
    }
  }
  setTimeout(typeName, 350);
}

// ===== Theme toggle (soft dark <-> light), remembered between visits =====
function setupThemeToggle(){
  const btn = document.getElementById('themeToggle');
  if(!btn) return;
  const root = document.documentElement;

  function sync(){
    const light = root.getAttribute('data-theme') === 'light';
    btn.textContent = light ? 'Dark' : 'Light';
    btn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  }
  sync();

  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ks-theme', next); } catch (e) {}
    sync();
    window.dispatchEvent(new Event('ks-theme-change'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupPreloader();
  if(prefersReducedMotion){
    renderStatic();
  } else {
    typeCode();
  }
  setupActiveTab();
  setupMobileMenu();
  setupReveal();
  setupBubbleCanvas();
  setupThemeToggle();
});
