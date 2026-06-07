/* touchtype — shared typing engine
 * Renders a character stream + caret flow, tracks stats, draws the keyboard
 * diagram, and supports optional cross-layout remapping. UI-agnostic: every
 * direction supplies its own elements + CSS; the engine only adds semantic
 * classes/attributes.
 *
 *   const tt = TT.create({ els, layout, hwLayout, level, mapFrom, options });
 *   tt.setLayout('dvorak'); tt.setHwLayout('iso'); tt.setLevel('home');
 *   tt.restart();
 */
(function (root) {
  'use strict';
  const D = root.TTData;

  const FINGER_ORDER = ['lp', 'lr', 'lm', 'li', 'ri', 'rm', 'rr', 'rp'];

  function create(cfg) {
    const els = cfg.els;
    const state = {
      layout:   cfg.layout   || 'qwerty',
      hwLayout: cfg.hwLayout || 'ansi',
      level:    cfg.level    || 'rest',
      mapFrom:  cfg.mapFrom  || null,
      options: Object.assign(
        { fingerColors: false, highlightNext: true, restingMarkers: true, numberRow: false },
        cfg.options || {}),
      onStats: cfg.onStats || function () {}
    };

    let chars = [];
    let pos = 0;
    let started = 0;
    let typed = 0, correct = 0, errors = 0;
    let finished = false;
    let ticker = null;
    let focused = false;

    const caret = document.createElement('span');
    caret.className = 'tt-caret';

    // ---- build the character stream ------------------------------------------
    function buildWords() {
      const words = D.generate(state.level, state.layout, 100, 0, state.hwLayout);
      els.words.innerHTML = '';
      els.words.appendChild(caret);
      chars = [];
      words.forEach(function (w, wi) {
        const wEl = document.createElement('span');
        wEl.className = 'tt-w';
        for (let i = 0; i < w.length; i++) {
          const c = document.createElement('span');
          c.className = 'tt-c';
          c.textContent = w[i];
          wEl.appendChild(c);
          chars.push({ ch: w[i], el: c, status: 'pending' });
        }
        els.words.appendChild(wEl);
        if (wi < words.length - 1) {
          const sp = document.createElement('span');
          sp.className = 'tt-c tt-sp';
          sp.textContent = ' ';
          els.words.appendChild(sp);
          chars.push({ ch: ' ', el: sp, status: 'pending' });
        }
      });
      pos = 0; typed = 0; correct = 0; errors = 0; started = 0; finished = false;
      if (els.root) els.root.classList.remove('is-finished');
      if (cfg.onReset) cfg.onReset();
      chars.forEach(function (c) { c.el.classList.add('is-pending'); });
      paintCaret();
      emit();
      requestAnimationFrame(scrollToCaret);
    }

    // ---- caret + scrolling ---------------------------------------------------
    function paintCaret() {
      const target = chars[pos] ? chars[pos].el : null;
      if (target) {
        caret.style.left   = target.offsetLeft + 'px';
        caret.style.top    = target.offsetTop  + 'px';
        caret.style.height = target.offsetHeight + 'px';
        caret.classList.remove('tt-caret--end');
      } else if (chars.length) {
        const last = chars[chars.length - 1].el;
        caret.style.left   = (last.offsetLeft + last.offsetWidth) + 'px';
        caret.style.top    = last.offsetTop  + 'px';
        caret.style.height = last.offsetHeight + 'px';
        caret.classList.add('tt-caret--end');
      }
    }

    function scrollToCaret() {
      const target = chars[pos] ? chars[pos].el : (chars.length ? chars[chars.length - 1].el : null);
      if (!target) return;
      const lh = target.offsetHeight || 1;
      const line = Math.round(target.offsetTop / lh);
      const shift = Math.max(0, line - 1) * lh;
      els.words.style.transform = 'translateY(' + (-shift) + 'px)';
    }

    // ---- keyboard diagram ----------------------------------------------------
    let keyEls = {};

    // CSS width/height for a key that is `units` wide/tall
    function keyDim(units) {
      if (units === 1) return '';
      return 'calc(var(--kbd-unit) * ' + units + ' + var(--kbd-gap) * ' + (units - 1) + ')';
    }

    function buildKeyboard() {
      if (!els.keyboard) return;
      els.keyboard.innerHTML = '';
      keyEls = {};

      const hw = D.HW[state.hwLayout];
      if (!hw) return;

      els.keyboard.dataset.hw = state.hwLayout;

      const visibleRows = hw.rows.filter(function (r) {
        return r.name !== 'num' || state.options.numberRow;
      });
      const minStagger = visibleRows.reduce(function (m, r) {
        return Math.min(m, r.stagger || 0);
      }, Infinity);

      // Pre-pass: find IDs that appear in consecutive rows (multi-row spanning keys)
      const rowIdSets = visibleRows.map(function (row) {
        const s = {};
        row.keys.forEach(function (k) { if (k.id && !k.gap) s[k.id] = k.width || 1; });
        return s;
      });
      const spanIds = {}; // id -> true
      for (let i = 0; i < rowIdSets.length - 1; i++) {
        Object.keys(rowIdSets[i]).forEach(function (id) {
          if (rowIdSets[i + 1][id] !== undefined) spanIds[id] = true;
        });
      }

      // Track first-occurrence elements for retroactive L-step sizing
      const spanTopEls = {}; // id -> { el, width }

      visibleRows.forEach(function (row) {
        const rowEl = document.createElement('div');
        rowEl.className = 'tt-krow tt-krow--' + row.name;

        const offset = (row.stagger || 0) - minStagger;
        if (offset > 0) {
          rowEl.style.paddingLeft =
            'calc(var(--kbd-unit) * ' + offset + ' + var(--kbd-gap) * ' + offset + ')';
        }

        row.keys.forEach(function (k) {
          if (k.gap) {
            const gapEl = document.createElement('div');
            gapEl.className = 'tt-kgap';
            const gw = keyDim(k.gap);
            if (gw) gapEl.style.width = gw;
            rowEl.appendChild(gapEl);
            return;
          }

          const isSpan    = spanIds[k.id];
          const isTopSpan = isSpan && !spanTopEls[k.id];
          const isBotSpan = isSpan &&  spanTopEls[k.id];

          const keyEl = document.createElement('div');
          const finger = k.finger || 'th';
          keyEl.className = 'tt-key tt-fz-' + finger;
          if (k.mod || isBotSpan) keyEl.classList.add('is-inactive');
          keyEl.dataset.id = k.id;

          const w = keyDim(k.width  || 1);
          if (w) keyEl.style.width = w;

          if (isTopSpan) {
            keyEl.classList.add('tt-key--span-top');
            spanTopEls[k.id] = { el: keyEl, width: k.width || 1 };
          } else if (isBotSpan) {
            keyEl.classList.add('tt-key--span-bottom');
            // Retroactively apply L-step on the top piece if widths differ
            const topInfo  = spanTopEls[k.id];
            const step = topInfo.width - (k.width || 1);
            if (step > 0.01) {
              // Top is wider: draw the horizontal step border on its left portion
              topInfo.el.classList.add('tt-key--span-top-l');
              topInfo.el.style.setProperty('--span-step',
                'calc(var(--kbd-unit) * ' + step + ' + var(--kbd-gap) * ' + step + ')');
            }
          }

          // Cap label — only on first occurrence of a spanning key
          if (!isBotSpan) {
            const cap = document.createElement('span');
            cap.className = 'tt-cap';
            if (!k.mod) cap.textContent = D.charFor(k.id, state.layout);
            keyEl.appendChild(cap);
          }

          if (k.resting) {
            keyEl.dataset.resting = '1';
            const bump = document.createElement('span');
            bump.className = 'tt-bump';
            keyEl.appendChild(bump);
          }

          rowEl.appendChild(keyEl);
          if (!k.mod && !isBotSpan) keyEls[k.id] = keyEl;
        });

        els.keyboard.appendChild(rowEl);
      });

      refreshKeyboardState();
    }

    function refreshKeyboardState() {
      if (!els.keyboard) return;
      const active = {};
      D.activeIds(state.level, state.layout, state.hwLayout).forEach(function (id) {
        active[id] = true;
      });
      els.keyboard.dataset.fingers = state.options.fingerColors ? '1' : '0';
      els.keyboard.dataset.resting = state.options.restingMarkers ? '1' : '0';
      Object.keys(keyEls).forEach(function (id) {
        keyEls[id].classList.toggle('is-inactive', !active[id]);
      });
      highlightNext();
    }

    function highlightNext() {
      if (!els.keyboard) return;
      Object.keys(keyEls).forEach(function (id) { keyEls[id].classList.remove('is-next'); });
      const spaceEl = keyEls['K_SPACE'];
      if (spaceEl) spaceEl.classList.remove('is-next');
      if (!state.options.highlightNext || finished) return;
      const next = chars[pos];
      if (!next) return;
      if (next.ch === ' ') {
        if (spaceEl) spaceEl.classList.add('is-next');
        return;
      }
      const id = idForChar(next.ch);
      if (id && keyEls[id]) keyEls[id].classList.add('is-next');
    }

    // Find which hardware key produces `ch` under the current software layout
    function idForChar(ch) {
      const hw = D.HW[state.hwLayout];
      if (!hw) return null;
      for (let ri = 0; ri < hw.rows.length; ri++) {
        const row = hw.rows[ri];
        for (let ki = 0; ki < row.keys.length; ki++) {
          const k = row.keys[ki];
          if (k.gap || k.mod || !k.id) continue;
          if (D.charFor(k.id, state.layout) === ch) return k.id;
        }
      }
      return null;
    }

    // ---- input ---------------------------------------------------------------
    function currentWordStart() {
      let i = pos - 1;
      while (i >= 0 && chars[i].ch !== ' ') i--;
      return i + 1;
    }

    function expectedKey() {
      const next = chars[pos];
      if (!next) return null;
      if (next.ch === ' ') return ' ';
      const id = idForChar(next.ch);
      if (!id) return next.ch;
      if (state.mapFrom && state.mapFrom !== state.layout)
        return D.charFor(id, state.mapFrom);
      return next.ch;
    }

    function flashKey(id) {
      const el = keyEls[id];
      if (!el) return;
      el.classList.add('is-hit');
      setTimeout(function () { el.classList.remove('is-hit'); }, 110);
    }

    function onKeydown(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Tab' || e.key === 'Escape') { e.preventDefault(); buildWords(); return; }
      if (finished) { if (e.key === 'Enter') { e.preventDefault(); buildWords(); } return; }

      if (e.key === 'Backspace') {
        e.preventDefault();
        const wordStart = currentWordStart();
        if (pos > wordStart) {
          pos--;
          const c = chars[pos];
          if (c.overflow) {
            c.el.remove();
            chars.splice(pos, 1);
          } else {
            c.status = 'pending';
            c.el.classList.remove('is-done', 'is-wrong');
            c.el.classList.add('is-pending');
          }
          paintCaret(); highlightNext(); scrollToCaret();
        }
        return;
      }

      let key = e.key;
      if (key.length !== 1) return;
      e.preventDefault();

      // Space submits the current word
      if (key === ' ') {
        let spaceIdx = pos;
        while (spaceIdx < chars.length && chars[spaceIdx].ch !== ' ') spaceIdx++;
        if (spaceIdx >= chars.length) return;
        if (!started) { started = Date.now(); startTicker(); }
        for (let i = pos; i < spaceIdx; i++) {
          if (chars[i].status === 'pending') {
            chars[i].status = 'wrong';
            chars[i].el.classList.remove('is-pending');
            chars[i].el.classList.add('is-wrong');
            errors++; typed++;
          }
        }
        const sp = chars[spaceIdx];
        sp.status = 'done';
        sp.el.classList.remove('is-pending', 'is-wrong');
        sp.el.classList.add('is-done');
        correct++; typed++;
        flashKey('K_SPACE');
        pos = spaceIdx + 1;
        paintCaret(); highlightNext(); emit(); scrollToCaret();
        return;
      }

      if (!started) { started = Date.now(); startTicker(); }
      const exp = expectedKey();
      const cur = chars[pos];
      if (!cur) return;

      // Overflow: typing past end of word — insert a red char before the space
      if (cur.ch === ' ') {
        const overflowEl = document.createElement('span');
        overflowEl.className = 'tt-c tt-overflow is-wrong';
        overflowEl.textContent = key;
        cur.el.before(overflowEl);
        chars.splice(pos, 0, { ch: key, el: overflowEl, status: 'wrong', overflow: true });
        errors++; typed++;
        pos++;
        paintCaret(); highlightNext(); emit(); scrollToCaret();
        return;
      }

      typed++;
      const hit = state.mapFrom && state.mapFrom !== state.layout
        ? (key.toLowerCase() === (exp || '').toLowerCase())
        : (key === cur.ch);

      if (hit) {
        cur.status = 'done';
        cur.el.classList.remove('is-pending', 'is-wrong');
        cur.el.classList.add('is-done');
        correct++;
        flashKey(idForChar(cur.ch));
      } else {
        cur.status = 'wrong';
        cur.el.classList.remove('is-pending');
        cur.el.classList.add('is-wrong');
        errors++;
      }
      pos++;
      paintCaret(); highlightNext(); emit(); scrollToCaret();
      if (pos >= chars.length) finish();
    }

    // ---- stats ---------------------------------------------------------------
    function minutes() { return started ? (Date.now() - started) / 60000 : 0; }
    function wpm()  { const m = minutes(); return m > 0 ? Math.round((correct / 5) / m) : 0; }
    function acc()  { return typed ? Math.round((correct / typed) * 100) : 100; }
    function fmtTime() {
      const s = Math.floor((started ? Date.now() - started : 0) / 1000);
      return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    }
    function emit() {
      const data = { wpm: wpm(), accuracy: acc(), errors: errors, time: fmtTime(),
                     progress: chars.length ? pos / chars.length : 0, finished: finished };
      if (els.wpm)      els.wpm.textContent      = data.wpm;
      if (els.accuracy) els.accuracy.textContent = data.accuracy + '%';
      if (els.errors)   els.errors.textContent   = errors;
      if (els.time)     els.time.textContent      = data.time;
      state.onStats(data);
    }
    function startTicker() { stopTicker(); ticker = setInterval(emit, 250); }
    function stopTicker()  { if (ticker) { clearInterval(ticker); ticker = null; } }
    function finish() {
      finished = true; stopTicker(); emit(); highlightNext();
      if (els.root) els.root.classList.add('is-finished');
      if (cfg.onFinish) cfg.onFinish({
        wpm: wpm(), accuracy: acc(), errors: errors, time: fmtTime(),
        typed: typed, correct: correct, chars: chars.length
      });
    }

    // ---- focus ---------------------------------------------------------------
    function setFocused(v) {
      focused = v;
      if (els.root) els.root.classList.toggle('is-blurred', !v);
    }

    // ---- public API ----------------------------------------------------------
    function rebuild() { buildKeyboard(); buildWords(); }

    window.addEventListener('keydown',  function (e) { if (!focused) return; onKeydown(e); });
    window.addEventListener('resize',   function ()  { paintCaret(); scrollToCaret(); });
    window.addEventListener('focus',    function ()  { setFocused(true); });
    window.addEventListener('blur',     function ()  { setFocused(false); });
    document.addEventListener('click',  function ()  { setFocused(true); });
    setFocused(document.hasFocus());

    const api = {
      setLayout:   function (l)  { state.layout   = l;  rebuild(); },
      setLevel:    function (lv) { state.level    = lv; rebuild(); },
      setHwLayout: function (hw) { state.hwLayout = hw; buildKeyboard(); },
      setMapFrom:  function (m)  { state.mapFrom  = m;  highlightNext(); },
      setOption:   function (k, v) { state.options[k] = v; refreshKeyboardState(); },
      restart: buildWords,
      rebuild: rebuild,
      state:   state,
      focus:   function () { setFocused(true); }
    };

    rebuild();
    return api;
  }

  root.TT = { create: create, FINGER_ORDER: FINGER_ORDER };
})(window);
