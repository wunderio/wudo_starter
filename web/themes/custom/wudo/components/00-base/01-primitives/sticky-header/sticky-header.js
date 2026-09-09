/**
 * @file sticky-header.js
 */
class StickyHeader extends HTMLElement {
  connectedCallback() {
    this.lastScrollY = window.scrollY;
    this.scrollThreshold = parseInt(this.dataset.threshold) || 150;
    this.ticking = false;

    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }, { passive: true });
  }

  handleScroll() {
    const currentScrollY = window.scrollY;

    // Sticky state
    if (currentScrollY > this.scrollThreshold) {
      this.classList.add('is-sticky');
    } else {
      this.classList.remove('is-sticky');
    }

    // Hide/Show logic
    if (currentScrollY > this.lastScrollY && currentScrollY > this.scrollThreshold) {
      this.classList.add('is-hidden');
    } else {
      this.classList.remove('is-hidden');
    }

    this.lastScrollY = currentScrollY;
  }
}

if (!customElements.get('sticky-header')) {
  customElements.define('sticky-header', StickyHeader);
}
