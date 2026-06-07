/* Ergodox — columnar split layout, no row stagger.
 * Each row has a { gap: N } entry between the left and right halves.
 * The gap width represents the physical separation between the two keyboard halves.
 * Mod keys on the outer edges keep columns vertically aligned (6 left + 7 right).
 * The thumb cluster is represented by two space keys. */
TTData.HW.ergodox = {
  id: 'ergodox',
  name: 'Ergodox',
  rows: [
    { name: 'num', stagger: 0, keys: [
      { id: 'K_GRAVE',     finger: 'lp' },
      { id: 'K_1',         finger: 'lp' },
      { id: 'K_2',         finger: 'lr' },
      { id: 'K_3',         finger: 'lm' },
      { id: 'K_4',         finger: 'li' },
      { id: 'K_5',         finger: 'li' },
      { gap: 2 },
      { id: 'K_6',         finger: 'ri' },
      { id: 'K_7',         finger: 'ri' },
      { id: 'K_8',         finger: 'rm' },
      { id: 'K_9',         finger: 'rr' },
      { id: 'K_0',         finger: 'rp' },
      { id: 'K_MINUS',     finger: 'rp' },
      { id: 'K_EQUAL',     finger: 'rp' }
    ]},
    { name: 'top', stagger: 0, keys: [
      { id: 'K_TAB',       mod: true },
      { id: 'K_Q',         finger: 'lp' },
      { id: 'K_W',         finger: 'lr' },
      { id: 'K_E',         finger: 'lm' },
      { id: 'K_R',         finger: 'li' },
      { id: 'K_T',         finger: 'li' },
      { gap: 2 },
      { id: 'K_Y',         finger: 'ri' },
      { id: 'K_U',         finger: 'ri' },
      { id: 'K_I',         finger: 'rm' },
      { id: 'K_O',         finger: 'rr' },
      { id: 'K_P',         finger: 'rp' },
      { id: 'K_LBRACKET',  finger: 'rp' },
      { id: 'K_RBRACKET',  finger: 'rp' }
    ]},
    { name: 'home', stagger: 0, keys: [
      { id: 'K_ESC',       mod: true },
      { id: 'K_A',         finger: 'lp', resting: true },
      { id: 'K_S',         finger: 'lr', resting: true },
      { id: 'K_D',         finger: 'lm', resting: true },
      { id: 'K_F',         finger: 'li', resting: true },
      { id: 'K_G',         finger: 'li' },
      { gap: 2 },
      { id: 'K_H',         finger: 'ri' },
      { id: 'K_J',         finger: 'ri', resting: true },
      { id: 'K_K',         finger: 'rm', resting: true },
      { id: 'K_L',         finger: 'rr', resting: true },
      { id: 'K_SEMICOLON', finger: 'rp', resting: true },
      { id: 'K_QUOTE',     finger: 'rp' },
      { id: 'K_ENTER',     mod: true }
    ]},
    { name: 'bottom', stagger: 0, keys: [
      { id: 'K_LSHIFT',    mod: true },
      { id: 'K_Z',         finger: 'lp' },
      { id: 'K_X',         finger: 'lr' },
      { id: 'K_C',         finger: 'lm' },
      { id: 'K_V',         finger: 'li' },
      { id: 'K_B',         finger: 'li' },
      { gap: 2 },
      { id: 'K_N',         finger: 'ri' },
      { id: 'K_M',         finger: 'ri' },
      { id: 'K_COMMA',     finger: 'rm' },
      { id: 'K_PERIOD',    finger: 'rr' },
      { id: 'K_SLASH',     finger: 'rp' },
      { id: 'K_BACKSLASH', finger: 'rp' },
      { id: 'K_RSHIFT',    mod: true }
    ]},
    // Thumb cluster: one space key per half
    { name: 'space', stagger: 0, keys: [
      { id: 'K_SPACE',     width: 4,    finger: 'th' },
      { gap: 2 },
      { id: 'K_SPACE_R',   width: 4,    finger: 'th', mod: true }
    ]}
  ]
};
