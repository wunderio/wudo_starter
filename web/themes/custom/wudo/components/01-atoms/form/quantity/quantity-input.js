class WudoQuantity extends HTMLElement {
  connectedCallback() {
    this.input = this.querySelector('input');
    this.btnMinus = this.querySelector('[data-action="minus"]');
    this.btnPlus = this.querySelector('[data-action="plus"]');

    this.step = parseInt(this.dataset.step) || 1;
    this.min = parseInt(this.dataset.min) || 0;
    this.max = this.dataset.max ? parseInt(this.dataset.max) : Infinity;

    this.btnMinus.addEventListener('click', () => this.changeValue(-this.step));
    this.btnPlus.addEventListener('click', () => this.changeValue(this.step));

    this.input.addEventListener('change', () => this.validate());

    this.validate();
  }

  changeValue(delta) {
    let val = parseInt(this.input.value) + delta;
    this.input.value = val;
    this.validate();

    const dataset = { ...this.dataset };

    this.dispatchEvent(new CustomEvent('quantity:update', {
      detail: {
        value: val,
        ...dataset
      },
      bubbles: true
    }));

    this.input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  validate() {
    let val = parseInt(this.input.value);

    if (val <= this.min) {
      val = this.min;
      this.btnMinus.disabled = true;
    } else {
      this.btnMinus.disabled = false;
    }

    if (val >= this.max) {
      val = this.max;
      this.btnPlus.disabled = true;
    } else {
      this.btnPlus.disabled = false;
    }

    this.input.value = val;
  }
}

if (!customElements.get('wudo-quantity')) {
  customElements.define('wudo-quantity', WudoQuantity);
}
