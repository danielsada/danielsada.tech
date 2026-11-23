# Breeze Plasma: a Hugo theme

A calm, KDE Plasma / Breeze-inspired blog theme. The wallpaper sits behind one translucent navigation panel, and everything you read is on opaque Breeze cards. It respects your reader: light/dark mode follows the OS, it loads no web fonts, it makes no third-party requests, and every page typically weighs under 100 KB.

![The example site's home page, half in light mode and half in dark mode](images/screenshot.png)

**[Live demo →](https://danielsada.github.io/hugo-breeze-plasma-inspired-theme/)** (the `exampleSite/`, rebuilt on every push by `.github/workflows/pages.yml`)

**Contents:** [Highlights](#highlights) · [Screenshots](#screenshots) · [Quick start](#quick-start) · [Install](#install) · [Content model](#content-model) · [Configuration](#configuration) · [Recipes](#recipes) · [Performance, privacy and accessibility](#performance-privacy-and-accessibility) · [Development](#development) · [Credits](#credits-and-trademarks)

## Highlights

**Reading**
- Posts are set in a serif reading face at about 66 characters per line. Dark mode uses softened ink to avoid halation.
- "On this page" sits in the panel on desktop and highlights the section you're reading. A long outline scrolls in its own area, fades at its edges and keeps the current entry in view. On phones it becomes a collapsible table of contents above the post.
- A thin reading-progress bar, quiet `#` heading links, reading time, and "Part n of m" with previous/next links for series.
- Syntax highlighting through Hugo's class-based highlighter, so the colours live in the stylesheet. Markdown images are resized to WebP, lazy-loaded and get captions from their titles.

**Finding things**
- A Dolphin-style archive window. A *Show* pane lists sections, series, tags and years with counts, and there's an instant filter box (press <kbd>/</kbd>) that matches the start of words in titles, descriptions and tags. The filter and the search are kept in the URL, so Back from a post, reload and shared links bring the same view back.
- Every section, series and tag is a real page, so the theme works without JavaScript.
- Places (your menu), an optional Projects box and your social links live in one translucent panel that stays put on every page. On phones it becomes a drawer.

**Home page**
- Widgets in two columns that you can reorder, hide or extend:
  - `intro`, `latest` (headline posts), `recent` (compact list) and `series`;
  - `project` (a featured project), `talk` (a privacy-friendly video), and `section` (e.g. a second-language section);
  - your own widgets.

**Projects and talks**
- A projects page grouped by status, from `data/projects.yaml`, and a featured-project card on the home page.
- Talks and videos use a lazy YouTube facade. YouTube receives nothing until the reader presses play; then the player loads from youtube-nocookie.

**Languages**
- English and Spanish UI strings ship with the theme, and every string can be overridden.
- A section can be written in another language than the site (say, a Spanish `notas` section on an English blog). It gets its own `lang`, UI strings, dates and badge.

**Yours to change**
- Almost everything is a setting: identity, logo, accent colours, wallpaper, fonts, navigation, widgets, archive behaviour and post features.
- There are hooks for `<head>`, the end of `<body>` and the end of every post, plus custom CSS, your own icons and alternative page layouts.

## Screenshots

| | |
|---|---|
| ![All-posts archive filtered to a series, with the Show pane](docs/images/archive.png) | ![A post in dark mode with its "On this page" outline and a code block](docs/images/post-dark.png) |
| **Archive:** Show pane, filters, search | **Post:** outline, code, dark mode |
| ![Projects page grouped by status](docs/images/projects.png) | ![The Spanish Notas section in dark mode](docs/images/notas-dark.png) |
| **Projects:** grouped by status | **A second-language section:** Spanish UI and dates |

![Three phones: the home page, a post with its table of contents open, and the navigation drawer](docs/images/mobile.png)

## Requirements

**Hugo ≥ 0.158.0** (the standard edition is enough; extended isn't needed). Tested with 0.170.1.

The theme uses the template system introduced in 0.146 (`layouts/_partials`, `layouts/_markup` and so on). It also uses `hugo.Data` (0.156) and `Language.Name`/`Language.Locale` (0.158). Those versions deprecated `.Site.Data`, `languageCode` and `.Language.Lang`. On Netlify, set `HUGO_VERSION = "0.170.1"` (or newer).

The CSS relies on `light-dark()`, `color-mix()`, container queries and `:has()`. These are supported by Chrome and Edge 123+, Firefox 121+ and Safari 17.5+, which covers every evergreen browser since mid-2024.

## Try the example site

```sh
git clone https://github.com/danielsada/hugo-breeze-plasma-inspired-theme
cd hugo-breeze-plasma-inspired-theme
hugo server -s exampleSite
# → http://localhost:1313/
```

`exampleSite/` exercises every feature:

- an English blog and a Spanish `notas` section;
- two series (three parts and two parts), tags and years;
- 12 projects (with the panel's Projects box), a talk and an About page;
- code, quotes, tables, figures and a table of contents.

`exampleSite/hugo.toml` lists every option with its default.

## Quick start

Start a new site and copy the theme in:

```sh
hugo new site my-blog && cd my-blog
git clone --depth 1 https://github.com/danielsada/hugo-breeze-plasma-inspired-theme themes/hugo-breeze-plasma-inspired-theme
rm -rf themes/hugo-breeze-plasma-inspired-theme/.git   # vendor it; no submodule needed
```

Then replace `hugo.toml` with this minimal configuration:

```toml
baseURL = "https://example.org/"
title = "Your Name"
locale = "en-US"
theme = "hugo-breeze-plasma-inspired-theme"
mainSections = ["blog"]
capitalizeListTitles = false

[taxonomies]
  tag = "tags"
  series = "series"

[markup]
  [markup.highlight]
    noClasses = false
  [markup.tableOfContents]
    startLevel = 2
    endLevel = 3
  [markup.goldmark.parser]
    wrapStandAloneImageWithinParagraph = false

[params]
  tagline = "What you write about"
  [params.author]
    name = "Your Name"
    email = "you@example.org"

[[menus.main]]
  name = "All posts"
  pageRef = "/posts"
  [menus.main.params]
    icon = "blog"
[[menus.main]]
  name = "About"
  pageRef = "/about"
  [menus.main.params]
    icon = "user"
```

Add an All-posts page, an About page and a first post, then run the server:

```sh
mkdir -p content/posts
printf -- '---\ntitle: All posts\nparams:\n  archive: true\n---\n' > content/posts/_index.md
printf -- '---\ntitle: About me\n---\nHello!\n' > content/about.md
hugo new content blog/hello-world.md
hugo server -D
```

From there, add widgets, projects and talks as described below. Every option is optional.

## Install

**Vendored (copy into your site):**

```sh
mkdir -p themes && cp -r path/to/hugo-breeze-plasma-inspired-theme themes/
```

Then add this to your `hugo.toml`:

```toml
theme = "hugo-breeze-plasma-inspired-theme"
```

**Hugo Module:**

```toml
[module]
  [[module.imports]]
    path = "github.com/danielsada/hugo-breeze-plasma-inspired-theme"
```

Either way, copy the `[markup]` block from the quick start or from `exampleSite/hugo.toml`. It enables class-based syntax highlighting, the table-of-contents levels and figures for titled images. Also consider `capitalizeListTitles = false`, which keeps tag and series names as you wrote them.

## Content model

| What | Where | Notes |
|---|---|---|
| Posts | Any section listed in `mainSections` (e.g. `content/blog/`, `content/notas/`) | Front matter: `title`, `date`, `description` (also the lead and the archive summary), `tags`, `series`, and `params.mark` (a small label in the archive, e.g. "Project"). |
| All posts | `content/posts/_index.md` with `params.archive: true` | Lists every post in `mainSections`. Change the path with `params.archive.path`. `params.subtitle` is shown in the title bar (HTML allowed). |
| Section metadata | The section's `_index.md` | `params.badge` (e.g. "ES"), `params.icon`, `params.lang`, `params.subtitle`, `params.backlabel`, and `params.card.{title,text,tint}` for the home section card. |
| Second-language section | Set `params.lang: es` in that section's `_index.md` | Its pages get `<html lang="es">` and Spanish UI strings, and a badge in mixed lists. "Latest posts" leaves them out (they get their own card). |
| Series | The `series` taxonomy | Needs at least `params.series.min` posts. Adds "Part n of m" and previous/next-in-series links, and its term page lists the posts oldest first. |
| Home intro | `content/_index.md` | `params.kicker`, `params.heading`, the page body, and `params.links: [{text, url \| ref \| latest: true}]`. |
| About and other pages | e.g. `content/about.md` | Shown as one card. `params.sayhi: true` appends email and social links. |
| Projects page | `content/projects.md` with `params.view: projects` | Rows come from `data/projects.yaml`. |
| Projects | `data/projects.yaml` | `name`, `status`, `since`, `summary`, `description`, `pitch` (home copy), `stack`, `icon`, `url`, `urllabel`, `writeup`, `writeuplabel`, `links`, `featured`. |
| Talks | `data/talks.yaml` | `title`, `event`, `year`, `youtube` (video id), `duration`, `poster`, `url`, `companion`, `companiontext`, `featured`. |

Videos inside posts use the `youtube-lite` shortcode:

```md
{{</* youtube-lite id="VIDEO_ID" title="What it is" duration="12:34" poster="poster.jpg" */>}}
```

Don't use Hugo's built-in `youtube` shortcode. It embeds the iframe on page load.

## Configuration

All options live under `[params]`. Every one is optional.

| Option | Default | What it does |
|---|---|---|
| `description`, `tagline` | none | Meta description; the subtitle under your name and the home kicker |
| `logo` | monogram | An `assets/` path (processed) or a `static/` path |
| `logowidth`, `logoplate`, `logoname` | `64`, `true`, `true` | Logo width in px, whether it sits on a light plate, and whether your name is shown beside it |
| `homeurl`, `hometitle` | none, the URL's host | An absolute URL the logo and name link to instead of this site's home, e.g. a main site above a subdomain site, and the link's tooltip. Breadcrumbs still start at this site's home. || `colorscheme` | `auto` | `auto`, `light` or `dark` |
| `favicon`, `ogimage`, `titlesuffix`, `crumbroot` | none | Head and breadcrumb details |
| `titleseparator` | `" · "` | Goes between the page title and the site title in `<title>` and feed titles, e.g. "Projects · Your Name" |
| `author.name`, `author.email`, `author.page` | none | Byline, contact and the About link |
| `author.emaillabel` | none | Visible text for your address, e.g. `"you [at] example.org"`. Used wherever the theme prints it (byline, About "say hi", a Places entry or intro link whose text is the address); links still use `mailto:` with the real address. |
| `colors.light.accent` / `.ink`, `colors.dark.accent` / `.ink` | Purple | Accent colours. `ink` is the text and focus-ring colour; keep it at least 4.5:1 against the card. |
| `colors.light.wall`, `colors.dark.wall` (or `colors.wall` for light) | `#3d6fd6`, `#121631` | Base colour under the wallpaper, also shown on overscroll |
| `colors.light.chrome`, `colors.dark.chrome` | `#eef0f4`, `#1c1f24` | Browser UI colour (`<meta name="theme-color">`) per scheme |
| `wallpaper` | `breeze/wallpaper.svg` | An `assets/` path, a static path, or `"none"` |
| `fonts.sans`, `fonts.read`, `fonts.mono` | System stacks | CSS font stacks. `read` is the long-form reading face. |
| `archive.path`, `archive.taxonomy` | `/posts`, `tags` | The All-posts page and the taxonomy shown in rows |
| `archive.showtags`, `archive.rowtags`, `archive.search` | `8`, `2`, `true` | Tags in the Show pane, tags visible per row, and the search box |
| `archive.headercount` | `false` | Show "N posts" / "N terms" in the title bar of section, tag, series and taxonomy pages |
| `series.taxonomy`, `series.min` | `series`, `2` | Series behaviour |
| `dates.short`, `dates.long` | `2 Jan 2006`, `2 January 2006` | Go date layouts for lists and for posts |
| `post.toc`, `post.progress`, `post.readingtime`, `post.anchors`, `post.postnav`, `post.byline` | All `true` | Post features. You can also turn the TOC off per page with `params.toc: false`. |
| `post.shiftheadings` | `false` | `true` renders content headings one level down (`# ` becomes `<h2>`), so the page title stays the only `<h1>` and the sections appear in "On this page". `"auto"` does this only on pages that use `# ` headings. |
| `post.toclevels` | `[2, 3]` | Heading levels listed in "On this page" (after shifting). The outline is indented from the shallowest level present. |
| `images.maxwidth`, `images.quality` | `960`, `75` | Settings for Markdown images, which are converted to WebP |
| `rss.panel` | `true` | Shows the RSS icon in the panel |
| `projects.page`, `projects.statuses` | `/projects`, `[Live, Beta, Paused, Archived]` | The projects page and the order of its status groups |
| `panel.width` | `"15.5rem"` | Width of the left panel on desktop, as a CSS length in `rem`, `em` or `px` (e.g. `"17rem"` so longer project names fit). The layout, the centred reading card and the panel's truncation follow it; on phones the panel is a drawer and ignores it. Other values are ignored with a build warning. |
| `panel.projects.enable`, `.limit`, `.title`, `.pages`, `.collapse`, `.live` | `false`, `5`, "Projects", `all`, `true`, first status | The panel's Projects box (see Navigation) |
| `home.main`, `home.side` | intro, latest, recent / project, talk | The home widgets, in order (see below) |

### Navigation

`[[menus.main]]` becomes the panel's **Places** list. Each entry can set:

- `params.icon`: the name of any icon;
- `params.badge`: a short label, e.g. "ES";
- `params.count`: show the section's post count (on the All-posts entry it counts every post);
- `params.lang`: the language of the label.

`[[menus.social]]` becomes the **Elsewhere** icon row; set `params.icon` on each entry. The RSS icon is added automatically.

Without a main menu, Places lists the All-posts page and every main section. When you're on a post, the Places entry it belongs to is marked current.

**Projects box.** With `[params.panel.projects] enable = true`, the panel also lists your projects from `data/projects.yaml` below Places (and below "On this page" on posts). It shows compact rows (icon, name and a green dot for the `live` status), featured first, then newest (`since`) first, up to `limit`. When there are more, it adds "All projects (N) →". Rows link to the project's `url`, else its `writeup`, else its row on the projects page.

- The box is a collapsible section with its own scroll area, so 10–20 projects never push Places out of place.
- On posts it starts collapsed (`collapse = false` to keep it open), because the outline needs the room. Set `pages = "nonpost"` to leave it off posts entirely. In the mobile drawer it starts open.
- It complements, rather than replaces, the home `project` card and the projects page. Keep a Places entry for `/projects` too: it's the main way there, and it's marked current on that page.

### Home widgets

```toml
[[params.home.main]]
  widget = "intro"
[[params.home.main]]
  widget = "latest"   # count, sections, title
  count = 3
[[params.home.main]]
  widget = "recent"   # offset, count, sections, title, links = false, serieslinks = false
[[params.home.main]]
  widget = "series"   # title, sort = "latest" | "name", limit, counts = true, date = "latest" | "first" | "none"
[[params.home.side]]
  widget = "project"  # title
[[params.home.side]]
  widget = "talk"     # title
[[params.home.side]]
  widget = "section"  # section (required), count, tint = "note" | "plain"
  section = "notas"
```

Add `enable = false` to hide a widget. The `series` widget lists every series (with at least `series.min` posts): name, number of parts and the date of its latest (or first) part. It is left out when there are none. When the `series` widget is on the page, set `serieslinks = false` on `recent` so its "more" row doesn't repeat the series (it keeps "All posts →" and the section links).

To add your own widget, create `layouts/_partials/home/<name>.html` in your site. It's called with `(dict "page" . "cfg" <its table>)`. The `main` widgets form the left column on wide screens. On phones they come first, followed by the `side` widgets.

### Icons

The icons are monochrome SVGs in `assets/breeze/icons/`, combined at build time into one cacheable sprite.

- **Add an icon:** drop `assets/breeze/icons/<name>.svg` into your site and use `<name>` anywhere an icon is accepted (menus, sections, projects).
- **Replace an icon:** use the same file name as the theme's icon.

The theme ships: blog, notas, series, apps, user, mail, github, linkedin, x, globe, link, rss, ext, folder, tag, cal, search, menu, close, toc, image, play, terminal, chart and box.

### Languages

UI strings live in `i18n/en.toml` and `i18n/es.toml`. To override any string for your site's language, put it in your own `i18n/<lang>.toml`. `all_posts_arrow` receives `.Count` (the number of posts), e.g. `other = "All {{ .Count }} posts →"`.

A section in a different language than the site (`params.lang` in its `_index.md`) uses that language's strings. The theme mounts its `i18n/` folder at `data/breeze/i18n/` for this. To add or override strings for such a section, create `data/breeze/i18n/<lang>.toml` in your site, using the same format.

### Styling and templates

- **Extra CSS:** create `assets/css/custom.css`. It's appended to the theme's stylesheet.
- **Head and body hooks:** override `layouts/_partials/hooks/head-end.html` and `hooks/body-end.html`.
- **Post-end hook:** override `layouts/_partials/hooks/post-end.html` to add something to the end of every post (a newsletter form, comments, a "subscribe" line). It renders inside the post card, after the tags and the series/older/newer links, with the page as context. The theme's copy is empty; when your hook outputs nothing, no wrapper or spacing is added. `exampleSite/layouts/_partials/hooks/post-end.html` shows a one-line RSS invitation.
- **Alternative page layouts:** set `params.view: <name>` on a page or section to render it with `layouts/_partials/views/<name>.html`, which receives the page as its context. The theme ships `post` and `page` (regular pages) and `projects` (any page). `archive` is used by sections and terms, and `terms` by taxonomy pages; both expect what those templates pass them, so they can't be picked with `params.view` on another kind of page.
- **Any other theme file:** copy it to the same path in your site and edit it.

## Recipes

**Use your own accent colour.** Pick a colour for each scheme, plus a darker (light mode) or lighter (dark mode) `ink` for text, links and focus rings. Keep `ink` at 4.5:1 or more against the card (`#fcfcfc` light, `#1f2226` dark).

```toml
[params.colors.light]
  accent = "#1d99f3"   # Breeze blue
  ink = "#0f5e9c"
[params.colors.dark]
  accent = "#3daee9"
  ink = "#93cef5"
```

**Change or drop the wallpaper.** Put an image in `assets/` and set `wallpaper = "images/wall.jpg"`, or use `wallpaper = "none"` with `colors.wall = "#2a2e32"` for a plain background.

**Use your logo.** Use `logo = "images/logo.svg"` (an `assets/` path). Set `logoplate = false` if the logo has its own background, and `logoname = false` if it already contains your name. Without a logo, the theme draws a monogram from your initials.

**Add a section in another language.** Create `content/notas/_index.md` with `params: { lang: es, badge: ES }`, add `"notas"` to `mainSections`, and optionally add a `section` widget for it on the home page. To add a language the theme doesn't ship, add `data/breeze/i18n/<lang>.toml` (copy `i18n/en.toml` and translate it).

**Write your own home widget.** Create `layouts/_partials/home/now.html`:

```go-html-template
<section class="card" aria-labelledby="now-h">
  <div class="card-h"><h2 id="now-h">{{ .cfg.title | default "Now" }}</h2></div>
  <p>{{ .cfg.text }}</p>
</section>
```

Then add it to the config:

```toml
[[params.home.side]]
  widget = "now"
  text = "Learning Zig, renovating a bike, reading Kill It with Fire."
```

**Add comments or a newsletter form** to every post with `layouts/_partials/hooks/post-end.html`. It receives the page, so `.Section`, `.Params` and so on work, and you can show the form on some sections only.

**Add analytics or site verification** with `layouts/_partials/hooks/head-end.html`. The theme itself loads nothing from third parties.

**Embed a talk in a post** with `{{</* youtube-lite id="…" title="…" duration="…" poster="poster.jpg" */>}}`. The poster can be a page-bundle image, which is resized to a small WebP.

**Serve the site from a sub-path** (e.g. a GitHub Pages project site at `https://you.github.io/repo/`). Set `baseURL` to the full URL, including the sub-path. The theme builds every link from the page URLs, and Markdown links written from the root (`[about](/about/)`) are resolved to the page or prefixed with the sub-path. This repo's `.github/workflows/pages.yml` deploys the example site this way and can be copied for your own site.

## Performance, privacy and accessibility

Measured on the example site with Hugo 0.170.1 in Edge, with an empty cache. The numbers include every asset the page loads and are uncompressed (gzip roughly halves them).

| Page | Weight |
|---|---|
| Home (with talk poster) | 62 KB |
| All posts (16 posts, Show pane) | 75 KB |
| A section, tag or series page | 64–73 KB |
| A post | 59–65 KB (the style-check post reaches 107 KB once its lazy images load) |
| Projects, About | 65 KB, 57 KB |

About 48 KB of that is shared and cached across pages: the CSS (32 KB), JavaScript (8 KB), icon sprite (6 KB) and wallpaper (2 KB). These files are minified where relevant and fingerprinted, so they can be cached forever.

**Privacy**
- No web fonts, analytics, cookies or third-party requests.
- The YouTube player is a poster and a link until it's clicked; only then is the youtube-nocookie iframe created. Without JavaScript it stays a plain link to YouTube.

**Accessibility**
- A skip link, labelled landmarks and a clean heading outline. Card links sit outside headings.
- Focus is always visible. The mobile drawer moves focus to its close button, traps Tab, closes on Escape and returns focus, and makes the page behind it inert.
- Archive filters announce their results through a live status line. Outline links move focus to the heading they point to.
- `lang` attributes are set on whole pages, sections and individual titles in another language.
- Text contrast is at least 4.5:1 in both schemes, including over the translucent panel. Touch targets are 44 px on coarse pointers. `prefers-reduced-motion` is respected.

### Known limitations

- Year pages are year groups on the archive (`/posts/#y2025`), not separate pages. Hugo can't generate pages per year without front matter. Without JavaScript, a year link jumps to that year's group.
- The panel is hidden off-canvas on phones by an inline `html.js` marker. If inline scripts run but `script.js` is blocked, the drawer can't open.

## Development

```
assets/breeze/       style.css, script.js, wallpaper.svg, icons/*.svg (built into one sprite)
i18n/                UI strings (en, es); also mounted as data/breeze/i18n/ for other-language sections
layouts/             baseof, home, page, section, term, taxonomy, 404, rss.xml
  _partials/breeze/  head, panel, identity, archive rows, helpers (lang, t, date, series…)
  _partials/views/   post, page, archive, projects, terms
  _partials/home/    intro, latest, recent, series, project, talk, section
  _partials/hooks/   head-end, body-end, post-end (empty; override in your site)
  _markup/           heading, image and link render hooks
  _shortcodes/       youtube-lite
exampleSite/         a complete demo site that uses every feature
scripts/             screenshots.py (regenerates the images in this README)
```

- **Work on the theme:** `hugo server -s exampleSite`. The example site imports the theme from `../..` through a module replacement, so edits show up live.
- **Refresh the screenshots:** after `hugo -s exampleSite`, run `python scripts/screenshots.py exampleSite/public` (needs `pip install playwright` and `playwright install chromium`). This rewrites `images/screenshot.png`, `images/tn.png` and `docs/images/`.
- **Before sending a change,** check the example site at 390, 1024, 1440 and 2560 px in light and dark mode, and with JavaScript off. Also check that the build prints no warnings.

## Credits and trademarks

- Inspired by the look of [KDE Plasma](https://kde.org/plasma-desktop/)'s Breeze style and the Dolphin file manager. This is an independent project, not affiliated with or endorsed by KDE e.V. "KDE" and "Plasma" are trademarks of KDE e.V.
- The wallpaper and icons are original drawings, except the GitHub mark, which comes from GitHub's [Octicons](https://github.com/primer/octicons) (MIT).
- The example site's sample talk links to *Big Buck Bunny* (© Blender Foundation, CC BY 3.0) on YouTube.

## License

MIT
