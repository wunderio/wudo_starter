/**
 * @file wudo-reveal.js
 * @description Animates elements when they enter the viewport.
 */
class WudoReveal extends HTMLElement {
  connectedCallback() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.classList.add('is-visible');
          this.observer.unobserve(this);
        }
      });
    }, {
      threshold: this.dataset.threshold || 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    this.observer.observe(this);
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }
}

if (!customElements.get('wudo-reveal')) {
  customElements.define('wudo-reveal', WudoReveal);
}