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
        '3rem 0' => $this->t('L vertical only'),
        '5rem 0' => $this->t('XL vertical only'),
        '0 2rem' => $this->t('M horizontal only'),
        '0 3rem' => $this->t('L horizontal only'),
      ],
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'padding', '1rem'),
    ];

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

    $form['text'] = [
      '#type' => 'color',
      '#title' => $this->t('Text color'),
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'text', 'inherit'),
    ];

    $form['use_background'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Use background color'),
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'use_background', FALSE),
    ];

    $form['background'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Background color'),
      '#description' => $this->t('Any CSS color value, for example #fff, rgb(255, 255, 255), rgba(0, 0, 0, 0.3), var(--color).'),
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'background', '#ffffff'),
      '#states' => [
        'visible' => [
          ':input[name="behavior_plugins[style_settings][settings][use_background]"]' => ['checked' => TRUE],
        ],
      ],
    ];

    $form['background_mask'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Background mask'),
      '#description' => $this->t('Any CSS background value used as an overlay on top of the background image, for example rgba(0, 0, 0, 0.4) or linear-gradient(...).'),
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'background_mask', ''),
    ];

    $form['border_radius'] = [
      '#type' => 'select',
      '#title' => $this->t('Border radius'),
      '#options' => [
        '' => $this->t('None'),
        '8px' => $this->t('S — 8px'),
        '16px' => $this->t('M — 16px'),
      ],
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'border_radius', ''),
    ];

    $form['background_style'] = [
      '#type' => 'select',
      '#title' => $this->t('Background styles'),
      '#options' => [
        '' => $this->t('None'),
        'background-style-1' => $this->t('Background style 1'),
        'background-style-2' => $this->t('Background style 2'),
        'background-style-3' => $this->t('Background style 3'),
        'background-style-4' => $this->t('Background style 4'),
        'background-style-5' => $this->t('Background style 5'),
        'background-style-6' => $this->t('Background style 6'),
        'background-style-7' => $this->t('Background style 7'),
        'background-style-8' => $this->t('Background style 8'),
        'background-style-9' => $this->t('Background style 9'),
        'background-style-10' => $this->t('Background style 10'),
      ],
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'background_style', ''),
    ];

    $form['full_width_background'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Full width background'),
      '#description' => $this->t('Extend the section background to the viewport edges while keeping its content constrained.'),
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'full_width_background', FALSE),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function view(array &$build, ParagraphInterface $paragraph, EntityViewDisplayInterface $display, $view_mode) {
    $text = $paragraph->getBehaviorSetting($this->getPluginId(), 'text', 'inherit');
    $use_background = $paragraph->getBehaviorSetting($this->getPluginId(), 'use_background', FALSE);
    $background = $paragraph->getBehaviorSetting($this->getPluginId(), 'background', '#ffffff');
    $border_radius = $paragraph->getBehaviorSetting($this->getPluginId(), 'border_radius', '');
    $background_style = $paragraph->getBehaviorSetting($this->getPluginId(), 'background_style', '');
    $padding = $paragraph->getBehaviorSetting($this->getPluginId(), 'padding', 2);
    $layout = $paragraph->getBehaviorSetting($this->getPluginId(), 'layout', 'contained');
    $full_width_background = $paragraph->getBehaviorSetting($this->getPluginId(), 'full_width_background', FALSE);

    $build['#attributes']['class'][] = 'layout-' . $layout;
    if ($background_style) {
      $build['#attributes']['class'][] = $background_style;
    }
    if ($full_width_background) {
      $build['#attributes']['class'][] = 'has-full-width-background';
    }
    if ($use_background && $background) {
      $build['#attributes']['style'][] = 'background-color: ' . $background . ';';
    }
    if ($border_radius !== '') {
      $build['#attributes']['style'][] = 'border-radius: ' . $border_radius . ';';
    }
    $build['#attributes']['style'][] = 'color: ' . $text . ';';
    $build['#attributes']['style'][] = 'padding: ' . $padding . ';';
  }

}
