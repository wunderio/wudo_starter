import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

class WudoFavoriteDrawer extends LitElement {
  static properties = {
    items: { type: Array },
    fetchedData: { type: Array },
    drawerId: { type: String, attribute: 'drawer-id' },
    apiUrl: { type: String, attribute: 'api-url' },
    isLoading: { type: Boolean },
    labelTitle: { type: String, attribute: 'label-title' },
    labelEmpty: { type: String, attribute: 'label-empty' },
    labelLoading: { type: String, attribute: 'label-loading' },
    labelRemove: { type: String, attribute: 'label-remove' }
  };

  createRenderRoot() {
    return this;
  }

  get storageKey() {
    return `wudo_favs_${this.drawerId || 'favorite-drawer'}`;
  }

  constructor() {
    super();
    this.items = [];
    this.fetchedData = [];
    this.apiUrl = '/api/favorites'; // Default API URL
    this.drawerId = 'favorite-drawer';
    this.isLoading = false;
    this.labelTitle = 'Favorites';
    this.labelEmpty = 'List is empty';
    this.labelLoading = 'Loading...';
    this.labelRemove = 'Remove';
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadItems();

    document.addEventListener('drawer:after-open', (e) => {
      if (e.detail.id === this.drawerId) {
        this._loadItems();
        this._fetchData();
      }
    });

    window.addEventListener('favorite-updated', (e) => this._handleUpdate(e));

    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey) {
        this._loadItems();
        if (this._isDrawerOpen()) this._fetchData();
      }
    });
  }

  _isDrawerOpen() {
    return this.closest('wudo-drawer')?.hasAttribute('open') || false;
  }

  _loadItems() {
    this.items = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  async _fetchData() {
    if (this.items.length === 0) {
      this.fetchedData = [];
      return;
    }

    this.isLoading = true;
    const ids = this.items.map(item => item.id).join(',');

    try {
      const response = await fetch(`${this.apiUrl}?ids=${ids}`);
      if (response.ok) {
        this.fetchedData = await response.json();
      }
    } catch (error) {
      console.error("API Fetch Error:", error);
    } finally {
      this.isLoading = false;
    }
  }

  _handleUpdate(e) {
    if (e.detail.drawerId && e.detail.drawerId !== this.drawerId) return;

    let favs = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

    if (e.detail.active) {
      if (!favs.some(item => item.id === e.detail.id)) {
        favs.push({ id: e.detail.id, label: e.detail.label });
      }
    } else {
      favs = favs.filter(item => item.id !== e.detail.id);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(favs));
    this.items = favs;

    if (this._isDrawerOpen()) {
      this._fetchData();
    }

    this.requestUpdate();
  }

  _removeItem(id) {
    window.dispatchEvent(new CustomEvent('favorite-updated', {
      detail: {
        id: id,
        active: false,
        drawerId: this.drawerId
      },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="wudo-fav-content">
        ${this.isLoading ? html`<div class="wudo-fav-loader">${this.labelLoading}</div>` : ''}

        ${!this.isLoading && this.items.length === 0 ? html`<div class="wudo-fav-empty">${this.labelEmpty}</div>` : ''}

        ${!this.isLoading ? this.fetchedData.map((item) => html`
          <div class="wudo-fav-row">
            <div class="wudo-fav-teaser-wrap">
              ${unsafeHTML(item.html)}
            </div>
            <div class="wudo-fav-action">
              <button
                class="wudo-fav-delete"
                @click="${() => this._removeItem(item.id)}"
                aria-label=${this.labelRemove}
                title=${this.labelRemove}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
        `) : ''}
      </div>
    `;
  }
}

if (!customElements.get('wudo-favorite-drawer')) {
  customElements.define('wudo-favorite-drawer', WudoFavoriteDrawer);
}
