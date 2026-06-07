/* touchtype — shared UI strings for the "display language" setting.
 * Covers chrome only; the practice text is key-drills, not prose. */
(function (root) {
  'use strict';
  const STR = {
    en: { lang: 'English', tagline: 'Practice touch typing.', wpm: 'wpm', acc: 'accuracy', err: 'errors', time: 'time',
      settings: 'Settings', layout: 'Layout', level: 'Level', mapping: 'Input mapping', language: 'Display Language', theme: 'Theme',
      accent: 'Accent', fingers: 'Finger zones', nextkey: 'Next key', resting: 'Resting marks', light: 'Light', dark: 'Dark',
      direct: 'Direct', mapq: 'Map from QWERTY', mapfrom: 'From %s', restart: 'Restart', focusPrompt: 'Click here to start typing',
      done: 'Finished — press Enter to go again', resultTitle: 'Session complete', again: 'Type again', againKey: 'press Enter to type again', best: 'best', gross: 'gross wpm', keystrokes: 'keystrokes',
      lvl_rest: 'Resting keys', lvl_home: 'Home row', lvl_home_erui: 'Home + E, R, U, I', lvl_home_index: 'Home + index', lvl_home_extend_1: 'Home + C, F, K, L, M, P, R, V', lvl_home_extend_2: 'Home + B, G, J, Q, W, X, Y, Z', lvl_home_eisk: 'Home + Е, И, С, К', lvl_home_eriu: 'Home + Е, Р, И, У', lvl_home_ext: 'Home + Ъ, П, Р', lvl_home_czhmc: 'Home + Ц, Ж, М, Ч', lvl_center: 'Center keys', lvl_alpha: 'Alphabet', lvl_alpha_punct: 'Alphabet + punctuation' },
    bg: { lang: 'Български', tagline: 'Практикувай сляпо писане.', wpm: 'думи/минута', acc: 'точност', err: 'грешки', time: 'време',
      settings: 'Настройки', layout: 'Наредба', level: 'Ниво', mapping: 'Входно съответствие', language: 'Език', theme: 'Тема',
      accent: 'Акцент', fingers: 'Зони на пръстите', nextkey: 'Следващ клавиш', resting: 'Позиции за покой', light: 'Светла', dark: 'Тъмна',
      direct: 'Директно', mapq: 'Карта от QWERTY', mapfrom: 'От %s', restart: 'Начало', focusPrompt: 'Натисни тук, за да започнеш',
      done: 'Готово — натисни Enter за нов опит', resultTitle: 'Сесията завърши', again: 'Пак', againKey: 'натисни Enter за нов опит', best: 'най-добро', gross: 'думи/минута бруто', keystrokes: 'удара',
      lvl_rest: 'Клавиши за покой', lvl_home: 'Домашен ред', lvl_home_erui: 'Домашен + Е, Р, У, И', lvl_home_index: 'Домашен + показалец', lvl_home_extend_1: 'Домашен + C, F, K, L, M, P, R, V', lvl_home_extend_2: 'Домашен + B, G, J, Q, W, X, Y, Z', lvl_home_eisk: 'Домашен + Е, И, С, К', lvl_home_eriu: 'Домашен + Е, Р, И, У', lvl_home_ext: 'Домашен + Ъ, П, Р', lvl_home_czhmc: 'Домашен + Ц, Ж, М, Ч', lvl_center: 'Централни клавиши', lvl_alpha: 'Азбука', lvl_alpha_punct: 'Азбука + препинателни знаци' }
  };
  root.TTi18n = {
    langs: ['en', 'bg'],
    get: function (l) { return STR[l] || STR.en; }
  };
})(window);
