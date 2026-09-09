import { LitElement } from 'lit';

class WudoFilterManager extends LitElement {
  static properties = {
    activeCount: { type: Number, state: true }
  };

  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this.activeCount = 0;
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('change', (e) => {
      if (e.target.matches('input, select, textarea')) {
        this.broadcastStats();
      }
    });

    const handleAjax = () => this.broadcastStats();

    document.addEventListener('ajaxComplete', handleAjax);
    if (window.jQuery) {
      jQuery(document).ajaxComplete(handleAjax);
    }

    requestAnimationFrame(() => this.broadcastStats());
  }

  broadcastStats() {
    const form = this.querySelector('form');
    if (!form) return;

    let count = 0;

    const checkedInputs = form.querySelectorAll('input:checked:not([value="All"]):not([value=""])');
    count += checkedInputs.length;

    form.querySelectorAll('select').forEach(select => {
      const val = select.value;
      if (val && val !== 'All' && val !== '_none' && val !== '') {
        count++;
      }
    });

    this.activeCount = count;

    document.dispatchEvent(new CustomEvent('wudo:filter-stats-updated', {
      detail: { count: this.activeCount },
      bubbles: true,
      composed: true
    }));
  }
}

if (!customElements.get('wudo-filter-manager')) {
  customElements.define('wudo-filter-manager', WudoFilterManager);
}
