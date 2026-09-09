/**
 * @file drawer.js
 * @description Wudo Drawer Component (Web Cmp) with Integrated Portal and Auto-close
 * @version 1.2.0
 */

class WudoDrawer extends HTMLElement {
  constructor() {
    super();
    this._triggerElement = null;
    this._focusTrap = null;
    this._isOpen = false;
    this._resizeObserver = null;
  }

  static get observedAttributes() {
    return ['source-selector', 'wrapper-selector', 'slot-id'];
  }

  static cleanupInert() {
    const inertElements = document.querySelectorAll('[data-drawer-inert]');
    inertElements.forEach(el => {
      el.removeAttribute('inert');
      el.removeAttribute('data-drawer-inert');
    });

    if (!document.querySelector('wudo-drawer[open]')) {
      document.body.style.overflow = '';
    }
  }

  connectedCallback() {
    WudoDrawer.cleanupInert();
    this._stopResizeObserver();

    /** @listens drawer:open */
    document.addEventListener('drawer:open', (e) => {
      if (e.detail.id === this.id) {
        this._triggerElement = e.detail.trigger || document.activeElement;
        this.open();
        this._initResizeObserver();
      }
    });

    /** @listens drawer:close */
    document.addEventListener('drawer:close', (e) => {
      if (e.detail.id === this.id) this.close();
    });

    /** @listens focusTrap:escape */
    this.addEventListener('focusTrap:escape', () => this.close());
  }

  /**
   * Observes the trigger element becomes hidden.
   * @private
   */
  _initResizeObserver() {
    if (!this._triggerElement || this._resizeObserver) return;

    this._resizeObserver = new ResizeObserver(() => {

      const isTriggerHidden = window.getComputedStyle(this._triggerElement).display === 'none';

      if (this._isOpen && isTriggerHidden) {
        this.close();
      }
    });

    this._resizeObserver.observe(this._triggerElement);
  }

  _stopResizeObserver() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }

  _teleportIn() {
    const sourceSelector = this.getAttribute('source-selector');
    const slotId = this.getAttribute('slot-id');

    if (!sourceSelector || !slotId) {
      return;
    }

    const source = document.querySelector(sourceSelector);
    const slot = this.querySelector(`#${slotId}`);

    if (source && slot && !slot.contains(source)) {
      slot.appendChild(source);
      document.dispatchEvent(new CustomEvent('wudo:portal:moved-in', {
        detail: { id: this.id, source: source },
        bubbles: true
      }));
    } else if (!source || !slot) {
      console.warn(`[WudoDrawer] Teleport failed for ${this.id}: Source or Slot not found.`);
    }
  }

  _teleportOut() {
    const sourceSelector = this.getAttribute('source-selector');
    const wrapperSelector = this.getAttribute('wrapper-selector');

    if (!sourceSelector || !wrapperSelector) return;

    const source = document.querySelector(sourceSelector);
    const wrapper = document.querySelector(wrapperSelector);

    if (source && wrapper && !wrapper.contains(source)) {
      wrapper.appendChild(source);
    }
  }

  /**
   * Opens the drawer, activates focus trap and sets background to inert.
   */
  open() {
    if (this._isOpen) return;
    this._teleportIn();
    this._isOpen = true;
    this.setAttribute('open', '');
    this.manageFocus(true);

    // FocusTrap activation
    if (window.focusTrapManager) {
      this._focusTrap = window.focusTrapManager.activate(this);
    }

    this.dispatchEvent(new CustomEvent('drawer:after-open', {
      detail: { id: this.id },
      bubbles: true
    }));
  }

  close() {
    if (!this._isOpen) return;
    this._isOpen = false;

    this._stopResizeObserver();

    this.removeAttribute('open');
    this.manageFocus(false);
    this._teleportOut();

    document.dispatchEvent(new CustomEvent('drawer:after-close', {
      detail: { id: this.id },
      bubbles: true
    }));

    if (this._focusTrap && window.focusTrapManager) {
      window.focusTrapManager.deactivate(this._focusTrap);
      this._focusTrap = null;
    }

    if (this._triggerElement) {
      requestAnimationFrame(() => {
        this._triggerElement.focus({ preventScroll: true });
      });
    }
  }

  /**
   * Toggles inert attribute on sibling elements to hide them from assistive tech.
   * @param {boolean} isOpen
   */
  manageFocus(isOpen) {
    const rootElements = Array.from(document.body.children);
    if (isOpen) {
      rootElements.forEach(el => {
        if (!el.contains(this) && !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) {
          el.setAttribute('data-drawer-inert', '');
          el.setAttribute('inert', '');
        }
      });
      document.body.style.overflow = 'hidden';
    } else {
      WudoDrawer.cleanupInert();
    }
  }

  disconnectedCallback() {
    this._stopResizeObserver();
    WudoDrawer.cleanupInert();
  }
}

if (!customElements.get('wudo-drawer')) {
  customElements.define('wudo-drawer', WudoDrawer);
}
