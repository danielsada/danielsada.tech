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

  /* Panel Projects box: a project name cut off with an ellipsis gets its full name as a tooltip */
  var pp = $('.pproj');
  if (pp) {
    var tips = function () {
      $$('li a', pp).forEach(function (a) {
        var nm = $('.nm', a);
        if (nm && nm.scrollWidth > nm.clientWidth + 1) a.title = nm.textContent; else a.removeAttribute('title');
      });
    };
    pp.addEventListener('toggle', tips);
    addEventListener('resize', tips);
    tips();
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
    /* Search matches at the start of words (in the title, description, marks and tags), never inside a word:
       "ai" finds "AI tools" but not "against". Accents are ignored: "espanol" finds "español". */
    var fold = function (s) { return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC').toLowerCase(); };
    var words = function (s) { return fold(s).split(/[^\p{L}\p{M}\p{N}]+/u).filter(Boolean); };
    var hay = rows.map(function (r) {
      var nm = $('td.nm', r), tg = $('td.tg', r);
      return words((nm ? nm.textContent : '') + ' ' + (tg ? tg.textContent : '') + ' ' + (r.dataset.tags || '').replace(/-/g, ' '));
    });
    var hits = function (list, t) { return list.some(function (w) { return w.indexOf(t) === 0; }); };
    var showCount = win.getAttribute('data-count') !== 'false';
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
      var q = input.value.trim(), terms = words(q), n = 0;
      var tag = kind(filter) === 'tag' ? val(filter) : '';
      rows.forEach(function (r, i) {
        var ok = match(r) && terms.every(function (t) { return hits(hay[i], t); });
        r.hidden = !ok; if (ok) n++;
        /* reveal a tucked-away tag when it is the reason the row matches */
        $$('td.tg .x', r).forEach(function (x) {
          var a = $('a', x), t = a ? a.dataset.f.slice(4) : '', tw = words(x.textContent);
          x.classList.toggle('hit', !!ok && (t === tag || terms.some(function (w) { return hits(tw, w); })));
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
      if (sub) sub.innerHTML = parts.length && showCount ? plural(n) : subBase;
      win.classList.toggle('is-filtered', parts.length > 0);
      clearBtn.hidden = !parts.length;
      empty.hidden = n > 0;
      saveSoon();
    };
    /* The search text lives in the URL (?q=…, replaced, not pushed), next to the filter in the hash, so Back
       from a result, reload and shared links all bring the same view back. */
    var urlFor = function (f, q) {
      var p = new URLSearchParams(location.search), h = hashFor(f);
      if (q) p.set('q', q); else p.delete('q');
      var s = p.toString();
      return location.pathname + (s ? '?' + s : '') + (h ? '#' + h : '');
    };
    /* Browsers cap history updates (Safari: 100 per 30 s), so the URL follows the search box after a pause,
       and right away when the reader clicks something or leaves the page. */
    var timer = 0;
    var history_ = function (method, u) { try { history[method](method === 'pushState' ? null : history.state, '', u); } catch (e) { /* rate-limited */ } };
    var saveQuery = function () {
      clearTimeout(timer); timer = 0;
      var u = urlFor(filter, input.value.trim());
      if (u !== location.pathname + location.search + location.hash) history_('replaceState', u);
    };
    var saveSoon = function () { clearTimeout(timer); timer = setTimeout(saveQuery, 400); };
    document.addEventListener('click', function () { if (timer) saveQuery(); }, true);
    addEventListener('pagehide', function () { if (timer) saveQuery(); });
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
        /* never leave the select blank: fall back to the option for this page itself */
        sel.value = f;
        if (sel.selectedIndex < 0) sel.value = base;
      }
      var text = labelFor(f);
      head.textContent = text;
      document.title = text + (siteTitle ? sep + siteTitle : '');
      if (crumb) {
        crumb.hidden = f === base;
        $('span', crumb).textContent = k === 'year' ? v : k === 'tag' ? tagName(v) : text;
        if (crumbBase) { if (f === base) crumbBase.setAttribute('aria-current', 'page'); else crumbBase.removeAttribute('aria-current'); }
      }
      apply();
      if (push) { clearTimeout(timer); timer = 0; history_('pushState', urlFor(f, input.value.trim())); }
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
      else return false;
      if (scroll && win.getBoundingClientRect().top < 0) win.scrollIntoView();
      return true;
    };
    input.addEventListener('input', apply);
    input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { input.value = ''; apply(); } });
    document.addEventListener('keydown', function (e) {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.activeElement.isContentEditable) return;
      if (input.closest('[inert]')) return; /* e.g. the mobile drawer is open */
      e.preventDefault(); input.focus();
    });
    /* Restore the whole view (search + filter) from the URL. Runs on load and again on pageshow, so it also wins
       over a browser that refills the search box itself on Back, and over a page restored from the bfcache. */
    var restore = function () {
      input.value = new URLSearchParams(location.search).get('q') || '';
      if (!readHash(false)) setFilter(filter);
    };
    addEventListener('hashchange', function () { readHash(true); });
    addEventListener('popstate', restore);
    addEventListener('pageshow', restore);
    restore();
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
     The active heading is the last one that has reached the reading line just below the top (the scroll-padding
     offset). After a jump from the outline the clicked heading stays active until the reader scrolls away, so a
     short section followed by another heading can't steal it. Nothing is active in the intro. */
  var prose = $('.paper .prose'), bar = $('.progress'), tocLinks = $$('.outline a, .toc a');
  if (prose && (bar || tocLinks.length)) {
    var first = $('.outline nav, .toc nav'), outlineNav = $('.panel .outline nav');
    var heads = first ? $$('a', first).map(function (a) { return document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))); }) : [];
    var ticking = false, pinned = '', pinY = 0, lastId = null;
    var lineY = function () { return (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) + Math.min(innerHeight * 0.2, 120); };
    /* keep the active entry visible inside the outline's own scroll area (never scrolls the page) */
    var reveal = function (a) {
      if (!outlineNav || !a || !outlineNav.contains(a)) return;
      var n = outlineNav.getBoundingClientRect(), r = a.getBoundingClientRect(), pad = 24;
      if (r.top < n.top + pad) outlineNav.scrollTop -= n.top + pad - r.top;
      else if (r.bottom > n.bottom - pad) outlineNav.scrollTop += r.bottom - (n.bottom - pad);
    };
    /* fade the outline's edges when there is more to scroll */
    var edges = function () {
      if (!outlineNav) return;
      var o = outlineNav.parentNode, more = outlineNav.scrollHeight - outlineNav.clientHeight > 2;
      o.classList.toggle('fade-t', more && outlineNav.scrollTop > 2);
      o.classList.toggle('fade-b', more && outlineNav.scrollTop < outlineNav.scrollHeight - outlineNav.clientHeight - 2);
    };
    var onScroll = function () {
      ticking = false;
      var r = prose.getBoundingClientRect();
      if (bar) {
        var total = r.height - innerHeight * 0.6;
        bar.style.width = (Math.max(0, Math.min(1, -r.top / (total > 0 ? total : 1))) * 100).toFixed(1) + '%';
      }
      if (!tocLinks.length) return;
      if (pinned && Math.abs(scrollY - pinY) > 4) pinned = '';
      var id = pinned;
      if (!id) {
        var cur = -1, y = lineY();
        heads.forEach(function (h, i) { if (h && h.getBoundingClientRect().top <= y) cur = i; });
        if (cur > -1 && r.bottom <= innerHeight + 4) cur = heads.length - 1;
        id = cur > -1 && heads[cur] ? '#' + heads[cur].id : '';
      }
      if (id === lastId) return;
      lastId = id;
      tocLinks.forEach(function (a) {
        var on = decodeURIComponent(a.getAttribute('href')) === id;
        a.classList.toggle('on', on);
        if (on) { a.setAttribute('aria-current', 'location'); reveal(a); } else a.removeAttribute('aria-current');
      });
    };
    var pin = function (h) { pinned = h; pinY = scrollY; lastId = null; onScroll(); };
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    addEventListener('resize', edges);
    if (outlineNav) outlineNav.addEventListener('scroll', edges, { passive: true });
    edges();
    onScroll();
    /* arriving on a #heading link: that heading is the current one */
    var arrived = decodeURIComponent(location.hash);
    if (arrived && heads.some(function (h) { return h && '#' + h.id === arrived; })) addEventListener('load', function () { pin(arrived); });
    tocLinks.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var h = a.getAttribute('href'), target = document.getElementById(decodeURIComponent(h.slice(1)));
        if (!target) return;
        e.preventDefault();
        var d = a.closest('details');
        if (d) d.open = false;
        history.replaceState(null, '', h);
        focusTarget(target);
        pin(decodeURIComponent(h));
      });
    });
  }
})();
