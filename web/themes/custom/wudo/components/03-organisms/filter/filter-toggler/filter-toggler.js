import { LitElement } from 'lit';

class WudoFilterTrigger extends LitElement {
  static properties = {
    drawerId: { type: String, attribute: 'drawer-id' },
    count: { type: Number, state: true }
  };

  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this.count = 0;
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('click', (e) => {
      e.preventDefault();
      document.dispatchEvent(new CustomEvent('drawer:open', {
        detail: { id: this.drawerId || 'filter-control-center', trigger: this },
        bubbles: true,
        composed: true
      }));
    });

    document.addEventListener('wudo:filter-stats-updated', (e) => {
      this._updateCount(e.detail.count);
    });

    requestAnimationFrame(() => {
      const manager = document.querySelector('wudo-filter-manager');
      if (manager && typeof manager.broadcastStats === 'function') {
        manager.broadcastStats();
      }
    });
  }

  _updateCount(newCount) {
    this.count = newCount;

    const badge = this.querySelector('.js-count');
    if (badge) {
      badge.textContent = this.count > 0 ? this.count : '';
      this.count > 0 ? badge.classList.add('has-filters') : badge.classList.remove('has-filters');
    }
  }
}

if (!customElements.get('wudo-filter-trigger')) {
  customElements.define('wudo-filter-trigger', WudoFilterTrigger);
}
