import { LitElement, html, css } from 'lit';

class WudoFavoriteButton extends LitElement {
  static properties = {
    contentId: { type: String, attribute: 'content-id' },
    drawerId: { type: String, attribute: 'drawer-id' },
    label: { type: String },
    active: { type: Boolean, reflect: true },
    labelAdd: { type: String, attribute: 'label-add' },
    labelRemove: { type: String, attribute: 'label-remove' }
  };

  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this.active = false;
    this.labelAdd = 'Add to favorites';
    this.labelRemove = 'Remove from favorites';
  }

  // Run when component is added to the DOM
  connectedCallback() {
    super.connectedCallback();
    this._checkStatus();

    this.addEventListener('click', (e) => this._toggle(e));

    window.addEventListener('favorite-updated', (e) => {
      const targetDrawerId = e.detail.drawerId || 'favorite-drawer';
      const myDrawerId = this.drawerId || 'favorite-drawer';

      if (targetDrawerId === myDrawerId) {
        if (e.detail.id === this.contentId) {
          this.active = e.detail.active;
        } else {
          this._checkStatus();
        }
      }
    });

    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey) {
        this._checkStatus();
      }
    });
  }

  get storageKey() {
    return `wudo_favs_${this.drawerId || 'favorite-drawer'}`;
  }

  _checkStatus() {
    const favs = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    this.active = favs.some(item => item.id === this.contentId);
    this._updateButtonUI();
  }

  _updateButtonUI() {
    const btn = this.querySelector('.button');
    if (!btn) return;

    if (this.active) {
      btn.classList.add('is-active');
      btn.setAttribute('aria-label', this.labelRemove);
    } else {
      btn.classList.remove('is-active');
      btn.setAttribute('aria-label', this.labelAdd);
    }
  }

  _toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    this.active = !this.active;

    let favs = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

    if (this.active) {
      if (!favs.some(item => item.id === this.contentId)) {
        favs.push({
          id: this.contentId,
          label: this.label,
          timestamp: new Date().getTime()
        });
      }
    } else {
      favs = favs.filter(item => item.id !== this.contentId);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(favs));

    this._updateButtonUI();

    window.dispatchEvent(new CustomEvent('favorite-updated', {
      detail: {
        id: this.contentId,
        drawerId: this.drawerId || 'favorite-drawer',
        active: this.active,
        label: this.label
      },
      bubbles: true,
      composed: true
    }));
  }
}

if (!customElements.get('wudo-favorite-button')) {
  customElements.define('wudo-favorite-button', WudoFavoriteButton);
}
