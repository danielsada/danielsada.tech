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

## URLs

Posts live at `/blog/<file>/` and `/notas/<file>/`, and taxonomies at `/tags/`, `/categories/`, `/etiquetas/`, `/categorias/` and `/series/`. These are Hugo's defaults, so there's no `[permalinks]` block. If you change a URL, add an `aliases` entry to the post's front matter or a rule to `static/_redirects`.
