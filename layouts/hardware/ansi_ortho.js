/* ANSI Ortholinear — same key set as ANSI but zero row stagger.
 * All rows align to the same left edge. Modifier keys kept for visual context. */
TTData.HW.ansi_ortho = {
  id: 'ansi_ortho',
  name: 'ANSI Ortholinear',
  rows: [
    { name: 'num', stagger: 0, keys: [
      { id: 'K_GRAVE',     finger: 'lp' },
      { id: 'K_1',         finger: 'lp' },
      { id: 'K_2',         finger: 'lr' },
      { id: 'K_3',         finger: 'lm' },
      { id: 'K_4',         finger: 'li' },
      { id: 'K_5',         finger: 'li' },
      { id: 'K_6',         finger: 'ri' },
      { id: 'K_7',         finger: 'ri' },
      { id: 'K_8',         finger: 'rm' },
      { id: 'K_9',         finger: 'rr' },
      { id: 'K_0',         finger: 'rp' },
      { id: 'K_MINUS',     finger: 'rp' },
      { id: 'K_EQUAL',     finger: 'rp' },
      { id: 'K_BACKSPACE', width: 2,    mod: true }
    ]},
    { name: 'top', stagger: 0.0, keys: [
      { id: 'K_TAB',       width: 1.5,  mod: true },
      { id: 'K_Q',         finger: 'lp' },
      { id: 'K_W',         finger: 'lr' },
      { id: 'K_E',         finger: 'lm' },
      { id: 'K_R',         finger: 'li' },
      { id: 'K_T',         finger: 'li' },
      { id: 'K_Y',         finger: 'ri' },
      { id: 'K_U',         finger: 'ri' },
      { id: 'K_I',         finger: 'rm' },
      { id: 'K_O',         finger: 'rr' },
      { id: 'K_P',         finger: 'rp' },
      { id: 'K_LBRACKET',  finger: 'rp' },
      { id: 'K_RBRACKET',  finger: 'rp' },
      { id: 'K_BACKSLASH', width: 1.5,  mod: true }
    ]},
    { name: 'home', stagger: 0.0, keys: [
      { id: 'K_CAPS',      width: 1.5, mod: true },
      { id: 'K_A',         finger: 'lp', resting: true },
      { id: 'K_S',         finger: 'lr', resting: true },
      { id: 'K_D',         finger: 'lm', resting: true },
      { id: 'K_F',         finger: 'li', resting: true },
      { id: 'K_G',         finger: 'li' },
      { id: 'K_H',         finger: 'ri' },
      { id: 'K_J',         finger: 'ri', resting: true },
      { id: 'K_K',         finger: 'rm', resting: true },
      { id: 'K_L',         finger: 'rr', resting: true },
      { id: 'K_SEMICOLON', finger: 'rp', resting: true },
      { id: 'K_QUOTE',     finger: 'rp' },
      { id: 'K_ENTER',     width: 2.5, mod: true }
    ]},
    { name: 'bottom', stagger: 0.0, keys: [
      { id: 'K_LSHIFT',    width: 1.5, mod: true },
      { id: 'K_Z',         finger: 'lp' },
      { id: 'K_X',         finger: 'lr' },
      { id: 'K_C',         finger: 'lm' },
      { id: 'K_V',         finger: 'li' },
      { id: 'K_B',         finger: 'li' },
      { id: 'K_N',         finger: 'ri' },
      { id: 'K_M',         finger: 'ri' },
      { id: 'K_COMMA',     finger: 'rm' },
      { id: 'K_PERIOD',    finger: 'rr' },
      { id: 'K_SLASH',     finger: 'rp' },
      { id: 'K_RSHIFT',    width: 3.5, mod: true }
    ]},
    { name: 'space', stagger: 0.0, keys: [
      { id: 'K_LCTRL',  width: 1.25, mod: true },
      { id: 'K_LMETA',  width: 1.25, mod: true },
      { id: 'K_LALT',   width: 1.25, mod: true },
      { id: 'K_SPACE',  width: 6.25, finger: 'th' },
      { id: 'K_RALT',   width: 1.25, mod: true },
      { id: 'K_FN',     width: 1.25, mod: true },
      { id: 'K_RMETA',  width: 1.25, mod: true },
      { id: 'K_RCTRL',  width: 1.25, mod: true }
    ]}
  ]
};
