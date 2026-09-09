import { LitElement } from 'lit';

class WudoFavoriteCounterTrigger extends LitElement {
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
    // Small delay to ensure DOM is ready
    setTimeout(() => this._updateCount(), 0);

    this.addEventListener('click', (e) => {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('drawer:open', {
        detail: { id: this.drawerId || 'favorite-drawer', trigger: this },
        bubbles: true,
        composed: true
      }));
    });

    window.addEventListener('favorite-updated', (e) => {
      if (e.detail.drawerId === (this.drawerId || 'favorite-drawer')) {
        setTimeout(() => {
          this._updateCount(true);
        }, 0);
      }
    });
  }

  _updateCount() {
    const storageKey = `wudo_favs_${this.drawerId || 'favorite-drawer'}`;
    const favs = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const newCount = favs.length;

    const badge = this.querySelector('.js-count');
    if (badge) {
      badge.textContent = newCount > 0 ? newCount : '';
      badge.style.display = newCount > 0 ? 'flex' : 'none';
    }

    const btn = this.querySelector('.button');
    if (btn) {
      newCount > 0 ? btn.classList.add('has-favorites') : btn.classList.remove('has-favorites');
    }

    this.count = newCount;
  }
}

if (!customElements.get('wudo-favorite-counter-trigger')) {
  customElements.define('wudo-favorite-counter-trigger', WudoFavoriteCounterTrigger);
}
