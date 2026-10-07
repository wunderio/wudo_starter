# Wudo Drupal starter

Drupal 11 starter project containing the site dependencies, custom theme,
custom module, and project recipes in one repository. The project uses
`web/` as its document root.

![Wudo screenshot](web/themes/custom/wudo/screenshot.png)

## Repository layout

- `web/` is the Drupal document root.
- `web/themes/custom/wudo/` contains the custom theme and its component source.
- `web/modules/custom/wudo_theme_extension/` contains custom Drupal behavior and API endpoints.
- `recipes/` contains the content recipes applied during installation.
- `config/sync/` contains exported Drupal configuration tracked in Git.
- `vendor/` and frontend dependencies are generated locally and are not committed.

Contributed extensions are managed by Composer. Custom extensions and recipes
are committed directly in this repository.

## Quick start

Requires [DDEV](https://ddev.com). Everything else, including Composer and
Node.js, runs inside the containers.

```bash
git clone git@github.com:wunderio/wudo_starter.git && cd wudo_starter
ddev start
ddev site-install
```

`ddev site-install` installs the Composer and npm dependencies, builds the
theme, installs Drupal from the configuration in `config/sync/`, creates the
home page and the error pages, builds the XML sitemap and prints a one-time
login link. Add `--demo` to install the demo
content (articles, a gallery and landing pages) instead of the bare home page:

```bash
ddev site-install --demo
```

Running the command on an existing site reinstalls it; Drush asks before
dropping the database.

## Installing without DDEV

Create `web/sites/default/settings.local.php` with the database connection
(see `web/sites/example.settings.local.php`), set the `DRUPAL_HASH_SALT`
environment variable, then run from the project root:

```bash
composer install
(cd web/themes/custom/wudo && npm ci && npm run build)
vendor/bin/drush site:install --existing-config
vendor/bin/drush recipe ../recipes/error_pages
vendor/bin/drush recipe ../recipes/base_content
vendor/bin/drush xmlsitemap:rebuild
```

Use `../recipes/demo` in place of `../recipes/base_content` for the demo
content.

## Configuration

`config/sync/` is the single source of truth for site configuration, and the
site is installed from it. Export after making intentional changes and import
when deploying:

```bash
ddev drush config:export
ddev drush config:import
```

## Content recipes

- `recipes/error_pages` holds the "Page not found" and "Access denied" pages
  and is always applied.
- `recipes/base_content` holds the home page. The front page setting points to
  its `/home` alias.
- `recipes/demo` holds the demo content, including its own `/home` page.

Apply only one of the last two to a site. To update a recipe from a running site,
export the entities with their dependencies:

```bash
ddev drush content:export node --with-dependencies --dir=../recipes/demo/content
ddev drush content:export menu_link_content --dir=../recipes/demo/content
```

The `wudo_theme_extension` module makes paragraphs and hand-set URL aliases
part of the export; paragraphs are written inline in the entity that owns them.

## Settings and secrets

`web/sites/default/settings.php` is tracked in Git and contains no credentials.
Database connections, API keys and other environment-specific values belong in
`settings.local.php`, which is ignored, or in environment variables. Never
commit credentials or production secrets.

The DDEV-generated `settings.ddev.php` is local-only. Its permissive
`trusted_host_patterns` setting is suitable for local development only; set
explicit host patterns before deploying to a shared or production environment.

## SEO and security defaults

- `metatag` provides titles, descriptions, canonical URLs and Open Graph tags.
- `xmlsitemap` serves `/sitemap.xml` for all three content types; the error
  pages and the front page node are left out.
- `redirect` keeps old URLs working when aliases change.
- `csp` enforces a Content Security Policy that allows scripts from the site
  itself only. Inline scripts and inline event handlers (`onclick="…"`) are
  blocked, so attach behavior from JavaScript files. Embeds are allowed from
  YouTube and Vimeo; add other sources at `/admin/config/system/csp`.
- `seckit` sends `Strict-Transport-Security` and `Referrer-Policy`.

## Theme development

Run these commands from `web/themes/custom/wudo`:

```bash
npm run dev
npm run dev:sdc
npm run storybook
```

Build production assets with `npm run build`. `node_modules/`, `dist/` and the
`.css` files compiled next to each component's `.scss` are ignored by Git and
recreated by the build, so run it after changing any `.scss` file.

### Twig template suggestions

Enable Drupal's local theme development mode to show Twig template filenames
and suggestions as HTML comments in the page source:

```bash
ddev drush theme:dev on
ddev drush cr
```

Open the page source in the browser and look for comments such as
`THEME DEBUG` and `THEME HOOK SUGGESTIONS`. Disable it before production:

```bash
ddev drush theme:dev off
ddev drush cr
```
