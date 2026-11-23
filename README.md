# danielsada.tech
🌐 My personal website, made with [Hugo](https://gohugo.io/).

## Running the project

Requires **Hugo 0.170.1** (any edition; the theme needs ≥ 0.158). Use the same version locally and in the deploy (see below).

```sh
hugo server        # http://localhost:1313/
hugo               # build into public/
```

## Deploy

The site is deployed by **Cloudflare Pages** from the `master` branch (build system v2):

| Setting | Value |
|---|---|
| Build command | `hugo` |
| Build output directory | `public` |
| Environment variable (Production and Preview) | `HUGO_VERSION` = `0.170.1` |

Keep `HUGO_VERSION` in the Pages settings in sync with the Hugo version you use locally (minimum 0.158). Redirects live in `static/_redirects`, which Hugo copies to `public/_redirects` where Pages reads it.

## Theme

The site uses **Breeze Plasma** ([hugo-breeze-plasma-inspired-theme](https://github.com/danielsada/hugo-breeze-plasma-inspired-theme)),
vendored as plain files in `themes/hugo-breeze-plasma-inspired-theme/`.
To update it, replace that folder with a newer copy of the theme repository, without its repo-only folders (`exampleSite/`, `docs/`, `images/`, `scripts/`, `.github/`).
Don't edit files in the vendored theme. Customise the site with the theme's configuration and extension points instead:

| What | Where |
|---|---|
| Identity, colours, archive, home widgets, menus (Places, Elsewhere) | `hugo.toml` (`[params]`, `[menus]`) |
| Home intro | `content/_index.md` |
| All posts archive | `content/posts/_index.md` |
| Sections (Blog EN, Notas ES) | `content/blog/_index.md`, `content/notas/_index.md` |
| Projects | `data/projects.yaml` and `content/projects.md` |
| Latest talk | `data/talks.yaml` (poster in `assets/images/talks/`) |
| Extra CSS (chat bubbles…) | `assets/css/custom.css` |
| JSON-LD structured data | `layouts/_partials/hooks/head-end.html` |

The theme's README documents every option.

Markdown images that point to `/images/…` are resized and converted to WebP by the theme, because `static/images` is also mounted as `assets/images` (see `[module]` in `hugo.toml`).

### Chat bubbles

```md
Hello
{.bubble .left}

How are you doing? This is some larger text that needs more space.
{.bubble .p .right}
```

## Auditing side projects

The side projects on `*.danielsada.tech` (WATolls, Voltra, Ninja…) look like pages of this site: the same panel,
colours, logo and Places/Elsewhere menus, with absolute links back here. Each one vendors its own copy of the theme
and copies the menus into its `hugo.toml`, so they drift. To check them against this site:

```sh
./audit-side-projects-for-consistency.sh             # every known side project
./audit-side-projects-for-consistency.sh -q          # only WARN and FAIL lines
./audit-side-projects-for-consistency.sh --site https://new.danielsada.tech/=danielsada/new-repo
./audit-side-projects-for-consistency.sh --site http://localhost:1313/ --no-parent   # a local `hugo server`
```

For a local server, pass the exact base URL it prints (`hugo server` uses `http://localhost:1313/` by default); with
another host name the canonical, sitemap and WebSite checks fail.

It compares the **live** sites with the live blog, so deploy before re-running (or audit a local `hugo server`, where the
https checks don't apply). Needs bash and Python 3.8+ (standard
library only), plus an authenticated `gh` for the theme checks (`--no-repo` skips them). It exits 1 on any FAIL.

| Area | Checks |
|---|---|
| sidebar | Places and Elsewhere (names, links, icons, badges; post counts and the current item are ignored) on every sampled page; the logo links to danielsada.tech; logo, favicon and wallpaper are the same files; accent/ink/wall colours, panel and logo width, `color-scheme`, `theme-color` |
| theme | the vendored theme on the repo's default branch is the blog's and the latest upstream commit (lists newer ones); theme files the site overrides, other than hooks, `panel-projects.html` and i18n |
| seo | `lang`, `<title>`, meta description (50–160 chars), canonical, `noindex`, viewport, favicon, Open Graph (the image loads), `twitter:card`, duplicate titles/descriptions; `robots.txt` and its `Sitemap:` line, sitemap URLs return 200, missing pages return 404, http→https; listed in `data/projects.yaml` |
| json-ld | blocks parse with a schema.org `@context`; home has a `WebSite` with the site's URL and a `Person` "Daniel Sada" with url https://danielsada.tech/ and the same `sameAs` as this site's; other pages have a WebPage/Article node and a `BreadcrumbList` |

The sites it audits by default are `KNOWN_SITES` at the top of the script plus every `*.danielsada.tech` URL in
`data/projects.yaml`.

New side projects start from the private template repo
[danielsada/side-project-template](https://github.com/danielsada/side-project-template) (shared `hugo.toml` blocks,
panel sections, JSON-LD, `AGENTS.md`, a checklist and a weekly run of this audit). If you change Places, Elsewhere,
the colours or the panel width here, change them in the template and in each side project too; the audit flags
the ones you miss.

## URLs

Posts live at `/blog/<file>/` and `/notas/<file>/`, and taxonomies at `/tags/`, `/categories/`, `/etiquetas/`, `/categorias/` and `/series/`. These are Hugo's defaults, so there's no `[permalinks]` block. If you change a URL, add an `aliases` entry to the post's front matter or a rule to `static/_redirects`.
