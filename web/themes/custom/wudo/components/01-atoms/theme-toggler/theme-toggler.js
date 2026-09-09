class WudoThemeToggler extends HTMLElement {
  connectedCallback() {

    this.btn = this.querySelector('.theme-toggler__btn');
    if (!this.btn) {
      console.error('WudoThemeToggler: Button not found!');
      return;
    }

    const { labelLight, labelDark, labelAuto, switchTo } = this.dataset;

    this.config = {
      labels: {
        light: labelLight || 'Light',
        dark: labelDark || 'Dark',
        auto: labelAuto || 'Auto'
      },
      switchTo: switchTo || 'Switch to'
    };

    // Tabs storage listener
    window.addEventListener('storage', (e) => {
      if (e.key === 'theme' || e.key === 'theme-manual') {
        this.updateState();
      }
    });

    // First init
    this.updateState();

    // Click
    this.btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isManual = localStorage.getItem('theme-manual');
      const savedTheme = localStorage.getItem('theme');

      if (!isManual) {
        // Auto -> Dark
        this.saveAndApply('dark', true);
      } else if (savedTheme === 'dark') {
        // Dark -> Light
        this.saveAndApply('light', true);
      } else {
        // Light -> Auto
        this.saveAndApply(null, false);
      }
    });
  }

  saveAndApply(theme, manual) {
    if (manual) {
      localStorage.setItem('theme', theme);
      localStorage.setItem('theme-manual', 'true');
    } else {
      localStorage.removeItem('theme');
      localStorage.removeItem('theme-manual');
    }
    this.updateState();
  }

  updateState() {
    const isManual = localStorage.getItem('theme-manual');
    const savedTheme = localStorage.getItem('theme');
    const query = window.matchMedia('(prefers-color-scheme: dark)');

    // Status label
    this.statusText = this.querySelector('.theme-toggler__status');

    const themeToApply = isManual ? savedTheme : (query.matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', themeToApply);

    this.classList.remove('state-auto', 'state-dark', 'state-light');

    if (!isManual) {
      this.classList.add('state-auto');
      // System mode
      if (this.statusText) {
        this.statusText.innerText = this.config.labels.auto;
      }
    } else {
      this.classList.add(`state-${savedTheme}`);
      // Manual mode
      if (this.statusText) {
        this.statusText.innerText = this.config.labels[savedTheme];
      }
    }

    // ARIA
    if (this.btn) {
      const nextLabel = !isManual ? this.config.labels.dark : (savedTheme === 'dark' ? this.config.labels.light : this.config.labels.auto);
      this.btn.setAttribute('aria-label', `${this.config.switchTo} ${nextLabel}`);
    }
  }
}

// Initialize the custom element
if (!customElements.get('wudo-theme-toggler')) {
  customElements.define('wudo-theme-toggler', WudoThemeToggler);
}
