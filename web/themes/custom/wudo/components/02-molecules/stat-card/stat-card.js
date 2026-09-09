/**
 * @file stat-card.js
 * @description Wudo Count Up - A lightweight custom element for count-up animations
 * @version 1.0.0
 */

class WudoCountUp extends HTMLElement {
  connectedCallback() {
    this.target = parseFloat(this.dataset.number);
    this.duration = parseInt(this.dataset.duration) || 2000;

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.startAnimation();
        this.observer.disconnect();
      }
    }, { threshold: 0.5 });

    this.observer.observe(this);
  }

  startAnimation() {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / this.duration, 1);

      const current = Math.floor(progress * this.target);
      this.innerText = current.toLocaleString();

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        this.innerText = this.target.toLocaleString();
      }
    };
    window.requestAnimationFrame(step);
  }
}

if (!customElements.get('wudo-count-up')) {
  customElements.define('wudo-count-up', WudoCountUp);
}
