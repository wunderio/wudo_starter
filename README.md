# Wudo Drupal starter

Drupal 11 starter project containing the site dependencies, custom theme,
custom module, and project recipes in one repository. The project uses
`web/` as its document root.

## Repository layout

- `web/` is the Drupal document root.
- `web/themes/custom/wudo/` contains the custom theme and its component source.
- `web/modules/custom/wudo_theme_extension/` contains custom Drupal behavior and API endpoints.
- `recipes/` contains project recipes that can be applied with Drush.
- `config/sync/` contains exported Drupal configuration tracked in Git.
- `vendor/` and frontend dependencies are generated locally and are not committed.

Contributed extensions are managed by Composer. Custom extensions and recipes
are committed directly in this repository.

## Install dependencies

```bash
composer install
cd web/themes/custom/wudo
npm ci
npm run build
cd ../../../..
```

## Install the site and apply configuration

After configuring a Drupal database and `web/sites/default/settings.php`, run
the site installation and recipe from the project root:

```bash
vendor/bin/drush site:install standard --root=web
vendor/bin/drush recipe recipes/wudo_site
vendor/bin/drush config:import --source=config/sync
vendor/bin/drush cr
```

The `wudo_site` recipe installs the custom module, installs the custom theme,
and sets it as the default front-end theme. Configuration in `config/sync/`
is handled separately by Drupal's configuration management system. Recipes
bootstrap the site; configuration sync is used for subsequent deployment.

Before the first import, set this in the environment's local
`web/sites/default/settings.php`:

```php
$settings['config_sync_directory'] = '../config/sync';
```

In the included DDEV setup, this value is already set in the local
`web/sites/default/settings.ddev.php` file.

Export configuration after making intentional changes:

```bash
vendor/bin/drush config:export --destination=config/sync
```

## Settings and secrets

`web/sites/*/settings.php` is local-only and ignored by Git. Never commit this
file, database credentials, API keys, or production secrets. Keep the tracked
`default.settings.php` as the template for new environments and use local
include files for environment-specific values.

The DDEV-generated `settings.ddev.php` is also local-only. Its permissive
`trusted_host_patterns` setting is suitable for local development only; set
explicit host patterns before deploying to a shared or production environment.

For local development with DDEV:

```bash
ddev start
ddev composer install
ddev drush site:install standard --root=web
ddev drush recipe recipes/wudo_site --root=web
ddev drush config:import --source=config/sync --root=web
```

## Theme development

Run these commands from `web/themes/custom/wudo`:

```bash
npm run dev
npm run dev:sdc
npm run storybook
```

Build production assets with `npm run build`. Do not commit `node_modules/` or
`dist/`; both are recreated from the theme package files.

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