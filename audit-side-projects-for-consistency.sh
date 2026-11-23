#!/usr/bin/env bash
# Audits the live side-project sites (*.danielsada.tech) against the live blog: the shared sidebar (Places,
# Elsewhere, logo link, logo, favicon, wallpaper, colours, panel width), the vendored theme version, SEO tags and
# JSON-LD. Read-only: it only fetches pages and, through `gh`, reads each repo's default branch.
#
#   ./audit-side-projects-for-consistency.sh              # every known side project
#   ./audit-side-projects-for-consistency.sh --site https://voltra.danielsada.tech/=danielsada/voltra-exercise-maker
#   ./audit-side-projects-for-consistency.sh --help
#
# Needs bash, Python >= 3.8 (standard library only) and, for the theme/fork checks, an authenticated `gh`
# (skip those with --no-repo). Exit status: 0 = no FAIL, 1 = at least one FAIL, 2 = usage error.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

PY=""
for c in python3 python; do
  if command -v "$c" >/dev/null 2>&1 && "$c" -c 'import sys; sys.exit(sys.version_info < (3, 8))' >/dev/null 2>&1; then
    PY="$c"
    break
  fi
done
if [ -z "$PY" ]; then
  echo "audit: Python 3.8 or newer is required (python3 or python on PATH)" >&2
  exit 2
fi

exec "$PY" - "$@" <<'PYTHON'
import argparse
import hashlib
import json
import random
import re
import string
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser

PARENT = "https://danielsada.tech/"
PARENT_REPO = "danielsada/danielsada.tech"
THEME_REPO = "danielsada/hugo-breeze-plasma-inspired-theme"
THEME_DIR = "hugo-breeze-plasma-inspired-theme"
# Repo-only folders that aren't vendored (README.md > Theme).
VENDOR_EXCLUDE = {"exampleSite", "docs", "images", "scripts", ".github"}
# Side projects audited by default, with their source repos. Sites listed in data/projects.yaml on a
# *.danielsada.tech host are added automatically (without a repo, so only the live checks run).
KNOWN_SITES = {
    "watolls.danielsada.tech": "danielsada/watollsweb",
    "voltra.danielsada.tech": "danielsada/voltra-exercise-maker",
    "ninja.danielsada.tech": "danielsada/ninja-speedi",
}
# Theme files a site may override: the hooks are made for it, panel-projects.html is the slot for a site's own
# panel sections, and i18n files merge with the theme's strings.
ALLOWED_OVERRIDES = ("layouts/_partials/hooks/", "layouts/_partials/breeze/panel-projects.html", "i18n/")
SITEMAP_CHECK = 60
UPSTREAM_COMMITS = 30
UA = "Mozilla/5.0 (compatible; danielsada-audit/1.0; +https://danielsada.tech/)"
SAME_PAGE_TYPES = {"WebPage", "AboutPage", "CollectionPage", "ProfilePage", "ContactPage", "ItemPage", "FAQPage",
                   "Article", "BlogPosting", "NewsArticle", "TechArticle", "WebApplication", "SoftwareApplication",
                   "HowTo", "Recipe", "SearchResultsPage"}

sys.stdout.reconfigure(encoding="utf-8", errors="replace")


# ---------------------------------------------------------------- HTTP

class Resp:
    def __init__(self, url, status, headers, body, final, err=None):
        self.url, self.status, self.headers, self.body, self.final, self.err = url, status, headers, body, final, err

    @property
    def text(self):
        return self.body.decode("utf-8", errors="replace")


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


_openers = {True: urllib.request.build_opener(), False: urllib.request.build_opener(_NoRedirect)}
_cache = {}


def fetch(url, follow=True):
    key = (url, follow)
    if key not in _cache:
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html,application/xhtml+xml,*/*"})
        try:
            r = _openers[follow].open(req, timeout=25)
            res = Resp(url, r.status, r.headers, r.read(), r.geturl())
        except urllib.error.HTTPError as e:
            res = Resp(url, e.code, e.headers, e.read() if e.fp else b"", url)
        except Exception as e:  # DNS, TLS, timeouts
            res = Resp(url, 0, {}, b"", url, err=str(e))
        _cache[key] = res
    return _cache[key]


def fetch_all(urls):
    with ThreadPoolExecutor(8) as ex:
        return list(ex.map(fetch, urls))


def norm(u):
    p = urllib.parse.urlsplit(u)
    return urllib.parse.urlunsplit((p.scheme.lower(), p.netloc.lower(), p.path or "/", p.query, ""))


def cf_email(href):
    """Cloudflare rewrites mailto: links to /cdn-cgi/l/email-protection#<hex>; decode them back."""
    m = re.search(r"/cdn-cgi/l/email-protection#([0-9a-fA-F]+)$", href)
    if not m:
        return None
    h = m.group(1)
    key = int(h[:2], 16)
    return "mailto:" + "".join(chr(int(h[i:i + 2], 16) ^ key) for i in range(2, len(h), 2))


def abs_href(href, base):
    return cf_email(href or "") or urllib.parse.urljoin(base, href or "")


def md5(body):
    return hashlib.md5(body).hexdigest()[:10]


# ---------------------------------------------------------------- HTML

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
AUTOCLOSE = {"li": {"li"}, "p": {"p"}, "dt": {"dt", "dd"}, "dd": {"dt", "dd"}, "tr": {"tr"}, "td": {"td", "th"},
             "th": {"td", "th"}, "option": {"option"}}
SCOPES = {"ul", "ol", "dl", "table", "tbody", "thead", "select", "nav", "div", "section", "body", "aside"}


class Node:
    def __init__(self, tag, attrs, parent):
        self.tag, self.attrs, self.parent, self.children = tag, attrs, parent, []

    def iter(self):
        yield self
        for c in self.children:
            if isinstance(c, Node):
                yield from c.iter()

    def find_all(self, tag=None, cls=None, **attrs):
        out = []
        for n in self.iter():
            if n is self or (tag and n.tag != tag):
                continue
            if cls and cls not in n.attrs.get("class", "").split():
                continue
            if any(n.attrs.get(k.replace("_", "-")) != v for k, v in attrs.items()):
                continue
            out.append(n)
        return out

    def find(self, tag=None, cls=None, **attrs):
        r = self.find_all(tag, cls, **attrs)
        return r[0] if r else None

    def text(self, skip=lambda n: False):
        parts = []
        for c in self.children:
            if isinstance(c, Node):
                if not skip(c):
                    parts.append(c.text(skip))
            else:
                parts.append(c)
        return re.sub(r"\s+", " ", "".join(parts)).strip()


class DOM(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root", {}, None)
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        if tag in AUTOCLOSE:
            n = self.cur
            while n is not self.root and n.tag not in SCOPES:
                if n.tag in AUTOCLOSE[tag]:
                    self.cur = n.parent
                    break
                n = n.parent
        node = Node(tag, {k: (v if v is not None else "") for k, v in attrs}, self.cur)
        self.cur.children.append(node)
        if tag not in VOID:
            self.cur = node

    def handle_startendtag(self, tag, attrs):
        self.cur.children.append(Node(tag, {k: (v if v is not None else "") for k, v in attrs}, self.cur))

    def handle_endtag(self, tag):
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.children.append(data)


def icon_of(a):
    use = a.find("use")
    if not use:
        return ""
    return (use.attrs.get("href") or use.attrs.get("xlink:href") or "").rsplit("#", 1)[-1]


class Page:
    def __init__(self, resp):
        self.url = resp.url
        self.resp = resp
        d = DOM()
        d.feed(resp.text)
        root = d.root
        html_el = root.find("html")
        self.lang = html_el.attrs.get("lang", "") if html_el else ""
        head = root.find("head") or root
        t = head.find("title")
        self.title = t.text() if t else ""
        self.meta, self.prop, self.links = {}, {}, {}
        for m in head.find_all("meta"):
            if "name" in m.attrs:
                self.meta.setdefault(m.attrs["name"].lower(), []).append(m.attrs.get("content", ""))
            if "property" in m.attrs:
                self.prop.setdefault(m.attrs["property"].lower(), []).append(m.attrs.get("content", ""))
        for ln in head.find_all("link"):
            for rel in ln.attrs.get("rel", "").lower().split():
                self.links.setdefault(rel, []).append(ln.attrs.get("href", ""))
        self.ld = [s.text() for s in root.find_all("script") if s.attrs.get("type", "").lower() == "application/ld+json"]
        self.vars = {}
        for s in head.find_all("style"):
            for m in re.finditer(r":root\s*\{([^}]*)\}", s.text()):
                for k, v in re.findall(r"(--[\w-]+)\s*:\s*([^;]+)", m.group(1)):
                    self.vars[k] = v.strip()
        self.panel = root.find("aside", id="panel")
        self.places, self.social, self.logo = [], [], None
        if self.panel:
            nav = self.panel.find("nav", aria_labelledby="places-h")
            for a in (nav.find_all("a") if nav else []):
                skip = lambda n: n.tag == "svg" or (n.tag == "span" and {"n", "tag"} & set(n.attrs.get("class", "").split()))
                tag = a.find("span", cls="tag")
                self.places.append({"name": a.text(skip), "href": abs_href(a.attrs.get("href"), self.url),
                                    "icon": icon_of(a), "badge": tag.text() if tag else ""})
            ul = self.panel.find("ul", cls="social")
            for a in (ul.find_all("a") if ul else []):
                self.social.append({"name": a.attrs.get("aria-label") or a.attrs.get("title") or a.text(),
                                    "href": abs_href(a.attrs.get("href"), self.url), "icon": icon_of(a)})
            me = self.panel.find("a", cls="me")
            if me:
                img = me.find("img")
                small = me.find("small")
                self.logo = {"href": abs_href(me.attrs.get("href"), self.url),
                             "img": abs_href(img.attrs.get("src"), self.url) if img else "",
                             "tagline": small.text() if small else ""}

    def m(self, name):
        return (self.meta.get(name) or [""])[0]

    def p(self, name):
        return (self.prop.get(name) or [""])[0]

    @property
    def path(self):
        return urllib.parse.urlsplit(self.url).path or "/"


# ---------------------------------------------------------------- report

class Report:
    ORDER = {"FAIL": 0, "WARN": 1, "PASS": 2}
    AREAS = ["sidebar", "theme", "seo", "json-ld"]

    def __init__(self, title):
        self.title = title
        self.items = {}
        self.npages = 1

    def add(self, level, area, msg, page=None):
        pages = self.items.setdefault((level, area, msg), [])
        if page is not None:
            pages.append(page)

    def count(self, level):
        return sum(1 for k in self.items if k[0] == level)

    def print(self, quiet, color):
        paint = {"FAIL": "\033[31m", "WARN": "\033[33m", "PASS": "\033[32m"} if color else {}
        reset = "\033[0m" if color else ""
        print(f"\n== {self.title}")
        keys = sorted(self.items, key=lambda k: (self.AREAS.index(k[1]), self.ORDER[k[0]], k[2]))
        for level, area, msg in keys:
            if quiet and level == "PASS":
                continue
            pages = self.items[(level, area, msg)]
            where = ""
            if pages and self.npages > 1:
                where = f"  [{len(pages)}/{self.npages} pages"
                if len(pages) < self.npages:
                    where += ": " + ", ".join(pages[:3]) + (", …" if len(pages) > 3 else "")
                where += "]"
            print(f"  {paint.get(level, '')}{level}{reset}  {area:<8} {msg}{where}")


# ---------------------------------------------------------------- checks

def fmt_entry(e):
    extra = f" [{e['badge']}]" if e.get("badge") else ""
    return f"{e['name']}{extra} → {e['href']} (icon {e['icon'] or '-'})"


def diff_list(label, ref, got, name_level):
    """Messages describing how `got` differs from `ref` (entries keyed by href)."""
    out = []
    rk = {e["href"]: e for e in ref}
    gk = {e["href"]: e for e in got}
    for h, e in rk.items():
        if h not in gk:
            out.append(("FAIL", f"{label}: missing {fmt_entry(e)}"))
    for h, e in gk.items():
        if h not in rk:
            out.append(("FAIL", f"{label}: extra {fmt_entry(e)}"))
    for h in rk.keys() & gk.keys():
        for f in ("name", "icon", "badge"):
            a, b = rk[h].get(f, ""), gk[h].get(f, "")
            if a != b:
                out.append((name_level if f == "name" else "FAIL", f"{label}: {h} has {f} '{b}', blog has '{a}'"))
    common = [h for h in rk if h in gk]
    if [h for h in gk if h in rk] != common:
        out.append(("FAIL", f"{label}: order differs from the blog"))
    return out


def check_sidebar(rep, page, ref, is_parent):
    if not page.panel:
        rep.add("FAIL", "sidebar", "no sidebar (aside#panel)", page.path)
        return
    msgs = diff_list("Places", ref.places, page.places, "FAIL")
    msgs += diff_list("Elsewhere", ref.social, page.social, "WARN")
    for level, msg in msgs:
        rep.add(level, "sidebar", msg, page.path)
    if not any(level == "FAIL" for level, _ in msgs):
        rep.add("PASS", "sidebar", "Places and Elsewhere match the blog", page.path)
    if not is_parent:
        href = page.logo["href"] if page.logo else ""
        if norm(href) == norm(PARENT):
            rep.add("PASS", "sidebar", f"logo links to {PARENT}", page.path)
        else:
            rep.add("FAIL", "sidebar", f"logo links to {href or '(nothing)'}, not {PARENT}", page.path)


def check_look(rep, home, ref):
    """Site-wide chrome, from the home page."""
    for var in ("--accent", "--accent-ink", "--wall", "--panel-w", "--logo-w"):
        a, b = ref.vars.get(var, "(theme default)"), home.vars.get(var, "(theme default)")
        if a == b:
            rep.add("PASS", "sidebar", f"{var} = {b}")
        else:
            rep.add("FAIL", "sidebar", f"{var} is {b}, blog has {a}")
    for name in ("color-scheme",):
        a, b = ref.m(name), home.m(name)
        rep.add("PASS" if a == b else "FAIL", "sidebar", f"meta {name} = '{b}'" + ("" if a == b else f", blog has '{a}'"))
    a, b = sorted(ref.meta.get("theme-color", [])), sorted(home.meta.get("theme-color", []))
    rep.add("PASS" if a == b else "WARN", "sidebar", f"theme-color {b}" + ("" if a == b else f", blog has {a}"))
    assets = [("logo", ref.logo["img"] if ref.logo else "", home.logo["img"] if home.logo else ""),
              ("favicon", abs_href((ref.links.get("icon") or [""])[0], ref.url),
               abs_href((home.links.get("icon") or [""])[0], home.url))]
    wp = lambda pg: (re.search(r'url\("?([^")]+)"?\)', pg.vars.get("--wallpaper", "")) or [None, ""])[1]
    assets.append(("wallpaper", abs_href(wp(ref), ref.url) if wp(ref) else "", abs_href(wp(home), home.url) if wp(home) else ""))
    for what, ru, hu in assets:
        if not hu:
            rep.add("FAIL", "sidebar", f"no {what}")
            continue
        r, h = fetch(ru) if ru else None, fetch(hu)
        if h.status != 200:
            rep.add("FAIL", "sidebar", f"{what} {hu} returns {h.status or h.err}")
        elif r is None or r.status != 200:
            rep.add("WARN", "sidebar", f"couldn't fetch the blog's {what} to compare")
        elif md5(r.body) == md5(h.body):
            rep.add("PASS", "sidebar", f"{what} is the same file as the blog's")
        else:
            rep.add("FAIL", "sidebar", f"{what} {hu} differs from the blog's {ru}")
    a, b = ref.m("generator"), home.m("generator")
    if a != b:
        rep.add("WARN", "sidebar", f"built with '{b or 'unknown'}', blog with '{a or 'unknown'}'")


def check_seo_page(rep, page, home_url):
    r, path = page.resp, page.path
    if r.status != 200:
        rep.add("FAIL", "seo", f"returns {r.status or r.err}", path)
        return
    add = lambda level, msg: rep.add(level, "seo", msg, path)
    add("PASS" if page.lang else "FAIL", "<html lang> " + (f"= {page.lang}" if page.lang else "missing"))
    if not page.title:
        add("FAIL", "<title> missing")
    elif len(page.title) > 70:
        add("WARN", f"<title> is {len(page.title)} chars (> 70)")
    else:
        add("PASS", "<title> present, ≤ 70 chars")
    d = page.m("description")
    if not d:
        add("FAIL", "meta description missing")
    elif not 50 <= len(d) <= 160:
        add("WARN", f"meta description is {len(d)} chars (aim for 50-160)")
    else:
        add("PASS", "meta description 50-160 chars")
    canon = (page.links.get("canonical") or [""])[0]
    home = urllib.parse.urlsplit(home_url)
    if not canon:
        add("FAIL", "canonical link missing")
    elif urllib.parse.urlsplit(canon)[:2] != home[:2]:
        add("FAIL", f"canonical {canon} isn't a {home.scheme} URL on {home.netloc}")
    elif norm(canon) != norm(r.final):
        add("FAIL", f"canonical {canon} isn't this page ({r.final})")
    else:
        add("PASS", "canonical is this page's URL")
    robots = " ".join(page.meta.get("robots", []) + page.meta.get("googlebot", [])).lower()
    xrobots = (r.headers.get("X-Robots-Tag", "") if r.headers else "").lower()
    if "noindex" in robots or "noindex" in xrobots:
        add("FAIL", "page is noindex")
    add("PASS" if page.m("viewport") else "FAIL", "meta viewport " + ("present" if page.m("viewport") else "missing"))
    add("PASS" if page.links.get("icon") else "FAIL", "favicon link " + ("present" if page.links.get("icon") else "missing"))
    missing = [p for p in ("og:title", "og:description", "og:url", "og:type", "og:image") if not page.p(p)]
    add("FAIL" if missing else "PASS", "Open Graph " + (f"missing {', '.join(missing)}" if missing else "title/description/url/type/image present"))
    if not page.p("og:site_name"):
        add("WARN", "og:site_name missing")
    if page.p("og:url") and canon and norm(page.p("og:url")) != norm(canon):
        add("WARN", f"og:url {page.p('og:url')} differs from the canonical URL")
    img = page.p("og:image")
    if img:
        if not img.startswith("http"):
            add("FAIL", f"og:image '{img}' isn't absolute")
        else:
            ir = fetch(img)
            if ir.status != 200:
                add("FAIL", f"og:image {img} returns {ir.status or ir.err}")
            else:
                add("PASS", "og:image is absolute and loads")
    add("PASS" if page.m("twitter:card") else "WARN", "twitter:card " + ("present" if page.m("twitter:card") else "missing"))


def check_seo_site(rep, home_url, pages, locs, is_parent, listed):
    add = lambda level, msg: rep.add(level, "seo", msg)
    for what, attr in (("title", "title"), ("meta description", None)):
        seen = {}
        for pg in pages:
            if pg.resp.status == 200:
                v = pg.title if attr else pg.m("description")
                if v:
                    seen.setdefault(v, []).append(pg.path)
        dups = {v: ps for v, ps in seen.items() if len(ps) > 1}
        for v, ps in dups.items():
            add("WARN", f"same {what} on {', '.join(ps)}: '{v[:60]}'")
        if not dups and len(pages) > 1:
            add("PASS", f"{what}s are unique across the sampled pages")
    r = fetch(urllib.parse.urljoin(home_url, "/robots.txt"))
    if r.status != 200:
        add("FAIL", f"robots.txt returns {r.status or r.err}")
    else:
        txt = r.text
        if re.search(r"(?im)^\s*disallow:\s*/\s*$", txt):
            add("FAIL", "robots.txt disallows the whole site")
        sm = re.findall(r"(?im)^\s*sitemap:\s*(\S+)", txt)
        if any(norm(s) == norm(urllib.parse.urljoin(home_url, "/sitemap.xml")) for s in sm):
            add("PASS", "robots.txt points to sitemap.xml")
        else:
            add("WARN", "robots.txt has no 'Sitemap: " + urllib.parse.urljoin(home_url, "/sitemap.xml") + "' line")
    if locs is None:
        add("FAIL", "sitemap.xml missing or unreadable")
    else:
        host = urllib.parse.urlsplit(home_url).netloc
        off = [u for u in locs if urllib.parse.urlsplit(u).netloc != host]
        if off:
            add("FAIL", f"sitemap.xml lists {len(off)} URL(s) on other hosts, e.g. {off[0]}")
        if not any(norm(u) == norm(home_url) for u in locs):
            add("WARN", "sitemap.xml doesn't list the home page")
        sample = locs[:SITEMAP_CHECK]
        bad = [(u, x.status or x.err) for u, x in zip(sample, fetch_all(sample)) if x.status != 200]
        for u, s in bad[:5]:
            add("FAIL", f"sitemap URL {u} returns {s}")
        if len(bad) > 5:
            add("FAIL", f"…and {len(bad) - 5} more sitemap URLs don't return 200")
        if not bad:
            n = f"{len(sample)} of {len(locs)}" if len(locs) > len(sample) else f"all {len(locs)}"
            add("PASS", f"sitemap.xml: {n} URLs return 200")
    junk = "".join(random.choice(string.ascii_lowercase) for _ in range(12))
    nf = fetch(urllib.parse.urljoin(home_url, f"/audit-{junk}/"))
    add("PASS" if nf.status == 404 else "FAIL", f"a missing page returns {nf.status or nf.err}" + ("" if nf.status == 404 else " (want 404)"))
    hr = fetch("http://" + urllib.parse.urlsplit(home_url).netloc + "/", follow=False)
    loc = hr.headers.get("Location", "") if hr.headers else ""
    if home_url.startswith("http://"):
        add("WARN", "served over http (a local build?): the https checks don't apply")
    elif hr.status in (301, 302, 307, 308) and loc.startswith("https://"):
        add("PASS" if hr.status in (301, 308) else "WARN", f"http:// redirects to https ({hr.status})")
    else:
        add("FAIL", f"http:// doesn't redirect to https (got {hr.status or hr.err})")
    if not is_parent:
        add("PASS" if listed else "WARN", "listed in the blog's data/projects.yaml" if listed else
            "not listed in the blog's data/projects.yaml (Projects page)")


def ld_nodes(page):
    nodes, errors, contexts = [], [], []

    def walk(x):
        if isinstance(x, dict):
            if "@type" in x:
                nodes.append(x)
            for v in x.values():
                walk(v)
        elif isinstance(x, list):
            for v in x:
                walk(v)

    for block in page.ld:
        try:
            data = json.loads(block)
        except ValueError as e:
            errors.append(str(e))
            continue
        for top in (data if isinstance(data, list) else [data]):
            if isinstance(top, dict):
                contexts.append(str(top.get("@context", "")))
        walk(data)
    return nodes, errors, contexts


def types(n):
    t = n.get("@type", [])
    return set(t if isinstance(t, list) else [t])


def same_as(n):
    s = n.get("sameAs", [])
    return sorted(s if isinstance(s, list) else [s])


def ref_person(parent_home):
    nodes, _, _ = ld_nodes(parent_home)
    for n in nodes:
        if "Person" in types(n) and norm(str(n.get("url", ""))) == norm(PARENT):
            return n
    return None


def check_ld_page(rep, page, home_url, is_home, is_parent, person):
    path = page.path
    add = lambda level, msg: rep.add(level, "json-ld", msg, path)
    if page.resp.status != 200:
        return
    nodes, errors, contexts = ld_nodes(page)
    for e in errors:
        add("FAIL", f"invalid JSON-LD: {e}")
    if not page.ld:
        add("FAIL" if is_home else "WARN", "no JSON-LD")
        return
    if any("schema.org" not in c for c in contexts):
        add("FAIL", "a JSON-LD block has no schema.org @context")
    elif not errors:
        add("PASS", "JSON-LD parses, @context schema.org")
    if is_home:
        if any("WebSite" in types(n) and norm(str(n.get("url", ""))) == norm(home_url) for n in nodes):
            add("PASS", "WebSite node with the site's url")
        else:
            add("FAIL", f"no WebSite node with url {home_url}")
        people = [n for n in nodes if "Person" in types(n) and n.get("name") == "Daniel Sada"]
        mine = [n for n in people if norm(str(n.get("url", ""))) == norm(PARENT)]
        if not mine:
            add("FAIL", f"no Person 'Daniel Sada' with url {PARENT}")
        else:
            want = same_as(person) if person else None
            got = same_as(mine[0])
            if is_parent:
                social = sorted(e["href"] for e in page.social
                                if e["href"].startswith("http") and urllib.parse.urlsplit(e["href"]).netloc != urllib.parse.urlsplit(PARENT).netloc)
                if got == social:
                    add("PASS", "Person sameAs = the Elsewhere links")
                else:
                    add("FAIL", f"Person sameAs {got} differs from the Elsewhere links {social}")
            elif not got:
                add("WARN", f"Person has no sameAs (blog: {want})")
            elif want is not None and got != want:
                add("FAIL", f"Person sameAs {got} differs from the blog's {want}")
            else:
                add("PASS", "Person 'Daniel Sada' matches the blog's (url, sameAs)")
    else:
        if any(types(n) & SAME_PAGE_TYPES for n in nodes):
            add("PASS", "page-level node (WebPage/Article/…)")
        else:
            add("WARN", "no WebPage/Article node")
        if any("BreadcrumbList" in types(n) for n in nodes):
            add("PASS", "BreadcrumbList")
        else:
            add("WARN", "no BreadcrumbList")


# ---------------------------------------------------------------- theme (via gh)

class GhError(Exception):
    pass


def gh(path):
    try:
        r = subprocess.run(["gh", "api", path], capture_output=True, text=True, encoding="utf-8", timeout=90)
    except FileNotFoundError:
        raise GhError("gh isn't installed")
    except subprocess.TimeoutExpired:
        raise GhError(f"gh api {path} timed out")
    if r.returncode:
        lines = (r.stderr or "").strip().splitlines()
        raise GhError(lines[-1] if lines else f"gh api {path} failed")
    return json.loads(r.stdout)


def git_tree_sha(entries):
    key = lambda e: e["path"] + ("/" if e["type"] == "tree" else "")
    body = b"".join((e["mode"].lstrip("0") + " " + e["path"]).encode() + b"\0" + bytes.fromhex(e["sha"])
                    for e in sorted(entries, key=key))
    return hashlib.sha1(b"tree %d\0" % len(body) + body).hexdigest()


class Upstream:
    """Upstream theme commits, each with the tree sha a vendored copy of it would have."""

    def __init__(self):
        self.commits = gh(f"repos/{THEME_REPO}/commits?per_page={UPSTREAM_COMMITS}")
        self.vendored = {}
        self.layout_files = None

    def vendored_sha(self, i):
        if i not in self.vendored:
            tree = gh(f"repos/{THEME_REPO}/git/trees/{self.commits[i]['commit']['tree']['sha']}")["tree"]
            self.vendored[i] = git_tree_sha([e for e in tree if e["path"] not in VENDOR_EXCLUDE])
        return self.vendored[i]

    def locate(self, sha):
        for i in range(len(self.commits)):
            if self.vendored_sha(i) == sha:
                return i
        return None

    def files(self):
        if self.layout_files is None:
            tree = gh(f"repos/{THEME_REPO}/git/trees/{self.commits[0]['sha']}?recursive=1")["tree"]
            self.layout_files = {e["path"] for e in tree if e["type"] == "blob"}
        return self.layout_files

    def describe(self, i):
        c = self.commits[i]
        return f"{c['sha'][:7]} {c['commit']['message'].splitlines()[0]}"


def repo_theme(repo):
    info = gh(f"repos/{repo}")
    branch = info["default_branch"]
    tree = gh(f"repos/{repo}/git/trees/{urllib.parse.quote(branch, safe='')}?recursive=1")
    files = {e["path"]: e for e in tree["tree"]}
    theme = files.get(f"themes/{THEME_DIR}")
    return branch, (theme["sha"] if theme and theme["type"] == "tree" else None), files


def check_theme(rep, repo, upstream, parent_sha):
    add = lambda level, msg: rep.add(level, "theme", msg)
    try:
        branch, sha, files = repo_theme(repo)
    except GhError as e:
        add("WARN", f"couldn't read {repo}: {e}")
        return None
    if not sha:
        add("FAIL", f"{repo}@{branch} has no themes/{THEME_DIR}/ folder")
        return None
    try:
        i = upstream.locate(sha)
    except GhError as e:
        add("WARN", f"couldn't read upstream theme commits: {e}")
        i = -1
    if i is None:
        add("FAIL", f"vendored theme ({sha[:7]}) matches none of the last {UPSTREAM_COMMITS} upstream commits: edited "
                    f"in place, or very old. Re-vendor it (README.md > Theme)")
    elif i == 0:
        add("PASS", f"vendored theme = upstream {upstream.describe(0)} (latest)")
    elif i > 0:
        newer = "; ".join(upstream.describe(k) for k in range(i))
        add("WARN", f"vendored theme = upstream {upstream.describe(i)}, {i} commit(s) behind: {newer}")
    if parent_sha and sha != parent_sha:
        add("FAIL", f"vendored theme ({sha[:7]}) differs from the blog's ({parent_sha[:7]})")
    elif parent_sha:
        add("PASS", "vendored theme is the same as the blog's")
    try:
        theme_files = upstream.files()
    except GhError:
        theme_files = set()
    forks = sorted(p for p in files if files[p]["type"] == "blob" and p in theme_files
                   and p.startswith(("layouts/", "assets/", "i18n/", "archetypes/")) and not p.startswith(ALLOWED_OVERRIDES)
                   and p != "archetypes/default.md")
    for p in forks:
        add("WARN", f"overrides the theme's {p} ({repo}@{branch}); prefer a theme param, or keep it in sync")
    if not forks:
        add("PASS", "no forked theme files (beyond hooks, panel-projects.html, i18n)")
    return sha


# ---------------------------------------------------------------- driver

def listed_sites():
    """*.danielsada.tech URLs in the blog's data/projects.yaml."""
    try:
        with open("data/projects.yaml", encoding="utf-8") as f:
            text = f.read()
    except OSError:
        return set()
    hosts = set()
    for u in re.findall(r"(?m)^\s*(?:-\s*)?url:\s*['\"]?(https?://[^\s'\"#]+)", text):
        h = urllib.parse.urlsplit(u).netloc.lower()
        if h.endswith("." + urllib.parse.urlsplit(PARENT).netloc):
            hosts.add(h)
    return hosts


def sitemap_locs(home_url):
    r = fetch(urllib.parse.urljoin(home_url, "/sitemap.xml"))
    if r.status != 200 or "<loc>" not in r.text:
        return None
    locs = [l.strip() for l in re.findall(r"<loc>\s*([^<]+?)\s*</loc>", r.text)]
    if "<sitemapindex" in r.text:
        out = []
        for child in fetch_all(locs[:10]):
            out += [l.strip() for l in re.findall(r"<loc>\s*([^<]+?)\s*</loc>", child.text)] if child.status == 200 else []
        locs = out
    return locs


def audit_site(title, home_url, repo, ref_home, person, args, upstream, parent_sha, listed, is_parent=False):
    rep = Report(title)
    locs = sitemap_locs(home_url)
    others = [u for u in (locs or []) if norm(u) != norm(home_url)][: args.pages]
    resps = fetch_all([home_url] + others)
    pages = [Page(r) for r in resps]
    rep.npages = len(pages)
    home = pages[0]
    if home.resp.status != 200:
        rep.add("FAIL", "seo", f"home page returns {home.resp.status or home.resp.err}")
        return rep, None
    ref = ref_home or home
    for pg in pages:
        if pg.resp.status == 200:
            check_sidebar(rep, pg, ref, is_parent)
    if not is_parent:
        check_look(rep, home, ref)
    for i, pg in enumerate(pages):
        check_seo_page(rep, pg, home_url)
        check_ld_page(rep, pg, home_url, i == 0, is_parent, person)
    check_seo_site(rep, home_url, pages, locs, is_parent, listed)
    sha = None
    if repo and not args.no_repo:
        if upstream is None:
            rep.add("WARN", "theme", "skipped: couldn't read the upstream theme with gh (gh auth status)")
        else:
            sha = check_theme(rep, repo, upstream, parent_sha)
    elif not args.no_repo:
        rep.add("WARN", "theme", "skipped: repo unknown (pass --site URL=owner/repo)")
    return rep, home if is_parent else sha


def main():
    global PARENT
    ap = argparse.ArgumentParser(
        prog="audit-side-projects-for-consistency.sh",
        description="Audit the live *.danielsada.tech side projects against the live blog: sidebar, theme version, "
                    "SEO and JSON-LD. FAIL = inconsistent or broken; WARN = advisory.")
    ap.add_argument("--parent", default=PARENT, help=f"the reference site (default {PARENT})")
    ap.add_argument("--site", action="append", default=[], metavar="URL[=OWNER/REPO]",
                    help="audit only these sites (repeatable); default: the known side projects plus every "
                         "*.danielsada.tech URL in data/projects.yaml")
    ap.add_argument("--pages", type=int, default=5, help="pages per site besides the home page, from its sitemap (default 5)")
    ap.add_argument("--no-repo", action="store_true", help="skip the theme/fork checks (no gh needed)")
    ap.add_argument("--no-parent", action="store_true", help="don't audit the blog's own SEO/JSON-LD")
    ap.add_argument("-q", "--quiet", action="store_true", help="print only WARN and FAIL lines")
    ap.add_argument("--no-color", action="store_true")
    args = ap.parse_args()
    PARENT = norm(args.parent if "://" in args.parent else "https://" + args.parent)
    color = sys.stdout.isatty() and not args.no_color

    listed = listed_sites()
    sites = {}
    if args.site:
        for s in args.site:
            url, _, repo = s.partition("=")
            url = norm(url if "://" in url else "https://" + url)
            p = urllib.parse.urlsplit(url)
            sites[p.netloc] = (f"{p.scheme}://{p.netloc}/", repo or KNOWN_SITES.get(p.netloc))
    else:
        for host in sorted(set(KNOWN_SITES) | listed):
            sites[host] = (f"https://{host}/", KNOWN_SITES.get(host))

    upstream = None
    if not args.no_repo:
        try:
            upstream = Upstream()
        except GhError as e:
            print(f"audit: theme checks skipped, can't read {THEME_REPO} with gh: {e}", file=sys.stderr)

    phost = urllib.parse.urlsplit(PARENT).netloc
    print(f"Auditing {len(sites)} side project(s) against {PARENT}" + ("" if args.no_repo else f" (theme: {THEME_REPO})"))
    parent_rep, parent_home = audit_site(f"{phost}  (reference, {PARENT_REPO})", PARENT, PARENT_REPO, None, None,
                                         args, upstream, None, True, is_parent=True)
    if parent_home is None:
        parent_rep.print(args.quiet, color)
        print("\naudit: the reference site is unreachable", file=sys.stderr)
        return 1
    parent_sha = None
    if upstream is not None:
        try:
            parent_sha = repo_theme(PARENT_REPO)[1]
        except GhError:
            pass
    person = ref_person(parent_home)
    reports = [] if args.no_parent else [parent_rep]
    for host, (url, repo) in sites.items():
        rep, _ = audit_site(f"{host}  ({repo or 'repo unknown'})", url, repo, parent_home, person,
                            args, upstream, parent_sha, host in listed)
        reports.append(rep)
    for rep in reports:
        rep.print(args.quiet, color)
    print("\n== Summary")
    w = max(len(r.title.split()[0]) for r in reports)
    print(f"  {'site':<{w}}  FAIL  WARN  PASS")
    for r in reports:
        print(f"  {r.title.split()[0]:<{w}}  {r.count('FAIL'):>4}  {r.count('WARN'):>4}  {r.count('PASS'):>4}")
    return 1 if any(r.count("FAIL") for r in reports) else 0


sys.exit(main())
PYTHON
