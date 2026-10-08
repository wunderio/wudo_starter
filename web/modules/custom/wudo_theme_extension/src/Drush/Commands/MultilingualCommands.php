<?php

declare(strict_types=1);

namespace Drupal\wudo_theme_extension\Drush\Commands;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityTypeBundleInfoInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Language\LanguageInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Routing\RouteBuilderInterface;
use Drupal\language\Entity\ContentLanguageSettings;
use Drupal\xmlsitemap\XmlSitemapInterface;
use Drush\Attributes as CLI;
use Drush\Commands\AutowireTrait;
use Drush\Commands\DrushCommands;

/**
 * Turns the single-language starter into a multilingual site.
 */
final class MultilingualCommands extends DrushCommands {

  use AutowireTrait;

  /**
   * Entity types whose bundles become translatable.
   *
   * Paragraphs are translated in place: their reference fields stay
   * untranslatable so every translation shares the same structure.
   */
  private const ENTITY_TYPES = [
    'node',
    'taxonomy_term',
    'media',
    'menu_link_content',
    'block_content',
    'paragraph',
  ];

  public function __construct(
    private readonly ModuleHandlerInterface $moduleHandler,
    private readonly EntityTypeManagerInterface $entityTypeManager,
    private readonly EntityTypeBundleInfoInterface $bundleInfo,
    private readonly ConfigFactoryInterface $configFactory,
    private readonly LanguageManagerInterface $languageManager,
    private readonly RouteBuilderInterface $routeBuilder,
  ) {
    parent::__construct();
  }

  /**
   * Sets up everything a second language needs. Safe to run again.
   *
   * Add the language itself first, e.g. "drush language:add lv".
   */
  #[CLI\Command(name: 'wudo:multilingual')]
  #[CLI\Usage(name: 'drush wudo:multilingual', description: 'Make content translatable, place the language switcher and add a sitemap per language.')]
  public function multilingual(): int {
    if (!$this->moduleHandler->moduleExists('content_translation')) {
      $this->logger()->error('Install the Content Translation module first: drush pm:install content_translation');
      return self::EXIT_FAILURE;
    }

    $this->enableContentTranslation();
    $this->placeLanguageSwitcher();
    $this->shareSitePaths();
    $this->addSitemaps();

    $this->entityTypeManager->clearCachedDefinitions();
    $this->routeBuilder->rebuild();
    $this->logger()->success('The site is ready for translation. Export the configuration with "drush config:export".');
    return self::EXIT_SUCCESS;
  }

  /**
   * Makes every bundle of the listed entity types translatable.
   */
  private function enableContentTranslation(): void {
    foreach (self::ENTITY_TYPES as $entity_type_id) {
      if (!$this->entityTypeManager->hasDefinition($entity_type_id)) {
        continue;
      }
      foreach (array_keys($this->bundleInfo->getBundleInfo($entity_type_id)) as $bundle) {
        $settings = ContentLanguageSettings::loadByEntityTypeBundle($entity_type_id, (string) $bundle);
        if (!$settings->getThirdPartySetting('content_translation', 'enabled')) {
          $settings->setThirdPartySetting('content_translation', 'enabled', TRUE)->save();
          $this->logger()->notice("Translation enabled for $entity_type_id: $bundle");
        }
      }
    }
  }

  /**
   * Places the language switcher next to the other header utilities.
   */
  private function placeLanguageSwitcher(): void {
    $theme = $this->configFactory->get('system.theme')->get('default');
    $plugin = 'language_block:' . LanguageInterface::TYPE_INTERFACE;
    $storage = $this->entityTypeManager->getStorage('block');
    if ($storage->loadByProperties(['theme' => $theme, 'plugin' => $plugin])) {
      return;
    }
    $storage->create([
      'id' => $theme . '_language_switcher',
      'theme' => $theme,
      'region' => 'header_utils',
      'weight' => -5,
      'plugin' => $plugin,
      'settings' => [
        'label' => 'Language switcher',
        'label_display' => '0',
      ],
    ])->save();
    $this->logger()->notice('Language switcher placed in the header.');
  }

  /**
   * Makes the front and error page aliases resolve in every language.
   *
   * An alias only matches in its own language, so /home would be a 404 in a
   * language the front page is not translated to yet.
   */
  private function shareSitePaths(): void {
    $storage = $this->entityTypeManager->getStorage('path_alias');
    foreach ($this->configFactory->get('system.site')->get('page') as $path) {
      foreach ($storage->loadByProperties(['alias' => $path]) as $alias) {
        if ($alias->language()->getId() !== LanguageInterface::LANGCODE_NOT_SPECIFIED) {
          $alias->set('langcode', LanguageInterface::LANGCODE_NOT_SPECIFIED)->save();
          $this->logger()->notice("Alias $path now applies to all languages.");
        }
      }
    }
  }

  /**
   * Adds an XML sitemap for each language that has none.
   */
  private function addSitemaps(): void {
    if (!$this->moduleHandler->moduleExists('xmlsitemap')) {
      return;
    }
    $storage = $this->entityTypeManager->getStorage('xmlsitemap');
    $covered = [];
    foreach ($storage->loadMultiple() as $sitemap) {
      if ($sitemap instanceof XmlSitemapInterface) {
        $covered[] = $sitemap->getContext()['language'] ?? NULL;
      }
    }
    foreach ($this->languageManager->getLanguages() as $langcode => $language) {
      if (in_array($langcode, $covered, TRUE)) {
        continue;
      }
      $context = ['language' => $langcode];
      $storage->create([
        'id' => xmlsitemap_sitemap_get_context_hash($context),
        'label' => $language->getName(),
        'context' => $context,
      ])->save();
      $this->logger()->notice("Sitemap added for $langcode; rebuild with drush xmlsitemap:rebuild.");
    }
  }

}
