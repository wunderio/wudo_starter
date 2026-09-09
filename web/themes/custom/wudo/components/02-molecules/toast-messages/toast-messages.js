class ToastMessages extends HTMLElement {
  connectedCallback() {
    this.container = this.querySelector('[data-toast-container]');
    this.template = this.querySelector('#toast-template');
    this.duration = parseInt(this.dataset.duration) || 5000;

    // Initialize existing toasts
    this.container.querySelectorAll('.toast-item').forEach(toast => this.initToast(toast));

    // Listen for custom toast events
    window.addEventListener('wudo-toast', (e) => {
      this.addToast(e.detail.message, e.detail.type || 'status');
    });
  }

  addToast(message, type = 'status') {
    if (!this.template) return;

    // Create toast from template
    const clone = this.template.content.cloneNode(true);
    const toast = clone.querySelector('.toast-item');

    toast.classList.add(`toast-item--${type}`);
    toast.querySelector('.toast-item__content').textContent = message;

    this.container.appendChild(toast);
    this.initToast(toast);
  }

  initToast(toast) {
    const isError = toast.classList.contains('toast-item--error');
    let timer;

    const handleClose = (e) => {
      if (e) e.stopPropagation();
      clearTimeout(timer);
      this.closeToast(toast);
    };

    const closeBtn = toast.querySelector('.button-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', handleClose);
    }

    if (isError) {
      toast.classList.add('is-error-permanent');
      return;
    }

    toast.style.setProperty('--toast-lifetime', `${this.duration}ms`);

    const startTimeout = () => {
      timer = setTimeout(handleClose, this.duration);
    };

    const resetToast = () => {
      clearTimeout(timer);
      toast.classList.remove('is-active');
      void toast.offsetWidth;
      toast.classList.add('is-active');
      startTimeout();
    };

    requestAnimationFrame(() => {
      toast.classList.add('is-active');
      startTimeout();
    });

    toast.addEventListener('mouseenter', () => clearTimeout(timer));
    toast.addEventListener('mouseleave', resetToast);
  }

  closeToast(toast) {
    if (toast._timer) clearTimeout(toast._timer);
    clearTimeout(this._hoverTimer);
    toast.classList.add('is-hiding');
    toast.addEventListener('animationend', (e) => {
      if (e.animationName === 'toast-out') {
        toast.remove();
      }
    }, { once: true });
  }
}

if (!customElements.get('toast-messages')) {
  customElements.define('toast-messages', ToastMessages);
}
