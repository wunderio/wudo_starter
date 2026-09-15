<?php

namespace Drupal\wudo_theme_extension\Plugin\paragraphs\Behavior;

use Drupal\Core\Entity\Display\EntityViewDisplayInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\paragraphs\ParagraphInterface;
use Drupal\paragraphs\ParagraphsBehaviorBase;

/**
 * Provides media presentation settings for paragraphs.
 *
 * @ParagraphsBehavior(
 *   id = "media_styles",
 *   label = @Translation("Media Styles"),
 *   description = @Translation("Applies a shadow style to media content."),
 *   weight = 1
 * )
 */
class MediaStylesBehavior extends ParagraphsBehaviorBase {

  /**
   * {@inheritdoc}
   */
  public function buildBehaviorForm(ParagraphInterface $paragraph, array &$form, FormStateInterface $form_state) {
    $form['shadow_style'] = [
      '#type' => 'select',
      '#title' => $this->t('Shadow style'),
      '#options' => [
        '' => $this->t('None'),
        'media-shadow-style-1' => $this->t('Shadow style 1'),
        'media-shadow-style-2' => $this->t('Shadow style 2'),
        'media-shadow-style-3' => $this->t('Shadow style 3'),
      ],
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'shadow_style', ''),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function view(array &$build, ParagraphInterface $paragraph, EntityViewDisplayInterface $display, $view_mode) {
    $shadow_style = $paragraph->getBehaviorSetting($this->getPluginId(), 'shadow_style', '');

    if ($shadow_style) {
      $build['#attributes']['class'][] = $shadow_style;
    }
  }

}
