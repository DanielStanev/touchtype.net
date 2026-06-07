/* touchtype — shared app wiring. Declarative: each direction supplies markup
 * with data-attributes; this binds them to the engine, persists to localStorage,
 * and applies theme / accent / language. No per-direction JS needed.
 *
 * Control hooks:
 *   [data-control="layout|level|mapping|language"][data-value="..."]  -> option button
 *   <select data-control="...">                                       -> select variant
 *   [data-toggle="theme|fingerColors|highlightNext|restingMarkers"]   -> toggle button
 *   [data-accent="<hue>"]                                             -> accent swatch
 *   [data-i18n="<key>"]                                               -> label text
 *   [data-action="restart"]                                           -> restart button
 */
(function (root) {
  'use strict';

  function init(cfg) {
    const KEY = cfg.key || 'touchtype';
    const defaults = Object.assign({
      layout: 'qwerty', level: 'rest', mapping: 'direct', language: 'en',
      theme: 'light', accent: 255, fingerColors: false, highlightNext: true, restingMarkers: true,
      hwLayout: 'ansi'
    }, cfg.defaults || {});

    let conf = load();
    function load() {
      try { return Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY) || '{}')); }
      catch (e) { return Object.assign({}, defaults); }
    }
    function save() { try { localStorage.setItem(KEY, JSON.stringify(conf)); } catch (e) {} }

    // mapping is valid when it's a real, different layout from the target
    function mapVal() {
      return (conf.mapping && conf.mapping !== 'direct' && conf.mapping !== conf.layout) ? conf.mapping : null;
    }

    // ---- results overlay (shared, theme-token styled) ----
    const bestKey = function () { return conf.layout + ':' + conf.level; };
    function readBests() { return (conf.bests = conf.bests || {}); }
    function bestFor() { return readBests()[bestKey()] || 0; }

    const overlay = document.createElement('div');
    overlay.className = 'tt-results';
    overlay.innerHTML =
      '<div class="tt-results-card" role="dialog" aria-modal="true">' +
        '<div class="tt-r-head"><span class="tt-r-title"></span><span class="tt-r-ctx"></span></div>' +
        '<div class="tt-r-hero"><span class="tt-r-wpm">0</span><span class="tt-r-wpmlbl">wpm</span>' +
          '<span class="tt-r-best"></span></div>' +
        '<div class="tt-r-grid">' +
          '<div class="tt-r-cell"><span class="tt-r-v tt-r-acc">0%</span><span class="tt-r-k"></span></div>' +
          '<div class="tt-r-cell"><span class="tt-r-v tt-r-err">0</span><span class="tt-r-k"></span></div>' +
          '<div class="tt-r-cell"><span class="tt-r-v tt-r-time">00:00</span><span class="tt-r-k"></span></div>' +
          '<div class="tt-r-cell"><span class="tt-r-v tt-r-ks">0</span><span class="tt-r-k"></span></div>' +
        '</div>' +
        '<button class="tt-r-again" type="button"><span class="tt-r-againlbl"></span><kbd>⏎</kbd></button>' +
        '<span class="tt-r-hint"></span>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector('.tt-r-again').addEventListener('click', function () { engine.restart(); engine.focus(); });

    function showResults(d) {
      const t = root.TTi18n.get(conf.language);
      const prevBest = bestFor();
      const isBest = d.wpm > prevBest;
      if (isBest) { readBests()[bestKey()] = d.wpm; save(); }
      const shownBest = Math.max(prevBest, d.wpm);
      overlay.querySelector('.tt-r-title').textContent = t.resultTitle;
      const swName = (root.TTData.SW[conf.layout] || {}).name || conf.layout;
      overlay.querySelector('.tt-r-ctx').textContent = levelLabel() + ' · ' + swName;
      overlay.querySelector('.tt-r-wpm').textContent = d.wpm;
      overlay.querySelector('.tt-r-wpmlbl').textContent = t.wpm;
      const bestEl = overlay.querySelector('.tt-r-best');
      bestEl.textContent = isBest ? ('★ ' + t.best) : (t.best + ' ' + shownBest);
      bestEl.classList.toggle('is-new', isBest);
      overlay.querySelector('.tt-r-acc').textContent = d.accuracy + '%';
      overlay.querySelector('.tt-r-err').textContent = d.errors;
      overlay.querySelector('.tt-r-time').textContent = d.time;
      overlay.querySelector('.tt-r-ks').textContent = d.typed;
      overlay.querySelectorAll('.tt-r-k')[0].textContent = t.acc;
      overlay.querySelectorAll('.tt-r-k')[1].textContent = t.err;
      overlay.querySelectorAll('.tt-r-k')[2].textContent = t.time;
      overlay.querySelectorAll('.tt-r-k')[3].textContent = t.keystrokes;
      overlay.querySelector('.tt-r-againlbl').textContent = t.again;
      overlay.querySelector('.tt-r-hint').textContent = t.againKey;
      overlay.classList.add('open');
    }
    function hideResults() { overlay.classList.remove('open'); }

    const engine = root.TT.create({
      els: cfg.els,
      layout: conf.layout,
      level: conf.level,
      hwLayout: conf.hwLayout,
      mapFrom: mapVal(),
      onFinish: showResults,
      onReset: hideResults,
      options: { fingerColors: conf.fingerColors, highlightNext: conf.highlightNext, restingMarkers: conf.restingMarkers, numberRow: !!cfg.numberRow }
    });

    // ---- apply visual config ----
    function applyTheme() { document.documentElement.dataset.theme = conf.theme; }
    function applyAccent() { document.documentElement.style.setProperty('--accent-h', conf.accent); }
    function applyI18n() {
      const t = root.TTi18n.get(conf.language);
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        const k = el.getAttribute('data-i18n');
        if (t[k] != null) el.textContent = t[k];
      });
      document.documentElement.lang = conf.language;
      if (overlay.classList.contains('open')) hideResults();
    }
    // Resolve the display label for the current level (i18n → level def → raw id)
    function levelLabel() {
      var t = root.TTi18n.get(conf.language);
      var lvls = root.TTData.levelsFor(conf.layout);
      var lvl = lvls[conf.level];
      return t['lvl_' + conf.level] || (lvl && lvl.label) || conf.level;
    }

    // Rebuild level buttons from the current layout's registered levels
    function rebuildLevels() {
      var container = document.getElementById('levelopts');
      if (!container) return;
      container.innerHTML = '';
      var order = root.TTData.levelOrderFor(conf.layout);
      var levels = root.TTData.levelsFor(conf.layout);
      var t = root.TTi18n.get(conf.language);

      // If current level doesn't exist in new layout, switch to first
      if (!levels[conf.level] && order.length) {
        conf.level = order[0];
        engine.state.level = conf.level;
      }

      order.forEach(function (key) {
        var lvl = levels[key];
        var btn = document.createElement('button');
        btn.setAttribute('data-control', 'level');
        btn.setAttribute('data-value', key);
        var i18nKey = 'lvl_' + key;
        btn.setAttribute('data-i18n', i18nKey);
        btn.textContent = t[i18nKey] || lvl.label || key;
        container.appendChild(btn);
      });
    }

    // Populate every mapping <select> with Direct + each OTHER layout as a possible
    // physical input. Available for all target layouts (incl. QWERTY).
    function rebuildMapping() {
      const t = root.TTi18n.get(conf.language);
      const tmpl = t.mapfrom || 'From %s';
      document.querySelectorAll('select[data-control="mapping"]').forEach(function (sel) {
        sel.innerHTML = '';
        const o0 = document.createElement('option');
        o0.value = 'direct'; o0.textContent = t.direct || 'Direct';
        sel.appendChild(o0);
        Object.keys(root.TTData.SW).forEach(function (k) {
          if (k === conf.layout) return;
          const o = document.createElement('option');
          o.value = k; o.textContent = tmpl.replace('%s', root.TTData.SW[k].name);
          sel.appendChild(o);
        });
        if (conf.mapping === conf.layout) conf.mapping = 'direct';
        sel.value = conf.mapping;
      });
    }

    function reflect() {
      // option groups
      document.querySelectorAll('[data-control][data-value]').forEach(function (el) {
        const c = el.getAttribute('data-control');
        el.classList.toggle('is-active', String(conf[c]) === el.getAttribute('data-value'));
      });
      // selects
      document.querySelectorAll('select[data-control]').forEach(function (sel) {
        sel.value = conf[sel.getAttribute('data-control')];
        sel.dispatchEvent(new Event('tt-sync'));
      });
      // toggles
      document.querySelectorAll('[data-toggle]').forEach(function (el) {
        const k = el.getAttribute('data-toggle');
        const on = k === 'theme' ? conf.theme === 'dark' : !!conf[k];
        el.classList.toggle('is-on', on);
        el.setAttribute('aria-pressed', on);
      });
      // accent swatches
      document.querySelectorAll('[data-accent]').forEach(function (el) {
        el.classList.toggle('is-active', String(conf.accent) === el.getAttribute('data-accent'));
      });
    }

    function setControl(name, value) {
      conf[name] = value;
      if (name === 'layout') {
        if (conf.mapping === value) conf.mapping = 'direct';
        // Validate level exists in new layout before rebuild
        var newLevels = root.TTData.levelsFor(value);
        var newOrder  = root.TTData.levelOrderFor(value);
        if (!newLevels[conf.level] && newOrder.length) conf.level = newOrder[0];
        engine.state.level = conf.level;
        engine.setLayout(value); engine.setMapFrom(mapVal()); rebuildMapping(); rebuildLevels();
      }
      else if (name === 'level') engine.setLevel(value);
      else if (name === 'hwLayout') engine.setHwLayout(value);
      else if (name === 'mapping') engine.setMapFrom(mapVal());
      else if (name === 'language') { applyI18n(); rebuildMapping(); rebuildLevels(); }
      else if (name === 'theme') applyTheme();
      save(); reflect();
    }

    // ---- bind ----
    document.addEventListener('click', function (e) {
      const opt = e.target.closest('[data-control][data-value]');
      if (opt) { setControl(opt.getAttribute('data-control'), opt.getAttribute('data-value')); return; }

      const tg = e.target.closest('[data-toggle]');
      if (tg) {
        const k = tg.getAttribute('data-toggle');
        if (k === 'theme') { conf.theme = conf.theme === 'dark' ? 'light' : 'dark'; applyTheme(); }
        else { conf[k] = !conf[k]; engine.setOption(k, conf[k]); }
        save(); reflect(); return;
      }

      const sw = e.target.closest('[data-accent]');
      if (sw) { conf.accent = Number(sw.getAttribute('data-accent')); applyAccent(); save(); reflect(); return; }

      const act = e.target.closest('[data-action]');
      if (act && act.getAttribute('data-action') === 'restart') { engine.restart(); engine.focus(); }
    });

    document.addEventListener('change', function (e) {
      const sel = e.target.closest('select[data-control]');
      if (sel) setControl(sel.getAttribute('data-control'), sel.value);
    });

    applyTheme(); applyAccent(); applyI18n(); rebuildLevels(); rebuildMapping(); reflect();
    if (root.TTSelect) root.TTSelect.enhanceAll();
    engine.rebuild();
    return { engine: engine, conf: conf, levelLabel: levelLabel };
  }

  root.TTApp = { init: init };
})(window);
