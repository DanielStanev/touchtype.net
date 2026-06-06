# touchtype

A fast, dependency-free touch-typing trainer. Raw HTML, CSS, and vanilla JS.

## Structure

```
touchtype/
  index.html          The page + markup. Settings controls and the typing area.
  styles/
    base.css          Theme tokens (light/dark), the character stream + caret,
                      the keyboard diagram, the custom dropdown, the results card.
    main.css          The "Foliosole" skin: rail, stat bar, fonts, keyboard look.
  scripts/
    data.js           Keyboard layouts, finger map, levels, word/drill generation.
    i18n.js           UI strings per display language.
    engine.js         Typing engine: caret flow, stats, keyboard rendering, remap.
    select.js         Custom dropdown component (enhances <select data-control>).
    app.js            Wires markup -> engine, persistence, theme/accent/language.
```

