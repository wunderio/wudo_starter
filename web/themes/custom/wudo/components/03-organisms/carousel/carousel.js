/**
 * @file carousel.js
 * @description WudoCarousel - A lightweight custom element for horizontal scrolling carousels.
 * @version 1.0.0
 */

class WudoCarousel extends HTMLElement {
  constructor() {
    super();
    this.currentIndex = 0;
  }

  /**
   * Initializes the carousel when the element is added to the DOM.
   */
  connectedCallback() {
    // Select essential DOM elements
    this.viewport = this.querySelector('.carousel__viewport');
    this.track = this.querySelector('.carousel__track');
    this.btnPrev = this.querySelector('.carousel__btn--prev');
    this.btnNext = this.querySelector('.carousel__btn--next');
    this.dotsContainer = this.querySelector('.carousel__dots');

    // Get slides and exit if none exist
    this.slides = Array.from(this.track.children);
    if (this.slides.length === 0) return;

    // Check for loop attribute
    this.isLoop = this.getAttribute('data-loop') === 'true';

    // Initial setup
    this.updateConfig();
    this.renderDots();
    this.initEvents();
    this.updateActiveState();

    // Handle responsiveness on window resize
    window.addEventListener('resize', () => {
      this.updateConfig();
      this.renderDots();
      this.updateActiveState();
    });
  }

  /**
   * Calculates items per view and maximum scrollable index based on current widths.
   */
  updateConfig() {
    const slideWidth = this.slides[0].offsetWidth;
    const viewportWidth = this.viewport.offsetWidth;

    // Determine how many items fit in the current viewport
    this.itemsPerView = Math.round(viewportWidth / slideWidth);

    // Set maxIndex to prevent scrolling into empty space
    this.maxIndex = Math.max(0, this.slides.length - this.itemsPerView);
  }

  /**
   * Dynamically generates navigation dots based on the number of possible scroll positions.
   */
  renderDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';

    for (let i = 0; i <= this.maxIndex; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.classList.add('carousel__dot');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => this.scrollToIndex(i));
      this.dotsContainer.appendChild(dot);
    }
    this.dots = this.querySelectorAll('.carousel__dot');
  }

  /**
   * Sets up event listeners for navigation buttons and scroll activity.
   */
  initEvents() {
    this.btnNext?.addEventListener('click', () => this.navigate(1));
    this.btnPrev?.addEventListener('click', () => this.navigate(-1));

    // Update active dot/button state after scrolling finishes
    let scrollTimeout;
    this.viewport.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => this.updateActiveState(), 50);
    }, { passive: true });
  }

  /**
   * Handles logical movement between slides.
   * @param {number} direction - 1 for forward, -1 for backward.
   */
  navigate(direction) {
    let nextIndex = this.currentIndex + direction;

    if (this.isLoop) {
      // Logic for infinite looping
      if (nextIndex > this.maxIndex) nextIndex = 0;
      if (nextIndex < 0) nextIndex = this.maxIndex;
    } else {
      // Logic for bounded navigation
      nextIndex = Math.max(0, Math.min(nextIndex, this.maxIndex));
    }

    this.scrollToIndex(nextIndex);
  }

  /**
   * Smoothly scrolls the viewport to the specific slide index.
   */
  scrollToIndex(index) {
    const itemWidth = this.slides[0].offsetWidth;
    this.viewport.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth'
    });
    this.currentIndex = index;
  }

  /**
   * Synchronizes the visual state (dots, disabled buttons) with the current scroll position.
   */
  updateActiveState() {
    const itemWidth = this.slides[0].offsetWidth;
    if (itemWidth === 0) return;

    // Determine current index based on actual scroll position
    this.currentIndex = Math.round(this.viewport.scrollLeft / itemWidth);

    // Update active class for dots
    this.dots?.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === this.currentIndex);
    });

    // Handle disabled state for buttons if loop is disabled
    if (!this.isLoop) {
      if (this.btnPrev) this.btnPrev.disabled = this.currentIndex <= 0;
      if (this.btnNext) this.btnNext.disabled = this.currentIndex >= this.maxIndex;
    }
  }
}

// Register the custom element if not already defined
if (!customElements.get('wudo-carousel')) {
  customElements.define('wudo-carousel', WudoCarousel);
}
