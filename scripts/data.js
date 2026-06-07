/* touchtype — shared data layer
 * Hardware layouts live in layouts/hardware/*.js and register into TTData.HW.
 * Software layouts live in layouts/software/<name>/layout.js → TTData.SW.
 * Levels live in layouts/software/<name>/<nn>_<id>.js → TTData.addLevel().
 * This file sets up the registries and provides the shared helpers.
 */
(function (root) {
  'use strict';

  // Populated by layout files loaded after this script
  const HW = {};
  const SW = {};

  // Per-layout levels: { layoutId: { levels: { id: def }, order: [id …] } }
  const SW_LEVELS = {};

  function addLevel(layoutId, def) {
    if (!SW_LEVELS[layoutId]) SW_LEVELS[layoutId] = { levels: {}, order: [] };
    SW_LEVELS[layoutId].levels[def.id] = def;
    const arr = SW_LEVELS[layoutId].order;
    if (arr.indexOf(def.id) === -1) arr.push(def.id);
    arr.sort(function (a, b) {
      return (SW_LEVELS[layoutId].levels[a].order || 0) -
             (SW_LEVELS[layoutId].levels[b].order || 0);
    });
  }

  function levelsFor(layoutId) {
    var entry = SW_LEVELS[layoutId];
    return entry ? entry.levels : {};
  }

  function levelOrderFor(layoutId) {
    var entry = SW_LEVELS[layoutId];
    return entry ? entry.order : [];
  }

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
    const lvls = levelsFor(swKey);
    const lvl = lvls[levelKey];
    if (!lvl) return [];
    if (lvl.ids) return lvl.ids.slice();
    if (lvl.rule) {
      const out = [];
      trainableIds(hwKey).forEach(function (id) {
        if (lvl.rule(charFor(id, swKey))) out.push(id);
      });
      return out;
    }
    return [];
  }

  function activeChars(levelKey, swKey, hwKey) {
    return activeIds(levelKey, swKey, hwKey).map(function (id) { return charFor(id, swKey); });
  }

  // ---- word generation -------------------------------------------------------
  function rng(seed) {
    let s = seed || (Date.now() % 2147483647);
    return function () { s = (s * 48271) % 2147483647; return (s - 1) / 2147483646; };
  }

  function shuffle(arr, rand) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function generate(levelKey, swKey, count, seed, hwKey) {
    count = count || 100;
    const rand = rng(seed);
    const lvls = levelsFor(swKey);
    const lvl = lvls[levelKey];

    // Word bank: shuffle and loop until we reach count
    if (lvl && lvl.wordBank && lvl.wordBank.length) {
      const out = [];
      while (out.length < count) {
        const batch = lvl.wordBank.slice();
        shuffle(batch, rand);
        for (let i = 0; i < batch.length && out.length < count; i++) {
          out.push(batch[i]);
        }
      }
      return out;
    }

    // Fallback: random character sequences from the active key set
    const chars = activeChars(levelKey, swKey, hwKey);
    const src = chars.length ? chars : ['a', 's', 'd', 'f'];
    const out = [];
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
    SW_LEVELS: SW_LEVELS,
    addLevel: addLevel,
    levelsFor: levelsFor,
    levelOrderFor: levelOrderFor,
    charFor: charFor,
    trainableIds: trainableIds,
    activeIds: activeIds,
    activeChars: activeChars,
    generate: generate
  };
})(window);
