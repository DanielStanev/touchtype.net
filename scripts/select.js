/* touchtype — custom dropdown. Progressive-enhances any <select data-control>
 * into a styled trigger + menu, keeping the native <select> in the DOM as the
 * source of truth (app.js reads/writes its value and dispatches change). The
 * trigger inherits the direction's select classes so it matches the skin. */
(function (root) {
  'use strict';

  function enhance(sel) {
    if (sel.__tt) return; sel.__tt = true;

    const origClasses = sel.className;          // e.g. "fld" / "sel" / "q"
    const wrap = document.createElement('div');
    wrap.className = 'tt-select';
    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(sel);
    sel.classList.add('tt-native');
    sel.tabIndex = -1;

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = (origClasses + ' tt-trigger').trim();
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = '<span class="tt-trigger-label"></span>' +
      '<svg class="tt-chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 6.5 8 10.5 12 6.5"/></svg>';
    wrap.appendChild(trigger);

    const menu = document.createElement('div');
    menu.className = 'tt-menu';
    menu.setAttribute('role', 'listbox');
    wrap.appendChild(menu);

    function label() { const o = sel.options[sel.selectedIndex]; trigger.querySelector('.tt-trigger-label').textContent = o ? o.textContent : ''; }

    function buildMenu() {
      menu.innerHTML = '';
      [].forEach.call(sel.options, function (opt) {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'tt-option' + (opt.value === sel.value ? ' is-sel' : '');
        item.dataset.value = opt.value;
        item.setAttribute('role', 'option');
        item.innerHTML = '<span class="tt-opt-label"></span>';
        item.querySelector('.tt-opt-label').textContent = opt.textContent;
        item.addEventListener('click', function (e) {
          e.stopPropagation();
          if (sel.value !== opt.value) { sel.value = opt.value; sel.dispatchEvent(new Event('change', { bubbles: true })); }
          label(); close(); trigger.focus();
        });
        menu.appendChild(item);
      });
    }

    let activeIdx = -1;
    function items() { return [].slice.call(menu.children); }
    function setActive(i) {
      const it = items(); if (!it.length) return;
      activeIdx = (i + it.length) % it.length;
      it.forEach(function (x, k) { x.classList.toggle('is-active', k === activeIdx); });
      it[activeIdx].scrollIntoView ? it[activeIdx].scrollIntoView({ block: 'nearest' }) : 0;
    }

    function open() {
      buildMenu(); wrap.classList.add('open'); trigger.setAttribute('aria-expanded', 'true');
      // flip up if there isn't room below
      menu.classList.remove('tt-menu--up');
      const r = trigger.getBoundingClientRect();
      const mh = menu.offsetHeight;
      if (r.bottom + 8 + mh > window.innerHeight && r.top - 8 - mh > 0) menu.classList.add('tt-menu--up');
      const cur = items().findIndex(function (x) { return x.classList.contains('is-sel'); });
      activeIdx = cur; if (cur >= 0) items()[cur].classList.add('is-active');
      document.addEventListener('mousedown', outside, true);
    }
    function close() {
      wrap.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false');
      document.removeEventListener('mousedown', outside, true);
    }
    function outside(e) { if (!wrap.contains(e.target)) close(); }

    trigger.addEventListener('click', function (e) { e.stopPropagation(); wrap.classList.contains('open') ? close() : open(); });
    trigger.addEventListener('keydown', function (e) {
      const isOpen = wrap.classList.contains('open');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (!isOpen) { open(); } else { setActive(activeIdx + (e.key === 'ArrowDown' ? 1 : -1)); } }
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!isOpen) open();
        else if (activeIdx >= 0) items()[activeIdx].click();
      }
      else if (e.key === 'Escape') { if (isOpen) { e.preventDefault(); close(); } }
    });

    // stay in sync when app.js rewrites options or sets value programmatically
    sel.addEventListener('change', label);
    sel.addEventListener('tt-sync', label);
    new MutationObserver(label).observe(sel, { childList: true });
    label();
  }

  root.TTSelect = {
    enhanceAll: function () { document.querySelectorAll('select[data-control]').forEach(enhance); }
  };
})(window);
