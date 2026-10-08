<?php

declare(strict_types=1);

namespace Drupal\wudo_theme_extension\Hook;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Hook\Attribute\Hook;
use Drupal\path_alias\AliasManagerInterface;

/**
 * Hook implementations for the Wudo Theme Extension module.
 */
class WudoThemeExtensionHooks {

  public function __construct(
    private readonly ConfigFactoryInterface $configFactory,
    private readonly AliasManagerInterface $aliasManager,
  ) {}

  /**
   * Implements hook_field_widget_complete_WIDGET_TYPE_form_alter().
   *
   * Adds the collapsible "Styles" panel to forms that edit paragraphs.
   */
  #[Hook('field_widget_complete_paragraphs_form_alter')]
  public function paragraphsWidgetAlter(array &$field_widget_complete_form, FormStateInterface $form_state, array $context): void {
    $field_widget_complete_form['#attached']['library'][] = 'wudo_theme_extension/paragraph_behavior';
  }

  /**
   * Implements hook_xmlsitemap_link_alter().
   *
   * Keeps the error pages out of the sitemap, as well as the front page node,
   * which the sitemap already lists as the site root.
   */
  #[Hook('xmlsitemap_link_alter')]
  public function xmlsitemapLinkAlter(array &$link, array $context): void {
    $pages = $this->configFactory->get('system.site')->get('page');
    foreach (array_filter($pages) as $path) {
      if ($this->aliasManager->getPathByAlias($path) === $link['loc']) {
        $link['access'] = FALSE;
      }
    }
  }

}
