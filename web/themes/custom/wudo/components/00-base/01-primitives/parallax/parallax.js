/**
 * @file
 * Scroll-driven parallax offset for Section background layers.
 */
(function (Drupal, once) {
  'use strict';

  Drupal.behaviors.wudoParallax = {
    attach(context) {
      once('wudo-parallax', '[data-parallax]', context).forEach((container) => {
        const layers = Array.from(container.querySelectorAll('.parallax-layer'));

        if (!layers.length) {
          return;
        }

        const update = () => {
          const rect = container.getBoundingClientRect();

          layers.forEach((layer) => {
            const speed = parseFloat(layer.dataset.parallaxSpeed || '0.3');
            // Counters the section's own scroll movement by a (1 - speed)
            // fraction: speed near 0 cancels the scroll almost fully, so the
            // layer appears to stand still; speed near 1 barely counters it,
            // so the layer scrolls past at normal speed and exits the section.
            const offset = -rect.top * (1 - speed);
            layer.style.setProperty('--parallax-offset', `${offset}px`);
          });
        };

        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        update();
      });
    }
  };

})(Drupal, once);
