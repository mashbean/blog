(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const previous = document.querySelector('#previous');
  const next = document.querySelector('#next');
  const overview = document.querySelector('#overview');
  const dialog = document.querySelector('#source-dialog');
  const counter = document.querySelector('#counter');
  const progress = document.querySelector('#progress-bar');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let reading = false;
  let animation;
  let idle;
  const hashIndex = () => Math.max(0, Math.min(slides.length - 1, (Number(location.hash.slice(1).replace('slide-', '')) || 1) - 1));
  const wake = () => {
    document.body.classList.remove('idle');
    clearTimeout(idle);
    idle = setTimeout(() => {
      if (!dialog.open && !reading && !document.querySelector('.controls').contains(document.activeElement)) document.body.classList.add('idle');
    }, 2600);
  };
  function go(target, animate = true, history = true) {
    index = Math.max(0, Math.min(slides.length - 1, target));
    animation?.kill();
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
      s.inert = !reading && i !== index;
      s.setAttribute('aria-hidden', String(!reading && i !== index));
    });
    counter.value = `${String(index + 1).padStart(2, '0')} / ${slides.length}`;
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    progress.style.transform = `scaleX(${(index + 1) / slides.length})`;
    if (history) window.history.replaceState(null, '', `#${index + 1}`);
    if (reading) slides[index].scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'start' });
    const nodes = slides[index].querySelectorAll('.motion');
    if (window.gsap) {
      gsap.set(nodes, { clearProps: 'all' });
      if (animate && !reading && !motion.matches) {
        animation = gsap.timeline({ defaults: { duration: .65, ease: 'power3.out' } });
        animation.fromTo(nodes, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, stagger: .08, clearProps: 'all' });
      }
    }
    wake();
  }
  function toggleReading() {
    animation?.progress(1);
    reading = !reading;
    document.body.classList.toggle('reading', reading);
    document.body.classList.toggle('presenting', !reading);
    overview.setAttribute('aria-pressed', String(reading));
    if (!reading) window.scrollTo(0, 0);
    go(index, false);
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
    } catch { /* Browsers may deny fullscreen outside a user gesture. */ }
  }
  previous.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  overview.addEventListener('click', toggleReading);
  document.querySelector('#fullscreen').addEventListener('click', fullscreen);
  document.querySelector('#print').addEventListener('click', () => window.print());
  document.querySelector('#sources').addEventListener('click', () => { wake(); dialog.showModal(); });
  dialog.querySelector('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  window.addEventListener('keydown', e => {
    if (dialog.open || e.metaKey || e.ctrlKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (e.key === ' ' && /BUTTON|A/.test(e.target.tagName)) return;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(index + 1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); go(index - 1); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(slides.length - 1); }
    else if (e.key.toLowerCase() === 'f') fullscreen();
    else if (e.key.toLowerCase() === 'r') toggleReading();
    else if (e.key.toLowerCase() === 'p') window.print();
  });
  let touchStart;
  document.querySelector('#deck').addEventListener('touchstart', e => { touchStart = [e.changedTouches[0].clientX, e.changedTouches[0].clientY]; }, { passive: true });
  document.querySelector('#deck').addEventListener('touchend', e => {
    if (!touchStart || reading || dialog.open) return;
    const dx = e.changedTouches[0].clientX - touchStart[0];
    const dy = e.changedTouches[0].clientY - touchStart[1];
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) go(index + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });
  window.addEventListener('hashchange', () => go(hashIndex(), false, false));
  window.addEventListener('pointermove', wake, { passive: true });
  window.addEventListener('touchstart', wake, { passive: true });
  window.addEventListener('focusin', wake);
  window.addEventListener('beforeprint', () => animation?.progress(1));
  motion.addEventListener('change', () => { animation?.progress(1); });
  document.body.classList.add('presenting');
  go(hashIndex(), true, false);
})();
