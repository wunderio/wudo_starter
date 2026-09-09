# Drupal configuration

The `sync/` directory contains exported Drupal configuration that belongs to
the project and should be committed to Git.

Set the configuration sync directory in each environment's local
`web/sites/*/settings.php` file:

```php
$settings['config_sync_directory'] = '../config/sync';
```

For this DDEV project, the same path is configured in the local
`web/sites/default/settings.ddev.php` file. DDEV may regenerate that file, so
check the value after running `ddev start` or recreating the site.

Do not put database credentials, API keys, or other secrets in exported
configuration. Use environment-specific settings or a secrets manager for
those values.