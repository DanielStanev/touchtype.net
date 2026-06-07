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
      lvl_rest: 'Resting keys', lvl_home: 'Home row', lvl_home_erui: 'Home + E, R, U, I', lvl_home_index: 'Home + index', lvl_home_extend_1: 'Home + C, F, K, L, M, P, R, V', lvl_home_extend_2: 'Home + B, G, J, Q, W, X, Y, Z', lvl_alpha: 'Alphabet', lvl_alpha_punct: 'Alphabet + punctuation' },
    es: { lang: 'Español', tagline: 'Practica mecanografía.', wpm: 'ppm', acc: 'precisión', err: 'errores', time: 'tiempo',
      settings: 'Ajustes', layout: 'Distribución', level: 'Nivel', mapping: 'Mapeo de entrada', language: 'Idioma', theme: 'Tema',
      accent: 'Acento', fingers: 'Zonas de dedos', nextkey: 'Próxima tecla', resting: 'Marcas de reposo', light: 'Claro', dark: 'Oscuro',
      direct: 'Directo', mapq: 'Mapear desde QWERTY', mapfrom: 'Desde %s', restart: 'Reiniciar', focusPrompt: 'Haz clic aquí para empezar',
      done: 'Terminado — pulsa Enter para repetir', resultTitle: 'Sesión completa', again: 'Repetir', againKey: 'pulsa Enter para repetir', best: 'mejor', gross: 'ppm bruto', keystrokes: 'pulsaciones',
      lvl_rest: 'Teclas de reposo', lvl_home: 'Fila central', lvl_home_erui: 'Central + E, R, U, I', lvl_home_index: 'Central + índice', lvl_home_extend_1: 'Central + C, F, K, L, M, P, R, V', lvl_home_extend_2: 'Central + B, G, J, Q, W, X, Y, Z', lvl_alpha: 'Alfabeto', lvl_alpha_punct: 'Alfabeto + puntuación' },
    fr: { lang: 'Français', tagline: 'Entraînez-vous à la dactylographie.', wpm: 'mpm', acc: 'précision', err: 'erreurs', time: 'temps',
      settings: 'Réglages', layout: 'Disposition', level: 'Niveau', mapping: 'Mappage', language: 'Langue', theme: 'Thème',
      accent: 'Accent', fingers: 'Zones de doigts', nextkey: 'Touche suivante', resting: 'Repères', light: 'Clair', dark: 'Sombre',
      direct: 'Direct', mapq: 'Mapper depuis QWERTY', mapfrom: 'Depuis %s', restart: 'Recommencer', focusPrompt: 'Cliquez ici pour commencer',
      done: 'Terminé — appuyez sur Entrée pour recommencer', resultTitle: 'Session terminée', again: 'Recommencer', againKey: 'Entrée pour recommencer', best: 'record', gross: 'mpm brut', keystrokes: 'frappes',
      lvl_rest: 'Touches de repos', lvl_home: 'Rangée de repos', lvl_home_erui: 'Repos + E, R, U, I', lvl_home_index: 'Repos + index', lvl_home_extend_1: 'Repos + C, F, K, L, M, P, R, V', lvl_home_extend_2: 'Repos + B, G, J, Q, W, X, Y, Z', lvl_alpha: 'Alphabet', lvl_alpha_punct: 'Alphabet + ponctuation' },
    de: { lang: 'Deutsch', tagline: 'Übe das Zehnfingersystem.', wpm: 'WpM', acc: 'Genauigkeit', err: 'Fehler', time: 'Zeit',
      settings: 'Einstellungen', layout: 'Layout', level: 'Stufe', mapping: 'Eingabe-Mapping', language: 'Sprache', theme: 'Thema',
      accent: 'Akzent', fingers: 'Fingerzonen', nextkey: 'Nächste Taste', resting: 'Ruhemarken', light: 'Hell', dark: 'Dunkel',
      direct: 'Direkt', mapq: 'Von QWERTZ abbilden', mapfrom: 'Von %s', restart: 'Neustart', focusPrompt: 'Hier klicken zum Tippen',
      done: 'Fertig — Enter für neue Runde', resultTitle: 'Sitzung beendet', again: 'Nochmal', againKey: 'Enter für neue Runde', best: 'Bestwert', gross: 'Brutto-WpM', keystrokes: 'Anschläge',
      lvl_rest: 'Ruhetasten', lvl_home: 'Grundreihe', lvl_home_erui: 'Grundreihe + E, R, U, I', lvl_home_index: 'Grundreihe + Zeigefinger', lvl_home_extend_1: 'Grundreihe + C, F, K, L, M, P, R, V', lvl_home_extend_2: 'Grundreihe + B, G, J, Q, W, X, Y, Z', lvl_alpha: 'Alphabet', lvl_alpha_punct: 'Alphabet + Satzzeichen' },
    ja: { lang: '日本語', tagline: 'タッチタイピングの練習。', wpm: 'WPM', acc: '正確さ', err: 'ミス', time: '時間',
      settings: '設定', layout: '配列', level: 'レベル', mapping: '入力マッピング', language: '言語', theme: 'テーマ',
      accent: 'アクセント', fingers: '指のゾーン', nextkey: '次のキー', resting: 'ホーム位置', light: 'ライト', dark: 'ダーク',
      direct: 'そのまま', mapq: 'QWERTYから変換', mapfrom: '%s から', restart: 'やり直す', focusPrompt: 'クリックして開始',
      done: '完了 — Enterでもう一度', resultTitle: 'セッション完了', again: 'もう一度', againKey: 'Enterでもう一度', best: 'ベスト', gross: '総合WPM', keystrokes: '打鍵数',
      lvl_rest: 'ホームの定位置', lvl_home: 'ホーム行', lvl_home_erui: 'ホーム＋E, R, U, I', lvl_home_index: 'ホーム＋人差し指', lvl_home_extend_1: 'ホーム＋C, F, K, L, M, P, R, V', lvl_home_extend_2: 'ホーム＋B, G, J, Q, W, X, Y, Z', lvl_alpha: 'アルファベット', lvl_alpha_punct: 'アルファベット＋記号' }
  };
  root.TTi18n = {
    langs: ['en', 'es', 'fr', 'de', 'ja'],
    get: function (l) { return STR[l] || STR.en; }
  };
})(window);
