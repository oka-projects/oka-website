/* Oka · site v9 · demonstrações, palcos e revelações */
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SEQ = {
  agente:    [500, 1100, 1200, 1300, 900, 2800],
  vereda:    [500, 1300, 1100, 1100, 2800],
  locafacil: [600, 750, 750, 800, 2800],
  meety:     [400, 1500, 1300, 1300, 2800],
  painel:    [400, 1300, 2000, 2400],
  automacao: [500, 800, 800, 900, 2800],
  treino:    [500, 1000, 1000, 1000, 2800],
  app:       [500, 700, 700, 900, 2800],
  agente2:   [500, 1000, 1100, 1100, 1000, 800, 800, 3200],
  rede:      [400, 2800, 3400],
  site:      [400, 600, 700, 700, 1000, 1000, 2800],
  motion:    [300, 6600],
  iphone:    [500, 800, 650, 650, 1000, 1000, 2400, 3600],
};
const demos = new Map();
class Demo {
  constructor(el) {
    this.el = el; this.seq = SEQ[el.dataset.demo]; this.s = 0; this.t = 0;
    this.visible = false; this.active = !el.closest('[data-panel]'); this.running = false;
    this.dur = this.seq.reduce((a, b) => a + b, 0);
    this.items = [...el.querySelectorAll('[data-at]')];
    this.paint();
  }
  paint() {
    const s = this.s; this.el.dataset.s = s;
    for (const e of this.items) {
      const a = +e.dataset.at, u = e.dataset.until ? +e.dataset.until : 99;
      e.classList.toggle('on', s >= a && s < u);
    }
    this.el.querySelectorAll('[data-count]').forEach(n => {
      const to = +n.dataset.count, suf = n.dataset.suf || '';
      if (s === 0) { n.textContent = '0' + suf; return; }
      if (s !== 1 || RM) { n.textContent = to + suf; return; }
      const t0 = performance.now();
      const f = t => { const k = Math.min(1, (t - t0) / 1100), v = 1 - Math.pow(1 - k, 4);
        n.textContent = Math.round(to * v) + suf; if (k < 1 && this.s >= 1) requestAnimationFrame(f); };
      requestAnimationFrame(f);
    });
  }
  tick() {
    this.paint();
    this.t = setTimeout(() => {
      this.s = (this.s + 1) % this.seq.length;
      if (this.s === 0) this.el.dispatchEvent(new CustomEvent('demoloop', { bubbles: true }));
      if (this.running) this.tick();
    }, this.seq[this.s]);
  }
  sync() {
    const want = this.visible && this.active;
    if (want && !this.running) {
      this.running = true;
      if (RM) { this.s = this.seq.length - 1; this.paint(); } else this.tick();
    } else if (!want && this.running) { this.running = false; clearTimeout(this.t); }
  }
  restart() { clearTimeout(this.t); this.running = false; this.s = 0; this.paint(); this.sync(); }
}
const io = new IntersectionObserver(es => es.forEach(e => {
  const d = demos.get(e.target); d.visible = e.isIntersecting; d.sync();
}), { threshold: .25 });
document.querySelectorAll('.demo[data-demo]').forEach(el => { demos.set(el, new Demo(el)); io.observe(el); });

/* palco com abas: troca sozinho ao fim de cada demonstração */
document.querySelectorAll('[data-stage]').forEach(st => {
  const tabs = [...st.querySelectorAll('[data-tab]')], panels = [...st.querySelectorAll('[data-panel]')];
  let cur = -1, hold = 0;
  const bar = i => {
    const b = tabs[i].querySelector('.pg'); if (!b || RM) return;
    const d = demos.get(panels[i].querySelector('.demo'));
    b.getAnimations().forEach(a => a.cancel());
    b.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: d ? d.dur : 6000, easing: 'linear', fill: 'forwards' });
  };
  const set = i => {
    cur = i;
    tabs.forEach((t, k) => { t.classList.toggle('is-active', k === i); t.setAttribute('aria-selected', k === i); });
    panels.forEach((p, k) => {
      p.classList.toggle('is-active', k === i);
      p.querySelectorAll('.demo').forEach(el => { const d = demos.get(el); d.active = k === i; if (k === i) d.restart(); else d.sync(); });
    });
    bar(i);
    st.dispatchEvent(new CustomEvent('stagechange', { detail: i }));
  };
  tabs.forEach((t, i) => t.addEventListener('click', () => { hold = 1; set(i); }));
  st.addEventListener('keydown', e => {
    if (!e.target.matches('[data-tab]')) return;
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (!d) return;
    e.preventDefault(); const n = (cur + d + tabs.length) % tabs.length; hold = 2; set(n); tabs[n].focus();
  });
  st.addEventListener('demoloop', () => {
    if (RM) return;
    if (hold > 0 && --hold > 0) { bar(cur); return; }
    set((cur + 1) % tabs.length);
  });
  set(0);
});

/* revelação discreta */
const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { threshold: .15 });
document.querySelectorAll('.rv').forEach(e => rio.observe(e));
