/* ══════════════════════════════════════════════════════════════
   PARAMÈTRES ALÉATOIRES — générés une fois par session
   ══════════════════════════════════════════════════════════════ */

/* ── Exercice 1 : suite trinôme ─────────────────────────────
 * u_{n+1} = −½u² + p·u + p(2−p)/2   (point fixe p, v_n = u_n−p)
 * v_{n+1} = −½v²_n  →  forme close u_n = p − 1/2^(2^n−1)
 * p ∈ {3,4,5,6},  u0 = p−1
 */
function genParamsU() {
  const p   = [3,4,5,6][Math.floor(Math.random()*4)];
  const u0  = p - 1;
  const cste = p - p*p/2;
  return { p, u0, cste };
}

/* ── Exercice 2 : probabilités (suite affine) ───────────────
 * g_{n+1} = r·g_n + pDG,  r = pGG−pDG,  l = pDG/(1−r)
 */
function genParamsG() {
  const combos = [];
  for (const pGG of [0.6,0.7,0.8]) {
    for (const pDG of [0.1,0.2,0.3]) {
      const r = +(pGG-pDG).toFixed(2);
      if (r<=0||r>=1) continue;
      const l = +(pDG/(1-r)).toFixed(4);
      if (l>=0.5) continue;
      combos.push({ pGG, pDG, r, l, pGD:+(1-pGG).toFixed(2), pDD:+(1-pDG).toFixed(2) });
    }
  }
  const c = combos[Math.floor(Math.random()*combos.length)];
  const g1=0.5, v1=+(g1-c.l).toFixed(4);
  return { ...c, g1, v1 };
}

/* ── Exercice 3 : suite homographique ───────────────────────
 * u_{n+1} = (a·u+b)/(c·u+d)   deux pts fixes α,β
 * v_n = (u_n−α)/(u_n−β) géométrique de raison r ∈ (0,1)
 * forme close : u_n = (α − β·v0·r^n)/(1 − v0·r^n)
 *
 * Catalogue de combos propres (α,β,r,a,b,c,d,u0) pré-calculés
 */
const HOMO_COMBOS = [
  // α, β, rNum, rDen, a, b, c, d, u0
  { alpha:1, beta:-1, rNum:1, rDen:2, a:3,  b:1,  c:1,  d:3,  u0:2  },
  { alpha:1, beta:-1, rNum:1, rDen:3, a:2,  b:1,  c:1,  d:2,  u0:2  },
  { alpha:1, beta:-2, rNum:1, rDen:2, a:4,  b:2,  c:1,  d:5,  u0:2  },
  { alpha:1, beta:-2, rNum:1, rDen:3, a:5,  b:4,  c:2,  d:7,  u0:2  },
  { alpha:1, beta: 0, rNum:1, rDen:2, a:2,  b:0,  c:1,  d:1,  u0:2  },
  { alpha:1, beta: 0, rNum:1, rDen:3, a:3,  b:0,  c:2,  d:1,  u0:2  },
  { alpha:2, beta:-1, rNum:1, rDen:2, a:5,  b:2,  c:1,  d:4,  u0:3  },
  { alpha:2, beta:-1, rNum:1, rDen:3, a:7,  b:4,  c:2,  d:5,  u0:3  },
  { alpha:2, beta:-2, rNum:1, rDen:3, a:4,  b:4,  c:1,  d:4,  u0:3  },
  { alpha:2, beta: 0, rNum:1, rDen:2, a:4,  b:0,  c:1,  d:2,  u0:3  },
  { alpha:2, beta: 0, rNum:1, rDen:3, a:3,  b:0,  c:1,  d:1,  u0:3  },
  { alpha:3, beta:-1, rNum:1, rDen:2, a:7,  b:3,  c:1,  d:5,  u0:4  },
  { alpha:3, beta:-1, rNum:1, rDen:3, a:5,  b:3,  c:1,  d:3,  u0:4  },
  { alpha:3, beta: 0, rNum:1, rDen:2, a:6,  b:0,  c:1,  d:3,  u0:4  },
  { alpha:3, beta: 0, rNum:1, rDen:3, a:9,  b:0,  c:2,  d:3,  u0:4  },
];

function genParamsH() {
  const h   = HOMO_COMBOS[Math.floor(Math.random()*HOMO_COMBOS.length)];
  const r   = h.rNum / h.rDen;
  const v0  = (h.u0 - h.alpha) / (h.u0 - h.beta);   // rationnel > 0
  // v0 exact en fraction
  const g   = gcd(Math.abs(h.u0-h.alpha), Math.abs(h.u0-h.beta));
  const v0Num = (h.u0-h.alpha)/g, v0Den = (h.u0-h.beta)/g;
  return { ...h, r, v0, v0Num, v0Den };
}

// ── Génération unique ─────────────────────────────────────
const P = genParamsU();
const Q = genParamsG();
const H = genParamsH();

/* ── Utilitaires fractions ──────────────────────────────── */
function gcd(a,b){ a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a||1; }
function frac(n,d){ const g=gcd(Math.abs(n),Math.abs(d)); return {num:n/g,den:d/g}; }
function fracStr(n,d){ const f=frac(n,d); return f.den===1?String(f.num):`${f.num}/${f.den}`; }
function fracLatex(n,d){
  const f=frac(n,d);
  if(f.den===1) return String(f.num);
  const neg = (f.num<0)!=(f.den<0);
  return (neg?'-':'') + `\\dfrac{${Math.abs(f.num)}}{${Math.abs(f.den)}}`;
}

/* ══════════════════════════════════════════════════════════════
   BUILD EXO 1 — suite trinôme
   ══════════════════════════════════════════════════════════════ */
function buildEnonceU() {
  const { p, u0, cste } = P;
  const cNum = p*(2-p), cDen = 2;
  const csteLatex = cNum%2===0 ? String(cNum/2)
    : (cNum<0 ? `-\\dfrac{${-cNum}}{2}` : `\\dfrac{${cNum}}{2}`);

  document.getElementById('enonce-u-formula').innerHTML =
    `\\[u_0 = ${u0} \\qquad \\text{et} \\qquad u_{n+1} = -\\frac{1}{2}u_n^2 + ${p}u_n ${cNum>=0?'+':''} ${csteLatex}\\]`;

  document.getElementById('enonce-u-vn').innerHTML =
    `On considère la suite \\((v_n)\\) définie par \\(v_n = u_n - ${p}\\).`;

  document.getElementById('enonce-u-vrel').innerHTML =
    `\\(\\displaystyle v_{n+1} = -\\frac{1}{2}v_n^2\\)`;

  document.getElementById('enonce-u-limite').innerHTML =
    `On note \\(l\\) la limite de \\((v_n)\\). On admet que \\(l \\in [-1\\,;\\,0]\\) et que \\(l = -\\tfrac{1}{2}l^2\\). Déterminer la valeur de \\(l\\).`;

  // Correction A.1
  const u1num = -u0*u0 + 2*p*u0 + cNum;
  const u1f   = frac(u1num, 2);
  const u1latex = fracLatex(u1num,2);
  document.getElementById('corr-u1-calc').innerHTML =
    `\\[u_1 = -\\frac{1}{2}(${u0})^2 + ${p}(${u0}) ${cNum>=0?'+':''} ${csteLatex} = \\frac{${-u0*u0} + ${2*p*u0} + ${cNum}}{2} = ${u1latex}\\]`;
  document.getElementById('corr-u1-result').textContent = `u₁ = ${fracStr(u1num,2)}`;

  const u2latex = fracLatex(8*p-1,8);
  document.getElementById('corr-u2-calc').innerHTML =
    `\\[u_2 = ${p} - \\frac{1}{2^3} = ${p} - \\frac{1}{8} = ${u2latex}\\]`;
  document.getElementById('corr-u2-result').textContent = `u₂ = ${fracStr(8*p-1,8)}`;

  const u3 = p - 1/Math.pow(2, Math.pow(2,3)-1);
  const u4 = p - 1/Math.pow(2, Math.pow(2,4)-1);
  document.getElementById('corr-u3').textContent =
    `u₃ ≈ ${u3.toFixed(5)}   ·   u₄ ≈ ${u4.toFixed(5)}`;

  document.getElementById('corr-conjecture').innerHTML =
    `On observe : \\(u_0 = ${u0} < u_1 = ${u1latex} < u_2 = ${u2latex} < u_3 \\approx ${u3.toFixed(3)} < u_4 \\approx ${p}\\).`;
  document.getElementById('corr-conjecture-limit').innerHTML =
    `<strong>Conjecture :</strong> la suite \\((u_n)\\) est <em>croissante</em> et converge vers <em>${p}</em>.`;

  document.getElementById('corr-vn-b1').innerHTML =
    `\\[\\begin{aligned}v_{n+1} &= u_{n+1} - ${p} = -\\tfrac{1}{2}u_n^2 + ${p}u_n ${cNum>=0?'+':''} ${csteLatex} - ${p}\\\\[4pt]&= -\\tfrac{1}{2}(v_n+${p})^2 + ${p}(v_n+${p}) + ${csteLatex} - ${p}\\\\[4pt]&= -\\tfrac{1}{2}v_n^2 - ${p}v_n - \\tfrac{${p*p}}{2} + ${p}v_n + ${p*p} ${cNum>=0?'+':''} ${csteLatex} - ${p}\\\\[4pt]&= -\\tfrac{1}{2}v_n^2\\end{aligned}\\]`;

  document.getElementById('corr-vn-b2b').innerHTML =
    `On suppose \\(-1 \\le v_n \\le 0\\). Alors :<br>
     • \\(-v_n \\ge 0\\) (car \\(v_n \\le 0\\))<br>
     • \\(\\frac{1}{2}v_n + 1 \\ge \\frac{1}{2}(-1)+1 = \\frac{1}{2} > 0\\)<br>
     Donc \\(v_{n+1} - v_n = -v_n\\!\\left(\\tfrac{1}{2}v_n+1\\right) \\ge 0\\).`;

  document.getElementById('corr-vn-limit').innerHTML =
    `On résout \\(l = -\\frac{1}{2}l^2\\) avec \\(l \\in [-1\\,;\\,0]\\) :<br>
     \\[\\frac{1}{2}l^2 + l = 0 \\implies l\\!\\left(\\frac{l}{2}+1\\right) = 0\\]
     Donc \\(l = 0\\) ou \\(l = -2\\). Seul \\(l = 0\\) appartient à \\([-1\\,;\\,0]\\).`;
  document.getElementById('corr-vn-limit-result').textContent = `lim v_n = 0 ⟹ lim u_n = ${p}`;

  document.getElementById('corr-validation').innerHTML =
    `✓ La suite \\((u_n)\\) est bien <strong>croissante</strong>.<br>
     ✓ La suite \\((u_n)\\) converge bien vers <strong>${p}</strong>.<br>
     Les deux conjectures de la Partie A sont <strong>validées</strong>.`;

  document.getElementById('corr-w0').innerHTML =
    `\\(v_0 = u_0 - ${p} = ${u0} - ${p} = -1\\), donc \\(w_0 = \\ln(-v_0) = \\ln(1) = 0\\).`;

  document.getElementById('corr-forme-close-box').innerHTML =
    `\\[\\boxed{u_n = ${p} - \\frac{1}{2^{2^n - 1}}}\\]`;
  document.getElementById('corr-verif-close').innerHTML =
    `• \\(n=0\\) : \\(${p} - \\frac{1}{2^0} = ${p} - 1 = ${u0}\\) ✓<br>
     • \\(n=1\\) : \\(${p} - \\frac{1}{2^1} = ${u1latex}\\) ✓<br>
     • \\(n=2\\) : \\(${p} - \\frac{1}{2^3} = ${u2latex}\\) ✓`;

  const pyClose = `def u_close(n):
    # Forme close : u_n = ${p} - 1 / 2^(2^n - 1)
    return ${p} - 1 / 2 ** (2**n - 1)

def u_rec(n):
    u = ${u0}.0
    for _ in range(n):
        u = -0.5 * u**2 + ${p} * u + ${cste}
    return u

print("n  |  u_close(n)           |  u_rec(n)             |  ecart")
print("-" * 65)
for n in range(5):
    uc = u_close(n)
    ur = u_rec(n)
    print(f"{n}  |  {uc:.10f}       |  {ur:.10f}       |  {abs(uc-ur):.2e}")`;

  document.getElementById('py-close-corr').value = pyClose;
  document.getElementById('py-close').value = pyClose
    .replace('    return ' + p + ' - 1 / 2 ** (2**n - 1)', '    ...')
    .replace('    # Forme close : u_n = ' + p + ' - 1 / 2^(2^n - 1)\n', '    # Forme close : u_n = ' + p + ' - 1 / 2^(2^n - 1)\n');

  ALGOS['py-close-corr'] = function() {
    function u_close(n){ return P.p - 1/Math.pow(2, Math.pow(2,n)-1); }
    function u_rec(n){ let u=P.u0; for(let i=0;i<n;i++) u=-0.5*u*u+P.p*u+P.cste; return u; }
    const lines=['n  |  u_close(n)           |  u_rec(n)             |  ecart','-'.repeat(65)];
    for(let n=0;n<5;n++){
      const uc=u_close(n),ur=u_rec(n);
      lines.push(`${n}  |  ${uc.toFixed(10)}       |  ${ur.toFixed(10)}       |  ${Math.abs(uc-ur).toExponential(2)}`);
    }
    return lines.join('\n');
  };
}

/* ══════════════════════════════════════════════════════════════
   BUILD EXO 2 — probabilités
   ══════════════════════════════════════════════════════════════ */
function buildEnonceG() {
  const { pGG,pDG,pGD,pDD,r,l,g1,v1 } = Q;
  const rStr = r.toFixed(1);
  const lFrac = frac(Math.round(pDG*100), Math.round((1-r)*100));
  const lLatex = lFrac.den===1 ? String(lFrac.num) : `\\frac{${lFrac.num}}{${lFrac.den}}`;
  const lSimple = lFrac.den===1 ? String(lFrac.num) : `${lFrac.num}/${lFrac.den}`;
  const lPct = Math.round(l*100);
  const v1Str = fracStr(Math.round(v1*1000),1000);
  const g2 = +(r*g1+pDG).toFixed(4);
  let n_seuil=1,gs=g1;
  while(gs-l>0.001){ gs=r*gs+pDG; n_seuil++; }

  document.getElementById('enonce-g-pGG').textContent = `${Math.round(pGG*100)} %`;
  document.getElementById('enonce-g-pDG').textContent = `${pDG}`;
  document.getElementById('enonce-g-rec').innerHTML   = `\\[g_{n+1} = ${rStr}\\,g_n + ${pDG}\\]`;
  document.getElementById('enonce-g-vndef').innerHTML =
    `Pour tout \\(n \\ge 1\\), on pose \\(v_n = g_n - ${lLatex}\\).`;
  document.getElementById('enonce-g-seuil').innerHTML =
    `Déterminer par le calcul le plus petit entier \\(n\\) tel que \\(g_n - ${lLatex} \\le 0{,}001\\).`;

  document.getElementById('corr-g-pGD').innerHTML =
    `\\[p_{G_1}(D_2) = 1 - ${pGG} = ${pGD}\\]`;
  document.getElementById('corr-g-pGD-result').textContent = `p_{G₁}(D₂) = ${pGD}`;

  document.getElementById('corr-g-g2').innerHTML =
    `\\[g_2 = ${g1}\\times${pGG} + ${g1}\\times${pDG} = ${(g1*pGG).toFixed(3)} + ${(g1*pDG).toFixed(3)} = ${g2}\\]`;
  document.getElementById('corr-g-g2-result').textContent = `g₂ = ${g2}`;

  document.getElementById('corr-g-rec-proof').innerHTML =
    `\\[g_{n+1} = g_n\\cdot${pGG} + (1-g_n)\\cdot${pDG} = ${pGG}g_n + ${pDG} - ${pDG}g_n = ${rStr}g_n + ${pDG}\\]`;
  document.getElementById('corr-g-rec-result').textContent =
    `g_{n+1} = ${rStr} g_n + ${pDG}  ✓`;

  document.getElementById('corr-g-vn-proof').innerHTML =
    `\\[v_{n+1} = g_{n+1} - ${lLatex} = ${rStr}g_n + ${pDG} - ${lLatex} = ${rStr}(g_n - ${lLatex}) = ${rStr}\\,v_n\\]
     <p>\\((v_n)\\) est géométrique de raison \\(${rStr}\\) et de premier terme \\(v_1 = ${v1Str}\\).</p>`;

  document.getElementById('corr-g-close').innerHTML =
    `\\[g_n = ${v1Str}\\times(${rStr})^{n-1} + ${lLatex}\\]`;
  document.getElementById('corr-g-close-result').textContent =
    `g_n = ${v1Str} × (${rStr})^{n−1} + ${lSimple}`;

  document.getElementById('corr-g-var').innerHTML =
    `\\(v_1 = ${v1Str} > 0\\) donc \\(g_n > ${lLatex}\\) pour tout \\(n\\), d'où \\(${rStr}g_n > ${pDG}\\) et \\(g_{n+1} - g_n = ${pDG} - ${rStr}g_n < 0\\).`;

  document.getElementById('corr-g-lim').innerHTML =
    `Puisque \\(|${rStr}| < 1\\), \\((${rStr})^{n-1}\\to 0\\), donc :\\[\\lim_{n\\to+\\infty}g_n = ${lLatex}\\]`;
  document.getElementById('corr-g-lim-result').textContent = `lim g_n = ${lSimple}`;
  document.getElementById('corr-g-lim-interp').innerHTML =
    `<strong>Interprétation :</strong> à long terme, Léa a une probabilité de <strong>${lPct} %</strong> de gagner une partie.`;

  const logR = Math.log(r), lnVal = Math.log(0.001/v1);
  const nExact = 1 + lnVal/logR;
  document.getElementById('corr-g-seuil-calc').innerHTML =
    `\\[${v1Str}\\times(${rStr})^{n-1} \\le 0{,}001 \\implies (${rStr})^{n-1} \\le ${(0.001/v1).toFixed(4)}\\]
     \\[(n-1)\\ln(${rStr}) \\le \\ln\\!\\left(${(0.001/v1).toFixed(4)}\\right) \\implies n \\ge 1 + \\frac{\\ln(${(0.001/v1).toFixed(4)})}{\\ln(${rStr})} \\approx ${nExact.toFixed(2)}\\]`;
  document.getElementById('corr-g-seuil-result').textContent =
    `Le plus petit entier n est n = ${n_seuil}.`;

  const pySeuilCorr = `def seuil(e):
    g = ${g1}       # g_1
    n = 1
    while g - ${lSimple} > e:
        g = ${rStr} * g + ${pDG}
        n = n + 1
    return n

for e in [0.1, 0.01, 0.001, 0.0001]:
    print("e =", e, "-> premier rang n =", seuil(e))`;

  document.getElementById('py-seuil-corr').value = pySeuilCorr;
  document.getElementById('py-seuil-enonce').value =
`def seuil(e):
    g = ${g1}
    n = 1
    while ...:          # condition a completer
        g = ${rStr} * g + ${pDG}
        n = ...         # increment a completer
    return n

# print(seuil(0.001))`;

  ALGOS['py-seuil-enonce'] = function(){
    const code = document.getElementById('py-seuil-enonce').value;
    if(code.includes('...')) throw new Error("Le code contient des '...' à compléter !");
    return evalPython(code);
  };
  ALGOS['py-seuil-corr'] = function(){
    const lines=[];
    for(const e of [0.1,0.01,0.001,0.0001]){
      let g=Q.g1,n=1;
      while(g-Q.l>e){ g=Q.r*g+Q.pDG; n++; }
      lines.push(`e = ${e} -> premier rang n = ${n}`);
    }
    return lines.join('\n');
  };
  buildTree();
}

/* ── Arbre SVG dynamique ───────────────────────────────────── */
function buildTree() {
  const {pGG,pDG,pGD,pDD,g1} = Q;
  const g1d=+(1-g1).toFixed(2);
  const svg=document.getElementById('tree-svg');
  if(!svg) return;
  svg.innerHTML=`
    <style>.tl{font-family:'Outfit',sans-serif;font-size:13px;fill:#1a1714}.tp{font-family:'JetBrains Mono',monospace;font-size:11px;fill:#2c6e8a}.tg{font-weight:600}.tc-g{fill:#2d7a4e}.tc-d{fill:#c0392b}</style>
    <circle cx="50" cy="130" r="5" fill="#1a1714"/>
    <line x1="55" y1="127" x2="175" y2="72" stroke="#1a1714" stroke-width="1.5"/>
    <text x="100" y="90" class="tp">${g1}</text>
    <text x="180" y="76" class="tl tg tc-g">G₁</text>
    <line x1="55" y1="133" x2="175" y2="188" stroke="#1a1714" stroke-width="1.5"/>
    <text x="100" y="170" class="tp">${g1d}</text>
    <text x="180" y="192" class="tl tg tc-d">D₁</text>
    <line x1="205" y1="72" x2="340" y2="42" stroke="#1a1714" stroke-width="1.5"/>
    <text x="255" y="48" class="tp">${pGG}</text>
    <text x="346" y="46" class="tl tg tc-g">G₂</text>
    <line x1="205" y1="76" x2="340" y2="106" stroke="#1a1714" stroke-width="1.5"/>
    <text x="255" y="100" class="tp">${pGD}</text>
    <text x="346" y="110" class="tl tg tc-d">D₂</text>
    <line x1="205" y1="188" x2="340" y2="158" stroke="#1a1714" stroke-width="1.5"/>
    <text x="255" y="162" class="tp">${pDG}</text>
    <text x="346" y="162" class="tl tg tc-g">G₂</text>
    <line x1="205" y1="192" x2="340" y2="222" stroke="#1a1714" stroke-width="1.5"/>
    <text x="255" y="218" class="tp">${pDD}</text>
    <text x="346" y="226" class="tl tg tc-d">D₂</text>
    <text x="400" y="46"  class="tp" fill="#666">${g1}×${pGG} = ${(g1*pGG).toFixed(3)}</text>
    <text x="400" y="110" class="tp" fill="#666">${g1}×${pGD} = ${(g1*pGD).toFixed(3)}</text>
    <text x="400" y="162" class="tp" fill="#666">${g1d}×${pDG} = ${(g1d*pDG).toFixed(3)}</text>
    <text x="400" y="226" class="tp" fill="#666">${g1d}×${pDD} = ${(g1d*pDD).toFixed(3)}</text>`;
}

/* ══════════════════════════════════════════════════════════════
   BUILD EXO 3 — suite homographique
   ══════════════════════════════════════════════════════════════ */

/**
 * Renvoie un terme LaTeX propre pour "coef · varName" inséré après un signe :
 *   term(3,  'u_n') → '+3u_n'
 *   term(-2, 'u_n') → '-2u_n'
 *   term(0,  'u_n') → ''          (terme nul = omis)
 *   term(3,  '')    → '+3'        (constante)
 *   term(-2, '')    → '-2'
 * Usage dans un numérateur/dénominateur : concaténer les termes.
 */
function term(coef, varName) {
  if (coef === 0) return '';
  const absC  = Math.abs(coef);
  const sign  = coef > 0 ? '+' : '-';
  const coefS = absC === 1 && varName !== '' ? '' : String(absC);
  return `${sign}${coefS}${varName}`;
}

/**
 * Même chose mais pour le PREMIER terme (pas de signe '+' devant).
 */
function termFirst(coef, varName) {
  if (coef === 0) return '0';
  const absC  = Math.abs(coef);
  const sign  = coef < 0 ? '-' : '';
  const coefS = absC === 1 && varName !== '' ? '' : String(absC);
  return `${sign}${coefS}${varName}`;
}

/**
 * Renvoie la représentation LaTeX d'un entier k dans le contexte "u_n − k"
 * c'est-à-dire : si k > 0 → "u_n - k", si k < 0 → "u_n + |k|", si k = 0 → "u_n"
 */
function subLatex(varName, k) {
  if (k === 0)  return varName;
  if (k > 0)    return `${varName} - ${k}`;
  return `${varName} + ${Math.abs(k)}`;
}

function buildEnonceH() {
  const { alpha, beta, rNum, rDen, a, b, c, d, u0, r, v0, v0Num, v0Den } = H;

  // ── Fraction rationnelle h(x) = (ax+b)/(cx+d) ──────────────
  // numérateur : a·x + b
  const numLatex = termFirst(a,'x') + term(b,'');
  // dénominateur : c·x + d
  const denLatex = termFirst(c,'x') + term(d,'');
  const hLatex   = `h(x) = \\dfrac{${numLatex}}{${denLatex}}`;
  const recLatex = `u_{n+1} = \\dfrac{${numLatex.replace(/x/g,'u_n')}}{${denLatex.replace(/x/g,'u_n')}}`;

  // ── Équation des points fixes : h(x) = x ───────────────────
  // h(x)=x  ⟺  ax+b = x(cx+d)  ⟺  cx²+(d−a)x−b = 0
  const Aq = c, Bq = d-a, Cq = -b;
  // discriminant = Bq²−4·Aq·Cq  (doit être (α−β)² > 0)
  const eqLatex = termFirst(Aq,'x^2') + term(Bq,'x') + term(Cq,'') + ' = 0';

  // ── v_n = (u_n − α)/(u_n − β)  avec signe propre ──────────
  const rLatex   = `\\dfrac{${rNum}}{${rDen}}`;
  const v0Latex  = fracLatex(v0Num, v0Den);
  const vNumLatex = subLatex('u_n', alpha);   // "u_n - α" ou "u_n + |α|"
  const vDenLatex = subLatex('u_n', beta);    // "u_n - β" ou "u_n + |β|"
  const vnDef     = `v_n = \\dfrac{${vNumLatex}}{${vDenLatex}}`;

  // ── Pour la correction : u0 − α et u0 − β ──────────────────
  const v0numVal = u0 - alpha;
  const v0denVal = u0 - beta;
  const v0numLatex = subLatex(String(u0), alpha);   // "u0 - α" bien formé
  const v0denLatex = subLatex(String(u0), beta);

  // ── Correction points fixes : développement de cx²+… ───────
  const pfEqLatex  = `${hLatex} = x \\iff ${numLatex} = x(${denLatex}) \\iff ${eqLatex}`;

  // ── Forme close de u_n ──────────────────────────────────────
  // u_n = (α − β·v_n)/(1 − v_n),  numérateur : α − β·v_n
  // on affiche proprement selon signe de β
  const closeNumLatex = termFirst(1,String(alpha)) + term(-beta,'v_n');
  // dénominateur : 1 − v_n
  const closeDenLatex = `1 - v_n`;

  // ── Injection énoncé ────────────────────────────────────────
  document.getElementById('enonce-h-formula').innerHTML =
    `On pose \\(${hLatex}\\).<br>
     La suite \\((u_n)\\) est définie par :
     \\[u_0 = ${u0} \\qquad \\text{et} \\qquad u_{n+1} = h(u_n) = ${recLatex}\\]`;

  document.getElementById('enonce-h-ptsfixes').innerHTML =
    `On appelle <strong>point fixe</strong> de \\(h\\) tout réel \\(x\\) vérifiant \\(h(x) = x\\).
     Résoudre l'équation \\(h(x) = x\\) et en déduire les deux points fixes \\(\\alpha\\) et \\(\\beta\\) de \\(h\\).`;

  document.getElementById('enonce-h-vndef').innerHTML =
    `On note \\(\\alpha\\) et \\(\\beta\\) les deux points fixes trouvés (avec \\(\\alpha > \\beta\\)).
     On pose, pour tout \\(n \\in \\mathbb{N}\\) : \\(\\displaystyle ${vnDef}\\).`;

  document.getElementById('enonce-h-vrel').innerHTML =
    `Montrer que \\((v_n)\\) est une suite géométrique de raison \\(${rLatex}\\).`;

  // ── Injection correction ─────────────────────────────────────

  // Q1 — résolution des points fixes
  document.getElementById('corr-h-ptsfixes').innerHTML =
    `On résout \\(${pfEqLatex}\\).
     \\[${eqLatex}\\]
     Le discriminant est \\(\\Delta = ${Bq*Bq - 4*Aq*Cq}\\), d'où les racines :
     \\[\\alpha = ${alpha} \\qquad \\text{et} \\qquad \\beta = ${beta}\\]`;

  // Q1 — u1 et v0
  const u1num_h = a*u0+b, u1den_h = c*u0+d;
  const u1latex_h = fracLatex(u1num_h, u1den_h);
  document.getElementById('corr-h-u1').innerHTML =
    `\\[u_1 = h(${u0}) = \\frac{${termFirst(a,String(u0))+term(b,'')}}{${termFirst(c,String(u0))+term(d,'')}} = \\frac{${u1num_h}}{${u1den_h}} = ${u1latex_h}\\]
     \\[v_0 = \\frac{${v0numLatex}}{${v0denLatex}} = \\frac{${v0numVal}}{${v0denVal}} = ${v0Latex}\\]`;
  document.getElementById('corr-h-u1-result').textContent =
    `u₁ = ${fracStr(u1num_h, u1den_h)}   ·   v₀ = ${fracStr(v0Num, v0Den)}`;

  // Q2 — preuve v_{n+1} = r·v_n
  // numérateur de v_{n+1} après réduction : (a−cα)u_n + (b−dα)
  const numA = a - c*alpha, numB = b - d*alpha;
  const denA = a - c*beta,  denB = b - d*beta;
  // Le rapport (numérateur de v_{n+1}) / (numérateur de v_n) doit valoir r·(dénominateur de v_{n+1})/(dénominateur de v_n)
  // Affichage simplifié : on montre les deux fractions après mise au même dénominateur
  document.getElementById('corr-h-vn-proof').innerHTML =
    `\\[v_{n+1} = \\frac{${subLatex('u_{n+1}', alpha)}}{${subLatex('u_{n+1}', beta)}}
       = \\frac{\\dfrac{${numLatex.replace(/x/g,'u_n')}}{${denLatex.replace(/x/g,'u_n')}} - ${alpha}}{\\dfrac{${numLatex.replace(/x/g,'u_n')}}{${denLatex.replace(/x/g,'u_n')}} ${beta<=0?'+ '+Math.abs(beta):'- '+beta}}\\]
     En réduisant au même dénominateur \\((${denLatex.replace(/x/g,'u_n')})\\) :
     \\[v_{n+1} = \\frac{${termFirst(numA,'u_n')+term(numB,'')}}{${termFirst(denA,'u_n')+term(denB,'')}}
       = ${rLatex} \\cdot \\frac{${vNumLatex}}{${vDenLatex}} = ${rLatex}\\,v_n \\quad \\blacksquare\\]`;

  document.getElementById('corr-h-geo').innerHTML =
    `\\((v_n)\\) est géométrique de raison \\(${rLatex}\\) et de premier terme \\(v_0 = ${v0Latex}\\).`;

  document.getElementById('corr-h-vn-close').innerHTML =
    `\\[v_n = ${v0Latex} \\times \\left(${rLatex}\\right)^{n}\\]`;

  // Q4 — forme close de u_n
  document.getElementById('corr-h-close').innerHTML =
    `De \\(${vnDef}\\) on tire :
     \\[v_n\\,(${vDenLatex}) = ${vNumLatex}
       \\implies u_n(v_n - 1) = ${termFirst(1,String(alpha))+term(-beta,'v_n')}
       \\implies u_n = \\frac{${closeNumLatex}}{${closeDenLatex}}\\]
     En substituant \\(v_n = ${v0Latex}\\cdot\\left(${rLatex}\\right)^n\\) :
     \\[\\boxed{u_n = \\frac{${alpha} ${beta!==0?'- '+beta+'\\cdot'+v0Latex:''}\\cdot\\left(${rLatex}\\right)^n}{1 - ${v0Latex}\\cdot\\left(${rLatex}\\right)^n}}\\]`;

  document.getElementById('corr-h-lim').innerHTML =
    `Puisque \\(\\left|${rLatex}\\right| < 1\\), on a \\(v_n \\to 0\\) quand \\(n \\to +\\infty\\), donc :
     \\[\\lim_{n\\to+\\infty} u_n = \\frac{${alpha} - 0}{1 - 0} = ${alpha}\\]`;
  document.getElementById('corr-h-lim-result').textContent = `lim u_n = ${alpha}`;

  // ── Python ───────────────────────────────────────────────────
  const betaVal = beta === 0 ? '0' : String(beta);
  const pyHClose = `from fractions import Fraction

def u_close(n):
    # Forme close : u_n = (alpha - beta*v_n) / (1 - v_n)
    # avec v_n = v0 * r^n
    alpha = ${alpha}
    beta  = ${betaVal}
    v0 = Fraction(${v0Num}, ${v0Den})
    r  = Fraction(${rNum}, ${rDen})
    vn = v0 * r**n
    return (alpha - beta * vn) / (1 - vn)

def u_rec(n):
    u = Fraction(${u0})
    for _ in range(n):
        u = (${a}*u + ${b}) / (${c}*u + ${d})
    return u

print("n  | u_close(n)        | u_rec(n)         | egal ?")
print("-" * 52)
for n in range(6):
    uc = u_close(n)
    ur = u_rec(n)
    print(f"{n}  | {float(uc):.8f}  | {float(ur):.8f}  | {uc == ur}")`;

  document.getElementById('py-homo-corr').value = pyHClose;
  document.getElementById('py-homo').value = pyHClose
    .replace('    return (alpha - beta * vn) / (1 - vn)', '    ...');

  ALGOS['py-homo-corr'] = function(){
    const { alpha, beta, rNum, rDen, a: ha, b: hb, c: hc, d: hd, u0: hu0, v0Num, v0Den } = H;
    function uClose(n){
      const v0=v0Num/v0Den, r=rNum/rDen;
      const vn=v0*Math.pow(r,n);
      return (alpha - beta*vn)/(1-vn);
    }
    function uRec(n){
      let u=hu0;
      for(let i=0;i<n;i++) u=(ha*u+hb)/(hc*u+hd);
      return u;
    }
    const lines=['n  | u_close(n)        | u_rec(n)         | egal ?','-'.repeat(52)];
    for(let n=0;n<6;n++){
      const uc=uClose(n),ur=uRec(n),eq=Math.abs(uc-ur)<1e-10?'True':'~True';
      lines.push(`${n}  | ${uc.toFixed(8)}  | ${ur.toFixed(8)}  | ${eq}`);
    }
    return lines.join('\n');
  };
  ALGOS['py-homo'] = function(){
    const code=document.getElementById('py-homo').value;
    if(code.includes('...')) throw new Error("Complétez le return de u_close avant d'exécuter !");
    return evalPython(code);
  };
}

/* ══════════════════════════════════════════════════════════════
   PYTHON RUNNERS
   ══════════════════════════════════════════════════════════════ */
const ALGOS = {
  'py-close'(){ const c=document.getElementById('py-close').value; if(c.includes('...')) throw new Error("Implémentez u_close(n) !"); return evalPython(c); },
  'py-close-corr'(){ return '(init…)'; },
  'py-seuil-enonce'(){ return '(init…)'; },
  'py-seuil-corr'(){ return '(init…)'; },
  'py-homo'(){ return '(init…)'; },
  'py-homo-corr'(){ return '(init…)'; }
};

function evalPython(code){
  const lines=[];
  const pr=(...a)=>lines.push(a.join(' '));
  let js=code
    .replace(/f"([^"]*)"/g,(_,t)=>{
      const s=t
        .replace(/\{([^}:]+):(\d+)f\}/g,(__, e,d)=>`" + (${e}).toFixed(${d}) + "`)
        .replace(/\{([^}:]+):(\d+)e\}/g,(__, e,d)=>`" + (${e}).toExponential(${d}) + "`)
        .replace(/\{([^}]+)\}/g,(__, e)=>`" + (${e}) + "`);
      return `("${s}")`;
    })
    .replace(/\bprint\s*\(([\s\S]*?)\)\n/g,(_,a)=>`__pr__(${a})\n`)
    .replace(/\bprint\s*\(([\s\S]*?)\)$/gm,(_,a)=>`__pr__(${a})`)
    .replace(/(\d)\s*\*\*\s*(\d+)/g,'Math.pow($1,$2)')
    .replace(/\bTrue\b/g,'true').replace(/\bFalse\b/g,'false')
    .replace(/\bNone\b/g,'null').replace(/\babs\b/g,'Math.abs')
    .replace(/\bfloat\(([^)]+)\)/g,'Number($1)')
    .replace(/\bfrom fractions.*\n/g,'').replace(/\bFraction\(/g,'Number(');
  try{ Function('__pr__',js)(pr); }catch(e){ throw new Error(e.message); }
  return lines.join('\n')||'(aucune sortie)';
}

function runCode(editorId,outputId){
  const out=document.getElementById(outputId);
  out.className='console';
  try{ out.textContent=ALGOS[editorId]?ALGOS[editorId]():evalPython(document.getElementById(editorId).value); }
  catch(e){ out.className='console err'; out.textContent='⚠ Erreur : '+e.message; }
}
function dlCode(editorId,filename){
  const b=new Blob([document.getElementById(editorId).value],{type:'text/plain'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(b); a.download=filename||editorId+'.py'; a.click();
  URL.revokeObjectURL(a.href);
}

/* ══════════════════════════════════════════════════════════════
   TOGGLE CORRECTION
   ══════════════════════════════════════════════════════════════ */
function toggleCorr(id){
  const box=document.getElementById(id);
  const btn=box.previousElementSibling;
  const isOpen=box.classList.contains('visible');
  box.classList.toggle('visible',!isOpen);
  btn.classList.toggle('open',!isOpen);
  btn.querySelector('.arrow').textContent=isOpen?'▶':'▼';
  btn.childNodes[1].textContent=isOpen?' Voir la correction complète':' Masquer la correction';
  if(!isOpen){
    setTimeout(()=>box.scrollIntoView({behavior:'smooth',block:'nearest'}),50);
    setTimeout(()=>{
      if(window.renderMathInElement) renderMathInElement(box,{
        delimiters:[{left:'\\(',right:'\\)',display:false},{left:'\\[',right:'\\]',display:true}]
      });
      if(id==='c4') drawCanvasU();
      if(id==='ch') drawCanvasH();
    },80);
  }
}

/* ══════════════════════════════════════════════════════════════
   CANVAS
   ══════════════════════════════════════════════════════════════ */
const colors={blue:'#2c6e8a',green:'#2d7a4e',red:'#c0392b',purple:'#7c4dbd'};

function drawDots(canvas,terms,color,label='',limitLine=null){
  if(!canvas) return;
  const dpr=window.devicePixelRatio||1;
  const W=canvas.offsetWidth||700, H=canvas.clientHeight||200;
  canvas.width=W*dpr; canvas.height=H*dpr;
  const ctx=canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,W,H);
  const pad={l:50,r:20,t:20,b:35};
  const n=terms.length;
  const minV=Math.min(...terms.filter(isFinite));
  const maxV=Math.max(...terms.filter(isFinite));
  const lo=limitLine!==null?Math.min(minV,limitLine):minV;
  const hi=limitLine!==null?Math.max(maxV,limitLine):maxV;
  const span=(hi-lo)||1;
  const sx=(W-pad.l-pad.r)/(n-1||1), sy=(H-pad.t-pad.b)/span;
  const tx=i=>pad.l+i*sx, ty=v=>pad.t+(hi-v)*sy;

  ctx.strokeStyle='#e8e2d8'; ctx.lineWidth=1;
  for(let i=0;i<n;i++){ctx.beginPath();ctx.moveTo(tx(i),pad.t);ctx.lineTo(tx(i),H-pad.b);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(pad.l,pad.t);ctx.lineTo(pad.l,H-pad.b);ctx.lineTo(W-pad.r,H-pad.b);ctx.stroke();

  if(limitLine!==null){
    ctx.strokeStyle=colors.red+'88';ctx.lineWidth=1.5;ctx.setLineDash([6,4]);
    ctx.beginPath();ctx.moveTo(pad.l,ty(limitLine));ctx.lineTo(W-pad.r,ty(limitLine));ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle=colors.red;ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='left';
    ctx.fillText('→ '+limitLine,W-pad.r-60,ty(limitLine)-5);
  }
  ctx.strokeStyle=color+'55';ctx.lineWidth=1.5;ctx.setLineDash([3,2]);
  ctx.beginPath();
  terms.forEach((v,i)=>{if(isFinite(v)){i===0?ctx.moveTo(tx(i),ty(v)):ctx.lineTo(tx(i),ty(v));}});
  ctx.stroke();ctx.setLineDash([]);
  terms.forEach((v,i)=>{
    if(!isFinite(v)) return;
    ctx.fillStyle=color;ctx.beginPath();ctx.arc(tx(i),ty(v),5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#a09880';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
    if(n<=20) ctx.fillText('n='+i,tx(i),H-pad.b+16);
  });
  ctx.fillStyle='#7a7060';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='right';
  [lo,(lo+hi)/2,hi].forEach(v=>ctx.fillText((+v.toFixed(3)).toString(),pad.l-4,ty(v)+4));
  if(label){ctx.fillStyle=color;ctx.font='bold 12px Outfit,sans-serif';ctx.textAlign='left';ctx.fillText(label,pad.l+8,pad.t+16);}
}

function computeU(u0,nMax){
  const t=[u0]; let u=u0;
  for(let i=1;i<nMax;i++){
    u=-0.5*u*u+P.p*u+P.cste;
    if(!isFinite(u)||Math.abs(u)>1e9) break;
    t.push(u);
  }
  return t;
}
function drawCanvasU(){drawDots(document.getElementById('canvas-u'),computeU(P.u0,8),colors.blue,'(u_n)',P.p);}
function drawU(){
  const u0=parseFloat(document.getElementById('u0-val').value)||P.u0;
  const n=parseInt(document.getElementById('u-n').value)||12;
  const terms=computeU(u0,n);
  drawDots(document.getElementById('canvas-u-tool'),terms,colors.blue,`(u_n) — limite ${P.p}`,P.p);
  const last=terms[terms.length-1];
  document.getElementById('u-result').textContent=
    `u_${terms.length-1} ≈ ${last.toFixed(6)}  |  Écart à ${P.p} : ${Math.abs(last-P.p).toFixed(8)}`;
}

function computeG(n){
  return Array.from({length:n},(_,k)=>Q.v1*Math.pow(Q.r,k)+Q.l);
}
function drawG(){
  const n=parseInt(document.getElementById('g-n').value)||15;
  const terms=computeG(n);
  drawDots(document.getElementById('canvas-g'),terms,colors.green,`(g_n) — limite ${Q.l.toFixed(3)}`,Q.l);
  document.getElementById('g-result').textContent=
    `g_${n} ≈ ${terms[terms.length-1].toFixed(6)}  |  Écart : ${(terms[terms.length-1]-Q.l).toExponential(3)}`;
}
function calcSeuil(){
  const e=parseFloat(document.getElementById('g-e').value)||0.001;
  let g=Q.g1,n=1;
  while(g-Q.l>e){g=Q.r*g+Q.pDG;n++;}
  document.getElementById('g-result').textContent=
    `Pour e=${e} : premier rang n=${n}  (g_${n}≈${g.toFixed(6)})`;
}

function computeH(nMax){
  const {a,b,c,d,u0}=H;
  const t=[u0]; let u=u0;
  for(let i=1;i<nMax;i++){
    const den=c*u+d; if(Math.abs(den)<1e-10) break;
    u=(a*u+b)/den;
    if(!isFinite(u)||Math.abs(u)>1e6) break;
    t.push(u);
  }
  return t;
}
function drawCanvasH(){drawDots(document.getElementById('canvas-h'),computeH(12),colors.purple,'(u_n)',H.alpha);}
function drawH(){
  const u0i=parseFloat(document.getElementById('h-u0-val').value)||H.u0;
  const n=parseInt(document.getElementById('h-n').value)||12;
  const {a,b,c,d}=H;
  const terms=[u0i]; let u=u0i;
  for(let i=1;i<n;i++){const den=c*u+d;if(Math.abs(den)<1e-10)break;u=(a*u+b)/den;if(!isFinite(u)||Math.abs(u)>1e6)break;terms.push(u);}
  drawDots(document.getElementById('canvas-h-tool'),terms,colors.purple,`(u_n) — limite ${H.alpha}`,H.alpha);
  const last=terms[terms.length-1];
  document.getElementById('h-result').textContent=
    `u_${terms.length-1} ≈ ${last.toFixed(6)}  |  Écart à ${H.alpha} : ${Math.abs(last-H.alpha).toFixed(8)}`;
}

/* ══════════════════════════════════════════════════════════════
   NAV SCROLL SPY
   ══════════════════════════════════════════════════════════════ */
window.addEventListener('scroll',()=>{
  const sections=[['exo4','nav-4'],['exo1','nav-1'],['exo3','nav-3'],['contact','nav-0']];
  const mid=window.innerHeight/2;
  sections.forEach(([sid,nid])=>{
    const s=document.getElementById(sid);
    if(!s) return;
    const inn=s.getBoundingClientRect().top<mid&&s.getBoundingClientRect().bottom>0;
    document.getElementById(nid)?.classList.toggle('active',inn);
  });
},{passive:true});

/* ══════════════════════════════════════════════════════════════
   NOUVEL EXERCICE
   ══════════════════════════════════════════════════════════════ */
function newSession(){
  document.querySelectorAll('.correction.visible').forEach(el=>{
    el.classList.remove('visible');
    const btn=el.previousElementSibling;
    btn.classList.remove('open');
    btn.querySelector('.arrow').textContent='▶';
    btn.childNodes[1].textContent=' Voir la correction complète';
  });
  Object.assign(P,genParamsU());
  Object.assign(Q,genParamsG());
  Object.assign(H,genParamsH());
  buildEnonceU(); buildEnonceG(); buildEnonceH();
  document.getElementById('u0-val').value=P.u0;
  document.getElementById('h-u0-val').value=H.u0;
  document.querySelectorAll('.console').forEach(el=>{el.className='console idle';el.textContent='Cliquez sur ▶ Exécuter';});
  setTimeout(()=>{
    if(window.renderMathInElement) renderMathInElement(document.querySelector('main'),{
      delimiters:[{left:'\\(',right:'\\)',display:false},{left:'\\[',right:'\\]',display:true}]
    });
    drawU(); drawG(); drawH();
  },60);
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ══════════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════════ */
window.addEventListener('load',()=>{
  buildEnonceU(); buildEnonceG(); buildEnonceH();
  document.getElementById('u0-val').value=P.u0;
  document.getElementById('h-u0-val').value=H.u0;
  setTimeout(()=>{
    if(window.renderMathInElement) renderMathInElement(document.querySelector('main'),{
      delimiters:[{left:'\\(',right:'\\)',display:false},{left:'\\[',right:'\\]',display:true}]
    });
    drawU(); drawG(); drawH();
  },200);
  let rt;
  window.addEventListener('resize',()=>{
    clearTimeout(rt);rt=setTimeout(()=>{
      drawU();drawG();drawH();
      if(document.getElementById('canvas-u').offsetParent) drawCanvasU();
      if(document.getElementById('canvas-h').offsetParent) drawCanvasH();
    },200);
  });
});