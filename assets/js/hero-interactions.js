(() => {
  'use strict';
  const hero = document.querySelector('.discover-hero');
  if (!hero) return;

  // Randomize icons within the reserved margins and content spaces.
  const marks = Array.from(hero.querySelectorAll('.cozy-mark, .cozy-content-icon'));
  const types = ['star', 'heart', 'moon', 'bottle', 'pacifier'];
  const icons = marks.map((_, i) => types[i % types.length]);
  for (let i = icons.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [icons[i], icons[j]] = [icons[j], icons[i]];
  }
  marks.forEach((icon, i) => {
    icon.querySelector('use').setAttribute('href', `#cozy-${icons[i]}`);
    icon.style.setProperty('--cozy-angle', `${Math.round(Math.random() * 28 - 14)}deg`);
    icon.style.setProperty('--cozy-size', `${Math.round(40 + Math.random() * 10)}px`);
  });

  const buttons = Array.from(hero.querySelectorAll('.discover-cta'));
  const toggle = hero.querySelector('.discover-motion-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!buttons.length || !window.IntersectionObserver || !buttons[0].animate) return;
  const visible = new Set();
  let paused = false;
  let timer;
  let previous;
  let active;

  const stop = () => {
    window.clearTimeout(timer);
    timer = undefined;
    active?.animation.cancel();
    active = undefined;
  };
  const enabled = () => !paused && !reducedMotion.matches && !document.hidden;
  const schedule = (first = false) => {
    if (!enabled() || !visible.size || timer !== undefined) return;
    // A quick first nudge, then longer randomized rests, one visible CTA at a time.
    timer = window.setTimeout(nudge, first ? 1000 + Math.random() * 1000 : 6000 + Math.random() * 4000);
  };
  const nudge = () => {
    timer = undefined;
    if (!enabled()) return;
    const candidates = Array.from(visible).filter(button => {
      const card = button.closest('.discover-card');
      return !card.matches(':hover') && !card.contains(document.activeElement);
    });
    const different = candidates.filter(button => button !== previous);
    const pool = different.length ? different : candidates;
    if (pool.length) {
      const button = pool[Math.floor(Math.random() * pool.length)];
      const animation = button.animate([
        { transform: 'translateX(0) rotate(0deg)' },
        { transform: 'translateX(-3px) rotate(-1deg)' },
        { transform: 'translateX(3px) rotate(1deg)' },
        { transform: 'translateX(-2px) rotate(-.6deg)' },
        { transform: 'translateX(2px) rotate(.6deg)' },
        { transform: 'translateX(-1px) rotate(-.2deg)' },
        { transform: 'translateX(0) rotate(0deg)' }
      ], { duration: 820, easing: 'cubic-bezier(.45, 0, .55, 1)', iterations: 1 });
      previous = button;
      active = { button, animation };
      animation.finished.then(() => { if (active?.animation === animation) active = undefined; }).catch(() => {});
    }
    schedule();
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.intersectionRatio >= .75) visible.add(entry.target);
      else {
        visible.delete(entry.target);
        if (active?.button === entry.target) { active.animation.cancel(); active = undefined; }
      }
    });
    if (!visible.size) stop();
    else schedule(true);
  }, { threshold: [0, .75] });
  buttons.forEach(button => {
    observer.observe(button);
    const card = button.closest('.discover-card');
    const settle = () => {
      if (active?.button === button) { active.animation.cancel(); active = undefined; }
    };
    card.addEventListener('pointerenter', settle);
    card.addEventListener('pointerdown', settle);
    card.addEventListener('focusin', settle);
  });

  const update = () => {
    stop();
    if (toggle) {
      toggle.hidden = reducedMotion.matches;
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.textContent = paused ? 'Resume motion' : 'Pause motion';
    }
    schedule(true);
  };
  toggle?.addEventListener('click', () => { paused = !paused; update(); });
  reducedMotion.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', update);
  update();
})();
