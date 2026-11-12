/* ============================================================
   reveal.js — 滚动入场
   规则：
   - 只有进入视口才播，播一次就停
   - 同一批元素按 45ms 错开，最多 260ms
   - 不支持 IO、或用户要求减少动效时，直接不隐藏任何内容
   ============================================================ */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var groups = [];

  // 每个 section 的直接子元素作为一组
  Array.prototype.forEach.call(document.querySelectorAll('.wrap section'), function (sec) {
    var kids = Array.prototype.filter.call(sec.children, function (el) {
      return el.offsetParent !== null;
    });
    if (kids.length) groups.push(kids);
  });

  // 逐周 / 项目块单独成组
  ['.week', '.term', '.blk'].forEach(function (sel) {
    var list = document.querySelectorAll(sel);
    if (list.length > 1) groups.push(Array.prototype.slice.call(list));
  });

  var seen = new Set();
  var items = [];

  groups.forEach(function (group) {
    group.forEach(function (el, i) {
      if (seen.has(el)) return;
      seen.add(el);

      // 已经在视口里（或已被滚过）的：直接显示，不做动画
      var top = el.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.94) {
        el.classList.add('reveal', 'in');
        return;
      }

      el.style.transitionDelay = Math.min(i * 45, 260) + 'ms';
      el.classList.add('reveal');
      items.push(el);
    });
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.classList.add('in');
      io.unobserve(el);
      // 动画结束后清掉 delay，避免影响后续 hover 过渡
      setTimeout(function () { el.style.transitionDelay = ''; }, 1100);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });

  items.forEach(function (el) { io.observe(el); });
})();
