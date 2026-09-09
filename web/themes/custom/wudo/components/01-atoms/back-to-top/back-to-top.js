/**
 * @file back-to-top.js
 */
class BackToTop extends HTMLElement {
  connectedCallback() {
    this.button = this.querySelector('button');
    this.circle = this.querySelector('.progress-circle__path');
    this.threshold = parseInt(this.dataset.threshold) || 400;
    this.radius = 18;
    this.circumference = 2 * Math.PI * this.radius;

    if (this.circle) {
      this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
    }

    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    this.button.addEventListener('click', () => this.scrollToTop());
  }

  handleScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollY / docHeight;

    if (scrollY > this.threshold) {
      this.classList.add('is-visible');
    } else {
      this.classList.remove('is-visible');
    }

    if (this.circle) {
      const offset = this.circumference - (scrollPercent * this.circumference);
      this.circle.style.strokeDashoffset = offset;
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

if (!customElements.get('back-to-top')) {
  customElements.define('back-to-top', BackToTop);
}
