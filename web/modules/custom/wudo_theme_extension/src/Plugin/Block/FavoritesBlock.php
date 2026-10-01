<?php

namespace Drupal\wudo_theme_extension\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides the favorites counter and drawer.
 *
 * @Block(
 *   id = "wudo_favorites",
 *   admin_label = @Translation("Favorites counter and drawer"),
 *   category = @Translation("Wudo")
 * )
 */
class FavoritesBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'drawer_id' => 'favorite-drawer',
      'icon_type' => 'heart',
      'display_mode' => 'both',
    ] + parent::defaultConfiguration();
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $form['drawer_id'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Drawer ID'),
      '#description' => $this->t('Must match the drawer ID used by favorite buttons.'),
      '#default_value' => $this->configuration['drawer_id'],
      '#required' => TRUE,
    ];
    $form['icon_type'] = [
      '#type' => 'select',
      '#title' => $this->t('Counter icon'),
      '#options' => [
        'heart' => $this->t('Heart'),
        'bookmark' => $this->t('Bookmark'),
      ],
      '#default_value' => $this->configuration['icon_type'],
      '#required' => TRUE,
    ];
    $form['display_mode'] = [
      '#type' => 'select',
      '#title' => $this->t('Display'),
      '#options' => [
        'counter' => $this->t('Counter only'),
        'drawer' => $this->t('Drawer only'),
        'both' => $this->t('Counter and drawer'),
      ],
      '#default_value' => $this->configuration['display_mode'],
      '#required' => TRUE,
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['drawer_id'] = $form_state->getValue('drawer_id');
    $this->configuration['icon_type'] = $form_state->getValue('icon_type');
    $this->configuration['display_mode'] = $form_state->getValue('display_mode');
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $drawer_id = $this->configuration['drawer_id'];
    $display_mode = $this->configuration['display_mode'] ?? 'both';
    $build = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['wudo-favorites'],
      ],
    ];

    if ($display_mode === 'counter' || $display_mode === 'both') {
      $build['counter'] = [
        '#type' => 'component',
        '#component' => 'wudo:favorite-counter',
        '#props' => [
          'drawer_id' => $drawer_id,
          'icon_type' => $this->configuration['icon_type'],
        ],
      ];
    }

    if ($display_mode === 'drawer' || $display_mode === 'both') {
      $build['drawer'] = [
        '#type' => 'component',
        '#component' => 'wudo:favorite-drawer',
        '#props' => [
          'drawer_id' => $drawer_id,
          'api_url' => '/api/favorites',
        ],
      ];
    }

    return $build;
  }

}