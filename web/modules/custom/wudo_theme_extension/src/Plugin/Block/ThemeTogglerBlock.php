<?php

namespace Drupal\wudo_theme_extension\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a theme mode toggle block.
 *
 * @Block(
 *   id = "wudo_theme_toggler",
 *   admin_label = @Translation("Theme toggler"),
 *   category = @Translation("Wudo")
 * )
 */
class ThemeTogglerBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'light_label' => 'Light',
      'dark_label' => 'Dark',
      'auto_label' => 'Auto',
    ] + parent::defaultConfiguration();
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form['light_label'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Light mode label'),
      '#default_value' => $this->configuration['light_label'],
      '#required' => TRUE,
    ];
    $form['dark_label'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Dark mode label'),
      '#default_value' => $this->configuration['dark_label'],
      '#required' => TRUE,
    ];
    $form['auto_label'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Automatic mode label'),
      '#default_value' => $this->configuration['auto_label'],
      '#required' => TRUE,
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['light_label'] = $form_state->getValue('light_label');
    $this->configuration['dark_label'] = $form_state->getValue('dark_label');
    $this->configuration['auto_label'] = $form_state->getValue('auto_label');
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    return [
      '#type' => 'component',
      '#component' => 'wudo:theme-toggler',
      '#props' => [
        'light_label' => $this->configuration['light_label'],
        'dark_label' => $this->configuration['dark_label'],
        'auto_label' => $this->configuration['auto_label'],
      ],
    ];
  }

}