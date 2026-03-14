/* ══════════════════════════════════════════
   PYTHON RUNNERS — émulation JS native
══════════════════════════════════════════ */
const ALGOS = {
  'py-seuil-enonce'() {
    // Le code contient des '...' donc on signale à l'élève
    const code = document.getElementById('py-seuil-enonce').value;
    if (code.includes('...')) {
      throw new Error("Le code contient des '...' à compléter. Remplacez-les avant d'exécuter !");
    }
    // Exécution sécurisée via Function
    return evalPython(code);
  },
  'py-seuil-corr'() {
    function seuil(e) {
      let g = 0.5, n = 1;
      while (g - 0.4 > e) { g = 0.5 * g + 0.2; n = n + 1; }
      return n;
    }
    const lines = [];
    for (const e of [0.1, 0.01, 0.001, 0.0001]) {
      lines.push('e = ' + e + ' -> premier rang n = ' + seuil(e));
    }
    return lines.join('\n');
  }
};

function evalPython(code) {
  // Émulation Python basique : remplace print() et exécute le JS équivalent
  const lines = [];
  const printFn = (...args) => lines.push(args.join(' '));
  // Convertit print(...) en appels JS
  let jsCode = code
    .replace(/\bprint\s*\(([\s\S]*?)\)/g, (_, args) => `__print__(${args})`)
    .replace(/\b(\d+\.\d+)\s*\*\*\s*(\d+)/g, 'Math.pow($1,$2)')
    .replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false')
    .replace(/\bNone\b/g, 'null');
  try {
    Function('__print__', jsCode)(printFn);
  } catch(e) {
    throw new Error(e.message);
  }
  return lines.join('\n') || '(aucune sortie)';
}

function runCode(editorId, outputId) {
  const out = document.getElementById(outputId);
  const code = document.getElementById(editorId).value;
  out.className = 'console';
  try {
    if (ALGOS[editorId]) {
      out.textContent = ALGOS[editorId]();
    } else {
      // Tentative d'évaluation générique
      if (code.includes('...')) throw new Error("Code incomplet : remplacez les '...' avant d'exécuter.");
      out.textContent = evalPython(code);
    }
  } catch(e) {
    out.className = 'console err';
    out.textContent = '⚠ Erreur : ' + e.message;
  }
}

function dlCode(editorId, filename) {
  const code = document.getElementById(editorId).value;
  const b = new Blob([code], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = filename || editorId + '.py';
  a.click();
  URL.revokeObjectURL(a.href);
}


function toggleCorr(id) {
  const box = document.getElementById(id);
  const btn = box.previousElementSibling;
  const isOpen = box.classList.contains('visible');
  box.classList.toggle('visible', !isOpen);
  btn.classList.toggle('open', !isOpen);
  btn.querySelector('.arrow').textContent = isOpen ? '▶' : '▼';
  btn.childNodes[1].textContent = isOpen ? ' Voir la correction complète' : ' Masquer la correction';
  if (!isOpen) {
    setTimeout(() => box.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
    setTimeout(() => {
      if (window.renderMathInElement) renderMathInElement(box, {
        delimiters: [{left:'\\(',right:'\\)',display:false},{left:'\\[',right:'\\]',display:true}]
      });
      if (id === 'c4') drawCanvasU();
    }, 80);
  }
}

/* ══════════════════════════════════════════
   DESSIN UTILS
══════════════════════════════════════════ */
const colors = { gold: '#b8860b', blue: '#2c6e8a', green: '#2d7a4e', red: '#c0392b', ink: '#1a1714' };

function drawDots(canvas, terms, color, label = '', limitLine = null) {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth || 700;
  const H = canvas.clientHeight || 200;
  canvas.width = W * dpr; canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);
  const pad = { l: 50, r: 20, t: 20, b: 35 };
  const n = terms.length;
  const minV = Math.min(...terms.filter(isFinite));
  const maxV = Math.max(...terms.filter(isFinite));
  const ll = limitLine !== null ? limitLine : null;
  const lo = ll !== null ? Math.min(minV, ll) : minV;
  const hi = ll !== null ? Math.max(maxV, ll) : maxV;
  const span = (hi - lo) || 1;
  const sx = (W - pad.l - pad.r) / (n - 1 || 1);
  const sy = (H - pad.t - pad.b) / span;
  const tx = i => pad.l + i * sx;
  const ty = v => pad.t + (hi - v) * sy;

  // grid
  ctx.strokeStyle = '#e8e2d8'; ctx.lineWidth = 1;
  for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.moveTo(tx(i), pad.t); ctx.lineTo(tx(i), H - pad.b); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, H - pad.b); ctx.lineTo(W - pad.r, H - pad.b); ctx.stroke();

  // limit line
  if (ll !== null) {
    ctx.strokeStyle = colors.red + '88'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(pad.l, ty(ll)); ctx.lineTo(W - pad.r, ty(ll)); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = colors.red; ctx.font = '11px JetBrains Mono,monospace'; ctx.textAlign = 'left';
    ctx.fillText('→ ' + ll, W - pad.r - 60, ty(ll) - 5);
  }

  // connecting line
  ctx.strokeStyle = color + '55'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 2]);
  ctx.beginPath();
  terms.forEach((v, i) => { if (isFinite(v)) { i === 0 ? ctx.moveTo(tx(i), ty(v)) : ctx.lineTo(tx(i), ty(v)); } });
  ctx.stroke(); ctx.setLineDash([]);

  // dots
  terms.forEach((v, i) => {
    if (!isFinite(v)) return;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(tx(i), ty(v), 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#a09880'; ctx.font = '10px JetBrains Mono,monospace'; ctx.textAlign = 'center';
    if (n <= 20) ctx.fillText('n='+(i+1 > 1 ? i : i), tx(i), H - pad.b + 16);
  });

  // y axis labels
  ctx.fillStyle = '#7a7060'; ctx.font = '10px JetBrains Mono,monospace'; ctx.textAlign = 'right';
  [lo, (lo + hi) / 2, hi].forEach(v => ctx.fillText((+v.toFixed(3)).toString(), pad.l - 4, ty(v) + 4));

  // label
  if (label) {
    ctx.fillStyle = color; ctx.font = 'bold 12px Outfit,sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(label, pad.l + 8, pad.t + 16);
  }
}

/* ══════════════════════════════════════════
   EXERCICE 1 — suite u_n
══════════════════════════════════════════ */
function computeU(u0, nMax) {
  const terms = [u0];
  let u = u0;
  for (let i = 1; i < nMax; i++) {
    u = -0.5 * u * u + 3 * u - 1.5;
    if (!isFinite(u) || Math.abs(u) > 1e9) break;
    terms.push(u);
  }
  return terms;
}

function drawCanvasU() {
  const t = computeU(2, 8);
  drawDots(document.getElementById('canvas-u'), t, colors.blue, '(u_n)', 3);
}

function drawU() {
  const u0 = parseFloat(document.getElementById('u0-val').value) || 2;
  const n = parseInt(document.getElementById('u-n').value) || 12;
  const terms = computeU(u0, n);
  drawDots(document.getElementById('canvas-u-tool'), terms, colors.blue, '(u_n) — limite 3', 3);
  const last = terms[terms.length - 1];
  document.getElementById('u-result').textContent =
    'u_' + (terms.length - 1) + ' ≈ ' + last.toFixed(6) + '  |  Écart à 3 : ' + Math.abs(last - 3).toFixed(8);
}

/* ══════════════════════════════════════════
   EXERCICE 2 — suite g_n
══════════════════════════════════════════ */
function computeG(n) {
  const terms = [];
  for (let k = 1; k <= n; k++) {
    terms.push(0.1 * Math.pow(0.5, k - 1) + 0.4);
  }
  return terms;
}

function drawG() {
  const n = parseInt(document.getElementById('g-n').value) || 15;
  const terms = computeG(n);
  drawDots(document.getElementById('canvas-g'), terms, colors.green, '(g_n) — limite 0.4', 0.4);
  document.getElementById('g-result').textContent =
    'g_' + n + ' ≈ ' + terms[terms.length - 1].toFixed(6) + '  |  Écart à 0,4 : ' + (terms[terms.length - 1] - 0.4).toExponential(3);
}

function calcSeuil() {
  const e = parseFloat(document.getElementById('g-e').value) || 0.001;
  let g = 0.5, n = 1;
  while (g - 0.4 > e) { g = 0.5 * g + 0.2; n++; }
  document.getElementById('g-result').textContent =
    'Pour e = ' + e + ' : premier rang n = ' + n + '  (g_' + n + ' ≈ ' + g.toFixed(6) + ')';
}

/* ══════════════════════════════════════════
   NAV SCROLL SPY
══════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const s4 = document.getElementById('exo4');
  const s1 = document.getElementById('exo1');
  const mid = window.innerHeight / 2;
  const in4 = s4.getBoundingClientRect().top < mid && s4.getBoundingClientRect().bottom > 0;
  document.getElementById('nav-4').classList.toggle('active', in4);
  document.getElementById('nav-1').classList.toggle('active', !in4);
}, { passive: true });

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
window.addEventListener('load', () => {
  drawU();
  drawG();
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt); rt = setTimeout(() => { drawU(); drawG(); if (document.getElementById('canvas-u').offsetParent) drawCanvasU(); }, 200);
  });
});