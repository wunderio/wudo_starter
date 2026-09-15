<?php

namespace Drupal\wudo_theme_extension\Plugin\paragraphs\Behavior;

use Drupal\Core\Entity\Display\EntityViewDisplayInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\paragraphs\ParagraphInterface;
use Drupal\paragraphs\ParagraphsBehaviorBase;

/**
 * Provides parallax positioning settings for media paragraphs.
 *
 * @ParagraphsBehavior(
 *   id = "parallax_layer",
 *   label = @Translation("Parallax Layer"),
 *   description = @Translation("Positions this media as a parallax background layer."),
 *   weight = 2
 * )
 */
class ParallaxLayerBehavior extends ParagraphsBehaviorBase {

  /**
   * {@inheritdoc}
   */
  public function buildBehaviorForm(ParagraphInterface $paragraph, array &$form, FormStateInterface $form_state) {
    $form['enable_parallax'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable parallax layer'),
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'enable_parallax', FALSE),
    ];

    $states = [
      'visible' => [
        ':input[name="behavior_plugins[parallax_layer][settings][enable_parallax]"]' => ['checked' => TRUE],
      ],
    ];

    $form['position'] = [
      '#type' => 'select',
      '#title' => $this->t('Position'),
      '#options' => [
        'top-left' => $this->t('Top left'),
        'top-center' => $this->t('Top center'),
        'top-right' => $this->t('Top right'),
        'left-center' => $this->t('Left center'),
        'center' => $this->t('Center'),
        'right-center' => $this->t('Right center'),
        'bottom-left' => $this->t('Bottom left'),
        'bottom-center' => $this->t('Bottom center'),
        'bottom-right' => $this->t('Bottom right'),
      ],
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'position', 'center'),
      '#states' => $states,
    ];

    $form['width'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Width'),
      '#description' => $this->t('Any CSS width value, e.g. 400px, 60%, 40vw.'),
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'width', ''),
      '#states' => $states,
    ];

    $form['height'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Height'),
      '#description' => $this->t('Any CSS height value, e.g. 400px, auto.'),
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'height', ''),
      '#states' => $states,
    ];

    $form['speed'] = [
      '#type' => 'number',
      '#title' => $this->t('Parallax speed'),
      '#description' => $this->t('Scroll speed coefficient. Use 0.05–0.1 for a background layer that should barely move, up to 1 for a fast foreground layer.'),
      '#step' => 0.05,
      '#min' => 0,
      '#max' => 1,
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'speed', 0.3),
      '#states' => $states,
    ];

    $form['z_index'] = [
      '#type' => 'number',
      '#title' => $this->t('Z-index'),
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'z_index', 0),
      '#states' => $states,
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function view(array &$build, ParagraphInterface $paragraph, EntityViewDisplayInterface $display, $view_mode) {
    if (!$paragraph->getBehaviorSetting($this->getPluginId(), 'enable_parallax', FALSE)) {
      return;
    }

    $position = $paragraph->getBehaviorSetting($this->getPluginId(), 'position', 'center');
    $width = $paragraph->getBehaviorSetting($this->getPluginId(), 'width', '');
    $height = $paragraph->getBehaviorSetting($this->getPluginId(), 'height', '');
    $speed = $paragraph->getBehaviorSetting($this->getPluginId(), 'speed', 0.3);
    $z_index = $paragraph->getBehaviorSetting($this->getPluginId(), 'z_index', 0);

    $build['#attributes']['class'][] = 'parallax-layer';
    $build['#attributes']['class'][] = 'parallax-layer--' . $position;
    $build['#attributes']['data-parallax-speed'] = $speed;
    $build['#attached']['library'][] = 'wudo/parallax';

    if ($width) {
      $build['#attributes']['style'][] = 'width: ' . $width . ';';
    }
    if ($height) {
      $build['#attributes']['style'][] = 'height: ' . $height . ';';
    }
    if ($z_index) {
      $build['#attributes']['style'][] = 'z-index: ' . $z_index . ';';
    }
  }

}
