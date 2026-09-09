/**
 * @file
 * Language switcher using Wudo FocusTrapManager.
 * @version 1.0.1
 */

class LangSelector extends HTMLElement {
  constructor() {
    super();
    this._isOpen = false;
    this._onOutsideClick = this._onOutsideClick.bind(this);
  }

  connectedCallback() {
    this.btn = this.querySelector('[data-target="button"]');
    this.list = this.querySelector('[data-target="list"]');
    this.currentTrap = null;

    if (!this.btn || !this.list) return;

    this.btn.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
      this._isOpen ? this.close() : this.open();
    });
  }

  open() {
    this._isOpen = true;
    this.btn.setAttribute('aria-expanded', 'true');
    this.list.hidden = false;
    this.classList.add('is-open');

    const isInDrawer = this.closest('wudo-drawer');

    if (window.focusTrapManager && !isInDrawer) {
      this.currentTrap = window.focusTrapManager.activate(this.list, {
        additionalElements: [this.btn]
      });
      this.list.addEventListener('focusTrap:escape', () => this.close(), { once: true });
    }

    setTimeout(() => {
      document.addEventListener('click', this._onOutsideClick);
    }, 1);
  }

  close() {
    this._isOpen = false;
    this.btn.setAttribute('aria-expanded', 'false');
    this.list.hidden = true;
    this.classList.remove('is-open');

    if (this.currentTrap) {
      window.focusTrapManager.deactivate(this.currentTrap);
      this.currentTrap = null;
    }

    document.removeEventListener('click', this._onOutsideClick);
  }

  _onOutsideClick(e) {
    if (!this.contains(e.target)) {
      this.close();
    }
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onOutsideClick);
  }
}

if (!customElements.get('lang-selector')) {
  customElements.define('lang-selector', LangSelector);
}
