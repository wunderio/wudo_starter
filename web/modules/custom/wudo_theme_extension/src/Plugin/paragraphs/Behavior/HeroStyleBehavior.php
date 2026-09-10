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
 *   id = "hero_style",
 *   label = @Translation("Hero Style Settings"),
 *   description = @Translation("Customizes background color, padding, and layout for this paragraph."),
 *   weight = 0
 * )
 */
class HeroStyleBehavior extends ParagraphsBehaviorBase {

  /**
   * {@inheritdoc}
   */
  public function buildBehaviorForm(ParagraphInterface $paragraph, array &$form, FormStateInterface $form_state) {

    $form['layout'] = [
      '#type' => 'select',
      '#title' => $this->t('Layout'),
      '#options' => [
        'grid-1' => $this->t('1 Column'),
        'grid-2' => $this->t('2 Columns'),
        'grid-auto' => $this->t('Auto'),
      ],
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'layout', 'grid-1'),
    ];

    $form['highlighted_color'] = [
      '#type' => 'color',
      '#title' => $this->t('Highlighted text color'),
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'highlighted_color', 'currentColor'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function view(array &$build, ParagraphInterface $paragraph, EntityViewDisplayInterface $display, $view_mode) {

    $layout = $paragraph->getBehaviorSetting($this->getPluginId(), 'layout', 'contained');
    $highlighted_color = $paragraph->getBehaviorSetting(
      $this->getPluginId(),
      'highlighted_color',
      '#ff0000'
    );

    $build['#attributes']['style'][] = '--color-highlighted: ' . $highlighted_color . ';';
    $build['#attributes']['class'][] = 'layout-' . $layout;

  }
}
