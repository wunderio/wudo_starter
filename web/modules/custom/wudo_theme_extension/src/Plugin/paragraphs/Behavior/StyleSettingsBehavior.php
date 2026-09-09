<?php

namespace Drupal\wudo_theme_extension\Plugin\paragraphs\Behavior;

use Drupal\Core\Entity\Display\EntityViewDisplayInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\paragraphs\ParagraphInterface;
use Drupal\paragraphs\ParagraphsBehaviorBase;

/**
 * Provides style and layout settings for paragraphs.
 *
 * @ParagraphsBehavior(
 *   id = "style_settings",
 *   label = @Translation("Style & Layout Settings"),
 *   description = @Translation("Customizes background color, padding, and layout for this paragraph."),
 *   weight = 0
 * )
 */
class StyleSettingsBehavior extends ParagraphsBehaviorBase {

  /**
   * {@inheritdoc}
   */
  public function buildBehaviorForm(ParagraphInterface $paragraph, array &$form, FormStateInterface $form_state) {
    // 1. Color picker
    $form['background'] = [
      '#type' => 'color',
      '#title' => $this->t('Background color'),
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'background', '#ffffff'),
    ];

    // 2. Spacing scale — values map directly to CSS padding shorthand.
    $form['padding'] = [
      '#type' => 'select',
      '#title' => $this->t('Padding'),
      '#options' => [
        '0' => $this->t('None'),
        '0.5rem' => $this->t('XS — 0.5rem'),
        '1rem' => $this->t('S — 1rem'),
        '2rem' => $this->t('M — 2rem'),
        '3rem' => $this->t('L — 3rem'),
        '5rem' => $this->t('XL — 5rem'),
        '2rem 0' => $this->t('M vertical only'),
        '0 2rem' => $this->t('M horizontal only'),
      ],
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'padding', '1rem'),
    ];

    // 3. Layout selector
    $form['layout'] = [
      '#type' => 'select',
      '#title' => $this->t('Layout'),
      '#options' => [
        'full' => $this->t('Full width'),
        'contained' => $this->t('Contained'),
        'grid-2' => $this->t('2 Columns'),
      ],
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'layout', 'contained'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function view(array &$build, ParagraphInterface $paragraph, EntityViewDisplayInterface $display, $view_mode) {
    $background = $paragraph->getBehaviorSetting($this->getPluginId(), 'background', '#ffffff');
    $padding = $paragraph->getBehaviorSetting($this->getPluginId(), 'padding', 2);
    $layout = $paragraph->getBehaviorSetting($this->getPluginId(), 'layout', 'contained');

    $build['#attributes']['class'][] = 'layout-' . $layout;
    $build['#attributes']['style'][] = 'background-color: ' . $background . ';';
    $build['#attributes']['style'][] = 'padding: ' . $padding . ';';
  }

}
