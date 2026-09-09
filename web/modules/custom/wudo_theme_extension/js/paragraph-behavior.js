(function (Drupal, once) {
  'use strict';

  Drupal.behaviors.wudoParagraphBehavior = {
    attach(context) {
      // Remove global Content / Behavior tabs navigation.
      once('wudo-para-tabs', '.paragraphs-tabs-wrapper', context).forEach((wrapper) => {
        wrapper.querySelector('.paragraphs-tabs')?.remove();
      });

      // Process each paragraph individually (also works with AJAX-added items).
      once('wudo-para-behavior-btn', '.paragraphs-behavior', context).forEach((behavior) => {
        // Wrap behavior with semantic <details> element for accessibility.
        const details = document.createElement('details');
        details.className = 'wudo-styles-details';

        const summary = document.createElement('summary');
        summary.className = 'wudo-styles-summary';
        summary.innerHTML = '<span class="wudo-styles-label">Styles</span>';

        details.appendChild(summary);
        behavior.parentNode.insertBefore(details, behavior);
        details.appendChild(behavior);
      });
    }
  };

})(Drupal, once);
