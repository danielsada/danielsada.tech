/* Breeze Plasma theme: progressive enhancement only. Without JS every link is a real page. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var fill = function (s, v) { return String(s).replace('%s', v).replace('%d', v); };

  /* Move focus to an in-page target (heading / year group); scroll-padding clears the sticky top bar */
  function focusTarget(el) {
    if (!el) return;
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    el.scrollIntoView();
  }

  /* Mobile drawer: one tap opens, Esc/scrim/× closes, focus trapped, rest of page inert */
  var panel = $('#panel'), opener = $('[data-open]'), scrim = $('.scrim'), closer = $('.panel__close');
  if (panel && opener && scrim && closer) {
    var mq = matchMedia('(max-width: 999px)');
    var behind = [$('main'), $('.topbar'), $('.skip'), $('.progress')].filter(Boolean);
    var isOpen = function () { return panel.classList.contains('open'); };
    var setPanel = function (open, keepFocus) {
      panel.classList.toggle('open', open);
      scrim.hidden = !open;
      document.body.classList.toggle('panel-open', open);
      opener.setAttribute('aria-expanded', String(open));
      behind.forEach(function (el) { el.inert = open; });
      if (open) closer.focus(); else if (!keepFocus) opener.focus();
    };
    opener.addEventListener('click', function () { setPanel(true); });
    $$('[data-close]').forEach(function (b) { b.addEventListener('click', function () { setPanel(false); }); });
    panel.addEventListener('click', function (e) { if (isOpen() && e.target.closest('a')) setPanel(false, true); });
    document.addEventListener('keydown', function (e) {
      if (!isOpen()) return;
      if (e.key === 'Escape') { setPanel(false); return; }
      if (e.key !== 'Tab') return;
      var f = $$('a[href], button, summary', panel).filter(function (el) { return el.offsetParent; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    mq.addEventListener('change', function () { if (!mq.matches && isOpen()) setPanel(false, true); });
    /* the drawer has no outline, so the Projects box needn't start collapsed there */
    var pproj = $('.pproj', panel);
    if (pproj && mq.matches) pproj.open = true;
  }

  /* Archive window. Filters: all · s:<section> · series:<slug> · tag:<slug> · year:<yyyy>.
     data-base is what the page itself lists (the archive lists "all"; a section, series or tag page lists itself).
     data-local="all": every Show row filters in place, with state in the URL hash (#s=blog, #series=x, #tag=x, #y2025),
     so reload, back/forward and deep links work. data-local="years": only years filter in place; other rows are real links. */
  var win = $('.win[data-base]'), input = win && $('#search', win);
  if (win && input) {
    var I = {};
    try { I = JSON.parse(win.getAttribute('data-i18n')) || {}; } catch (e) { /* keep defaults */ }
    var base = win.getAttribute('data-base'), allLocal = win.getAttribute('data-local') === 'all';
    var rows = $$('.posts tbody tr:not(.yr)', win), groups = $$('.posts tbody', win);
    var links = $$('.show [data-f]', win), tagRow = $('#tagrow', win), tagLink = tagRow && $('a', tagRow), sel = $('#show-sel', win);
    var status = $('#status', win), clearBtn = $('#clear', win), empty = $('#empty', win);
    var crumbBase = $('#crumb-base', win), crumb = $('#crumb-f', win);
    var head = $('#list-h', win), sub = $('#list-sub', win), subBase = sub ? sub.innerHTML : '';
    var baseLabel = head.textContent, siteTitle = I.site || '', sep = I.sep || ' \u00b7 ';
    var label = {};
    links.forEach(function (a) { if (a.dataset.label) label[a.dataset.f] = a.dataset.label; });
    var hay = rows.map(function (r) { return (r.textContent + ' ' + (r.dataset.tags || '')).toLowerCase(); });
    var filter = base;
    var kind = function (f) { return f.slice(0, f.indexOf(':')); };
    var val = function (f) { return f.slice(f.indexOf(':') + 1); };
    var has = function (list, v) { return (' ' + (list || '') + ' ').indexOf(' ' + v + ' ') > -1; };
    var local = function (f) { return allLocal || f === base || kind(f) === 'year'; };
    var plural = function (n) { return fill(n === 1 ? I.post : I.posts, n); };
    var match = function (r) {
      if (filter === base) return true;
      var k = kind(filter), v = val(filter);
      if (k === 'year') return r.parentNode.dataset.year === v;
      if (k === 'tag') return has(r.dataset.tags, v);
      if (k === 's') return r.dataset.s === v;
      if (k === 'series') return has(r.dataset.series, v);
      return true;
    };
    var tagName = function (slug) {
      var sel = '[data-f="tag:' + (window.CSS && CSS.escape ? CSS.escape(slug) : slug) + '"]';
      var a = $('.show li:not(#tagrow) a' + sel, win) || $('td.tg a' + sel, win);
      return a ? (a.dataset.label || a.textContent) : slug;
    };
    var labelFor = function (f) {
      var k = kind(f), v = val(f);
      if (f === base) return baseLabel;
      if (k === 'year') return allLocal && base === 'all' ? fill(I.postsFrom, v) : baseLabel + ' \u00b7 ' + v;
      if (k === 'tag') return fill(I.taggedTitle, tagName(v));
      return label[f] || baseLabel;
    };
    var hashFor = function (f) {
      if (f === base) return '';
      var k = kind(f), v = val(f);
      return k === 'year' ? 'y' + v : k + '=' + encodeURIComponent(v);
    };
    var apply = function () {
      var q = input.value.trim(), terms = q.toLowerCase().split(/\s+/).filter(Boolean), n = 0;
      var tag = kind(filter) === 'tag' ? val(filter) : '';
      rows.forEach(function (r, i) {
        var ok = match(r) && terms.every(function (t) { return hay[i].indexOf(t) > -1; });
        r.hidden = !ok; if (ok) n++;
        /* reveal a tucked-away tag when it is the reason the row matches */
        $$('td.tg .x', r).forEach(function (x) {
          var a = $('a', x), t = a ? a.dataset.f.slice(4) : '', txt = x.textContent.toLowerCase();
          x.classList.toggle('hit', !!ok && (t === tag || terms.some(function (w) { return txt.indexOf(w) > -1; })));
        });
      });
      groups.forEach(function (g) {
        var v = $$('tr:not(.yr)', g).filter(function (r) { return !r.hidden; }).length;
        g.hidden = !v;
        var c = $('.yr small', g); if (c) c.textContent = plural(v);
      });
      var parts = [], k = kind(filter), v = val(filter);
      if (filter !== base) parts.push(k === 'tag' ? fill(I.tagged, tagName(v)) : k === 'year' ? fill(I.from, v) : labelFor(filter));
      if (terms.length) parts.push(fill(I.matching, q));
      /* a count only when something narrows the list */
      status.textContent = parts.length ? plural(n) + ' \u00b7 ' + parts.join(' \u00b7 ') : I.order;
      if (sub) sub.innerHTML = parts.length ? plural(n) : subBase;
      win.classList.toggle('is-filtered', parts.length > 0);
      clearBtn.hidden = !parts.length;
      empty.hidden = n > 0;
    };
    var setFilter = function (f, push) {
      filter = f;
      var k = kind(f), v = val(f), known = links.some(function (a) { return a !== tagLink && a.dataset.f === f; });
      var extra = k === 'tag' && !known;
      if (tagRow) {
        tagRow.hidden = !extra;
        if (extra) {
          tagLink.dataset.f = f;
          tagLink.href = '#tag=' + encodeURIComponent(v);
          $('.lbl', tagLink).textContent = tagName(v);
          $('.n', tagLink).textContent = rows.filter(function (r) { return has(r.dataset.tags, v); }).length;
        }
      }
      links.forEach(function (a) { if (a.dataset.f === f) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      if (sel) {
        var dyn = $('#opt-dyn', win);
        if (extra) {
          if (!dyn) { dyn = document.createElement('option'); dyn.id = 'opt-dyn'; var g = $('#sel-tags', win); if (g) g.prepend(dyn); }
          dyn.value = f; dyn.textContent = tagName(v);
        } else if (dyn) dyn.remove();
        sel.value = f;
      }
      var text = labelFor(f);
      head.textContent = text;
      document.title = text + (siteTitle ? sep + siteTitle : '');
      if (crumb) {
        crumb.hidden = f === base;
        $('span', crumb).textContent = k === 'year' ? v : k === 'tag' ? tagName(v) : text;
        if (crumbBase) { if (f === base) crumbBase.setAttribute('aria-current', 'page'); else crumbBase.removeAttribute('aria-current'); }
      }
      if (push) {
        var h = hashFor(f);
        history.pushState(null, '', h ? '#' + h : location.pathname + location.search);
      }
      apply();
    };
    var reset = function () { input.value = ''; setFilter(base, filter !== base); };
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-f]');
      if (a && win.contains(a) && local(a.dataset.f)) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button) return;
        e.preventDefault();
        var f = a.dataset.f;
        /* clicking the selected row again returns to the full list */
        if (a.closest('.show') && a.hasAttribute('aria-current') && f !== base) f = base;
        setFilter(f, true);
        if (win.getBoundingClientRect().top < 0) win.scrollIntoView();
        return;
      }
      /* Clear / Show all remove themselves: keep focus on the results heading */
      if (e.target.closest('[data-reset]') && win.contains(e.target)) { reset(); focusTarget(head); }
    });
    /* Options that filter in place apply immediately. Options that open another page only navigate on an explicit
       commit (a pointer pick, Enter, or the "Go" link): arrow keys on a closed <select> fire "change" in some
       browsers, and moving focus through options must not change the page (WCAG 3.2.2). */
    if (sel) {
      var go = $('#show-go', win), viaKey = false;
      var pending = function () { var o = sel.options[sel.selectedIndex]; return o && !local(sel.value) ? o.dataset.href : ''; };
      sel.addEventListener('keydown', function (e) {
        viaKey = true;
        if (e.key === 'Enter' && pending()) { e.preventDefault(); location.href = pending(); }
      });
      sel.addEventListener('pointerdown', function () { viaKey = false; });
      sel.addEventListener('change', function () {
        var href = pending();
        if (!href) { if (go) go.hidden = true; setFilter(sel.value, true); return; }
        if (!viaKey) { location.href = href; return; }
        if (go) { go.href = href; go.hidden = false; }
      });
    }
    var readHash = function (scroll) {
      var h = decodeURIComponent(location.hash.slice(1)), m = h.match(/^(s|series|tag)=(.+)$/);
      if (/^y\d{4}$/.test(h) && document.getElementById(h)) setFilter('year:' + h.slice(1));
      else if (m && allLocal) setFilter(m[1] + ':' + m[2]);
      else if (!h) setFilter(base);
      else return;
      if (scroll && win.getBoundingClientRect().top < 0) win.scrollIntoView();
    };
    input.addEventListener('input', apply);
    input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { input.value = ''; apply(); } });
    document.addEventListener('keydown', function (e) {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.activeElement.isContentEditable) return;
      if (input.closest('[inert]')) return; /* e.g. the mobile drawer is open */
      e.preventDefault(); input.focus();
    });
    addEventListener('hashchange', function () { readHash(true); });
    addEventListener('popstate', function () { readHash(false); });
    setFilter(base);
    readHash(false);
    /* #y2025 is also an element id: after the browser's own jump, show the filtered list from its top */
    addEventListener('load', function () { if (kind(filter) === 'year' && win.getBoundingClientRect().top < 0) win.scrollIntoView(); });
  }

  /* Lazy YouTube facade. The poster is a plain link to YouTube (works without JS); here it becomes a <button>,
     and the youtube-nocookie iframe is only created when it's pressed. No YouTube request happens before that. */
  $$('.yt > a[data-yt]').forEach(function (link) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', link.getAttribute('aria-label'));
    while (link.firstChild) btn.appendChild(link.firstChild);
    link.replaceWith(btn);
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      var start = link.dataset.start ? '&start=' + encodeURIComponent(link.dataset.start) : '';
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(link.dataset.yt) + '?autoplay=1' + start;
      f.title = link.dataset.title;
      f.allow = 'autoplay; encrypted-media; picture-in-picture';
      f.allowFullscreen = true;
      btn.replaceWith(f);
      f.focus();
    });
  });

  /* Post: thin progress bar + active section in "On this page" (panel and inline copies).
     Nothing is current while the reader is still in the intro; the last heading wins at the very end. */
  var prose = $('.paper .prose'), bar = $('.progress'), tocLinks = $$('.outline a, .toc a');
  if (prose && (bar || tocLinks.length)) {
    var first = $('.outline nav, .toc nav');
    var heads = first ? $$('a', first).map(function (a) { return document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))); }) : [];
    var ticking = false;
    var onScroll = function () {
      ticking = false;
      var r = prose.getBoundingClientRect();
      if (bar) {
        var total = r.height - innerHeight * 0.6;
        bar.style.width = (Math.max(0, Math.min(1, -r.top / (total > 0 ? total : 1))) * 100).toFixed(1) + '%';
      }
      if (!tocLinks.length) return;
      var cur = -1;
      heads.forEach(function (h, i) { if (h && h.getBoundingClientRect().top < innerHeight * 0.3) cur = i; });
      if (cur > -1 && r.bottom <= innerHeight + 4) cur = heads.length - 1;
      var id = cur > -1 && heads[cur] ? '#' + heads[cur].id : '';
      tocLinks.forEach(function (a) {
        var on = decodeURIComponent(a.getAttribute('href')) === id;
        a.classList.toggle('on', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    };
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
    tocLinks.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var h = a.getAttribute('href'), target = document.getElementById(decodeURIComponent(h.slice(1)));
        if (!target) return;
        e.preventDefault();
        var d = a.closest('details');
        if (d) d.open = false;
        history.replaceState(null, '', h);
        focusTarget(target);
      });
    });
  }
})();
