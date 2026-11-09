<?php

namespace Drupal\wudo_theme_extension\Plugin\paragraphs\Behavior;

use Drupal\Core\Entity\Display\EntityViewDisplayInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\paragraphs\Entity\Paragraph;
use Drupal\paragraphs\ParagraphInterface;
use Drupal\paragraphs\ParagraphsBehaviorBase;

/**
 * The colors of a card: its color scheme and background.
 *
 * The card (wudo:article-card) takes its background and text colors from the
 * scheme tokens, so a scheme class is enough to make it light or dark; a
 * background color replaces only the card's own background (--card-bg).
 *
 * @ParagraphsBehavior(
 *   id = "card_style",
 *   label = @Translation("Card colors"),
 *   description = @Translation("The color scheme and background color of a card."),
 *   weight = 5
 * )
 */
class CardStyleBehavior extends ParagraphsBehaviorBase {

  /**
   * A CSS color: a word, a hex value or a function such as rgb() or var().
   *
   * Nothing that could end the declaration or the attribute.
   */
  private const COLOR_PATTERN = '/^[#a-zA-Z0-9(),.%\s\/-]+$/';

  /**
   * {@inheritdoc}
   */
  public function buildBehaviorForm(ParagraphInterface $paragraph, array &$form, FormStateInterface $form_state) {
    $form['color_scheme'] = [
      '#type' => 'select',
      '#title' => $this->t('Color scheme'),
      '#description' => $this->t('Light or dark colors for the card: its background, text and links.'),
      '#options' => [
        '' => $this->t('As the page'),
        'light' => $this->t('Light'),
        'dark' => $this->t('Dark'),
      ],
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'color_scheme', ''),
    ];

    $form['background'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Background color'),
      '#description' => $this->t('Any CSS color value, for example #0b3d2e, rgb(11, 61, 46) or var(--color-surface-strong). Empty: the background of the color scheme. Pick the scheme that keeps the text readable on it.'),
      '#default_value' => $paragraph->getBehaviorSetting($this->getPluginId(), 'background', ''),
      '#size' => 30,
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateBehaviorForm(ParagraphInterface $paragraph, array &$form, FormStateInterface $form_state) {
    $background = trim((string) $form_state->getValue('background'));
    if ($background !== '' && !preg_match(self::COLOR_PATTERN, $background)) {
      $form_state->setError($form['background'], $this->t('The background color must be a CSS color value, such as #0b3d2e.'));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitBehaviorForm(ParagraphInterface $paragraph, array &$form, FormStateInterface $form_state) {
    $paragraph->setBehaviorSettings($this->getPluginId(), [
      'color_scheme' => $form_state->getValue('color_scheme'),
      'background' => trim((string) $form_state->getValue('background')),
    ]);
  }

  /**
   * {@inheritdoc}
   */
  public function view(array &$build, ParagraphInterface $paragraph, EntityViewDisplayInterface $display, $view_mode) {
    $color_scheme = $paragraph->getBehaviorSetting($this->getPluginId(), 'color_scheme', '');
    $background = $paragraph->getBehaviorSetting($this->getPluginId(), 'background', '');

    if (in_array($color_scheme, ['light', 'dark'], TRUE)) {
      $build['#attributes']['class'][] = 'scheme-' . $color_scheme;
    }
    if ($background !== '' && preg_match(self::COLOR_PATTERN, $background)) {
      $build['#attributes']['style'][] = '--card-bg: ' . $background . ';';
    }
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary(Paragraph $paragraph) {
    $summary = [];
    $color_scheme = $paragraph->getBehaviorSetting($this->getPluginId(), 'color_scheme', '');
    $background = $paragraph->getBehaviorSetting($this->getPluginId(), 'background', '');
    if ($color_scheme === 'light') {
      $summary[] = $this->t('Light');
    }
    elseif ($color_scheme === 'dark') {
      $summary[] = $this->t('Dark');
    }
    if ($background !== '') {
      $summary[] = $this->t('Background: @color', ['@color' => $background]);
    }
    return $summary;
  }

}
