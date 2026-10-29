/* Haven of Light – homepage motion */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hover classes for buttons and clickable cards
  document.querySelectorAll('a, button').forEach(function (el) {
    var s = el.getAttribute('style') || '';
    if (/border-radius:\s*999px/.test(s) || el.classList.contains('pill')) {
      el.classList.add('btn');
      var bg = getComputedStyle(el).backgroundColor;
      if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
        var c = getComputedStyle(el).color.match(/\d+/g).map(Number);
        el.classList.add((c[0] + c[1] + c[2]) / 3 > 128 ? 'btn-ghost-light' : 'btn-ghost-dark');
      }
    } else if (el.tagName === 'A' && /border-radius:\s*(1[4-9]|2\d)px/.test(s)) {
      el.classList.add('card-link');
    }
  });

  if (reduce) return;

  // Hero parallax and scroll fade
  var hero = document.querySelector('.hero-photo');
  var bg = hero && hero.querySelector('.hero-bg');
  var inner = hero && hero.querySelector('.hero-inner');
  if (hero && bg && inner) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;
      var h = hero.offsetHeight;
      if (y > h * 1.2) return;
      var p = Math.min(Math.max(y / (h * 0.55), 0), 1);
      if (window.innerWidth > 760) bg.style.transform = 'translate3d(0,' + (y * 0.35).toFixed(1) + 'px,0)';
      else bg.style.transform = '';
      inner.style.opacity = (1 - p).toFixed(3);
      inner.style.transform = 'translate3d(0,' + (-p * 40).toFixed(1) + 'px,0)';
    };
    var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  // Scroll-triggered reveals: one per block, staggered children for card grids
  if (!('IntersectionObserver' in window)) return;
  var targets = [];
  document.querySelectorAll('main section, body > div > section').forEach(function (sec) {
    if (sec === hero) return;
    var container = sec.firstElementChild;
    if (!container) return;
    Array.prototype.forEach.call(container.children, function (child) {
      var cs = getComputedStyle(child);
      if (cs.display === 'grid' && child.children.length > 1) {
        Array.prototype.forEach.call(child.children, function (card, i) {
          card.classList.add('reveal'); card.style.setProperty('--d', (Math.min(i, 5) * 0.12) + 's'); targets.push(card);
        });
      } else if (child.tagName === 'IMG' || child.tagName === 'FIGURE') {
        child.classList.add('reveal-img'); targets.push(child);
      } else {
        child.classList.add('reveal'); targets.push(child);
      }
    });
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  targets.forEach(function (t) { io.observe(t); });
})();
