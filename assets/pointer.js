/* ============================================================
   pointer.js — 指针交互（无光晕版）
   只做两件事：
   1) 记录光标在卡片内的位置 -> CSS 变量 --mx / --my（玻璃上的高光）
   2) 给命中的卡片加 .is-hover
   触屏设备自动跳过
   ============================================================ */
(function () {
  var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (coarse) return;

  var SEL = '.card,.mod,.proj,.wki,.adv,.pr,.fl,.st,.rule,.method,' +
            '.day,.week,details,.blk,.term,.cal,.note,.cp,.list,.steps,.flow,' +
            '.allocate,.daycard,.check,.item,.diag .item';

  var lastEl = null;

  function move(e) {
    var el = e.target.closest ? e.target.closest(SEL) : null;

    if (el !== lastEl) {
      if (lastEl) lastEl.classList.remove('is-hover');
      lastEl = el;
      if (el) el.classList.add('is-hover');
    }

    if (el) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left).toFixed(0) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top).toFixed(0) + 'px');
    }
  }

  document.addEventListener('pointermove', move, { passive: true });

  document.addEventListener('pointerout', function (e) {
    if (lastEl && !lastEl.contains(e.relatedTarget)) {
      lastEl.classList.remove('is-hover');
      lastEl = null;
    }
  }, { passive: true });
})();
