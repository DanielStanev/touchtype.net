/* touchtype — shared data layer
 * Hardware layouts live in layouts/hardware/*.js and register into TTData.HW.
 * Software layouts live in layouts/software/*.js and register into TTData.SW.
 * This file sets up the registries and provides the shared helpers.
 */
(function (root) {
  'use strict';

  // Populated by layout files loaded after this script
  const HW = {};
  const SW = {};

  // Levels reference hardware key IDs (K_*) so they work across any software layout
  const LEVELS = {
    rest: {
      label: 'Resting keys',
      hint: 'The 8 home-row resting keys',
      ids: ['K_A', 'K_S', 'K_D', 'K_F', 'K_J', 'K_K', 'K_L', 'K_SEMICOLON']
    },
    home: {
      label: 'Home row',
      hint: 'The entire home row',
      ids: ['K_A', 'K_S', 'K_D', 'K_F', 'K_G', 'K_H', 'K_J', 'K_K', 'K_L', 'K_SEMICOLON']
    },
    home_index: {
      label: 'Home + index reach',
      hint: 'Home row plus index-finger reaches',
      ids: ['K_A', 'K_S', 'K_D', 'K_F', 'K_G', 'K_H', 'K_J', 'K_K', 'K_L', 'K_SEMICOLON',
            'K_R', 'K_T', 'K_Y', 'K_U', 'K_V', 'K_B', 'K_N', 'K_M']
    },
    alpha: {
      label: 'Full alphabet',
      hint: 'Every letter',
      rule: function (ch) { return /^[a-z]$/.test(ch); }
    },
    alpha_punct: {
      label: 'Alphabet + punctuation',
      hint: 'Letters and common punctuation',
      rule: function (ch) { return /^[a-z]$/.test(ch) || ",.;'/-".indexOf(ch) !== -1; }
    }
  };

  const LEVEL_ORDER = ['rest', 'home', 'home_index', 'alpha', 'alpha_punct'];

  function charFor(hwId, swKey) {
    const sw = SW[swKey];
    if (!sw) return hwId;
    return (sw.map[hwId] !== undefined) ? sw.map[hwId] : hwId;
  }

  // All trainable (non-mod, non-gap) key IDs from a hardware layout
  function trainableIds(hwKey) {
    const hw = HW[hwKey || 'ansi'];
    if (!hw) return [];
    const out = [];
    hw.rows.forEach(function (row) {
      row.keys.forEach(function (k) {
        if (!k.gap && !k.mod && k.id) out.push(k.id);
      });
    });
    return out;
  }

  function activeIds(levelKey, swKey, hwKey) {
    const lvl = LEVELS[levelKey];
    if (lvl.ids) return lvl.ids.slice();
    const out = [];
    trainableIds(hwKey).forEach(function (id) {
      if (lvl.rule(charFor(id, swKey))) out.push(id);
    });
    return out;
  }

  function activeChars(levelKey, swKey, hwKey) {
    return activeIds(levelKey, swKey, hwKey).map(function (id) { return charFor(id, swKey); });
  }

  // ---- word generation -------------------------------------------------------
  const WORDS = ('the of and to in is you that it he was for on are as with his they at be this ' +
    'have from or one had by word but not what all were we when your can said there use an each ' +
    'which she do how their if will up other about out many then them these so some her would make ' +
    'like him into time has look two more write go see number no way could people my than first water ' +
    'been call who oil its now find long down day did get come made may part over new sound take only ' +
    'little work know place year live me back give most very after thing our just name good sentence man ' +
    'think say great where help through much before line right too mean old any same tell boy follow came ' +
    'want show also around form three small set put end does another well large must big even such because')
    .split(' ');

  function rng(seed) {
    let s = seed || (Date.now() % 2147483647);
    return function () { s = (s * 48271) % 2147483647; return (s - 1) / 2147483646; };
  }

  function generate(levelKey, swKey, count, seed, hwKey) {
    count = count || 60;
    const rand = rng(seed);
    const chars = activeChars(levelKey, swKey, hwKey);
    const letters = chars.filter(function (c) { return /^[a-z]$/.test(c); });
    const puncts  = chars.filter(function (c) { return !/^[a-z]$/.test(c); });
    const out = [];

    if (levelKey === 'alpha' || levelKey === 'alpha_punct') {
      const set = {};
      letters.forEach(function (c) { set[c] = true; });
      const ok = WORDS.filter(function (w) {
        for (let i = 0; i < w.length; i++) if (!set[w[i]]) return false;
        return true;
      });
      const pool = ok.length > 8 ? ok : WORDS;
      for (let i = 0; i < count; i++) {
        let w = pool[Math.floor(rand() * pool.length)];
        if (levelKey === 'alpha_punct' && puncts.length && rand() < 0.18)
          w += puncts[Math.floor(rand() * puncts.length)];
        out.push(w);
      }
      return out;
    }

    const src = chars.length ? chars : ['a', 's', 'd', 'f'];
    for (let i = 0; i < count; i++) {
      const len = 2 + Math.floor(rand() * 4);
      let w = '';
      for (let j = 0; j < len; j++) w += src[Math.floor(rand() * src.length)];
      out.push(w);
    }
    return out;
  }

  root.TTData = {
    HW: HW,
    SW: SW,
    LEVELS: LEVELS,
    LEVEL_ORDER: LEVEL_ORDER,
    charFor: charFor,
    trainableIds: trainableIds,
    activeIds: activeIds,
    activeChars: activeChars,
    generate: generate
  };
})(window);
