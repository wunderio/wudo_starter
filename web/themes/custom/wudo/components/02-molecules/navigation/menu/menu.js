/**
 * @file
 * Wudo Menu Flyout (Mega Menu) behavior.
 */
(function (Drupal, once) {
  'use strict';

  function WudoMenu(el) {
    if (el.getAttribute('data-flyout-initialized') === 'true') return;

    this.el = el;
    this.panel = this.el.querySelector('[data-flyout-panel]');
    this.currentTrap = null;

    // Find all triggers and determine which one belongs to this panel
    const allTriggers = document.querySelectorAll('[data-flyout-open-trigger]');
    this.openTrigger = this.findOpenTrigger(allTriggers, el);

    if (!this.openTrigger || !this.panel) return;

    this.duration = this.el.hasAttribute('data-flyout-duration')
      ? parseInt(this.el.getAttribute('data-flyout-duration'), 10)
      : 300;

    this.init();
    this.el.setAttribute('data-flyout-initialized', 'true');
  }

  WudoMenu.prototype.init = function () {
    this.openTrigger.addEventListener('click', this.toggle.bind(this));

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (this.el.hasAttribute('data-flyout-expanded') &&
        !this.el.contains(e.target) &&
        !this.openTrigger.contains(e.target)) {
        this.collapse();
      }
    });
  };

  WudoMenu.prototype.findOpenTrigger = function (triggers, el) {
    for (let trigger of triggers) {
      const targetId = trigger.getAttribute('data-flyout-target');
      if (targetId && document.querySelector(targetId) === el) return trigger;
      if (trigger.nextElementSibling === el) return trigger;
    }
    return null;
  };

  WudoMenu.prototype.toggle = function (e) {
    e.preventDefault();
    e.stopPropagation();
    return this.el.hasAttribute('data-flyout-expanded') ? this.collapse() : this.expand();
  };

  WudoMenu.prototype.expand = function () {
    this.el.setAttribute('data-flyout-expanded', 'true');
    this.openTrigger.setAttribute('aria-expanded', 'true');
    this.panel.setAttribute('aria-hidden', 'false');
    this.panel.style.visibility = 'visible';

    requestAnimationFrame(() => {
      if (window.focusTrapManager) {
        // Include trigger element in the focus trap
        this.currentTrap = window.focusTrapManager.activate(this.panel, {
          additionalElements: [this.openTrigger]
        });

        // Listen for escape key to close the menu
        this.panel.addEventListener('focusTrap:escape', () => this.collapse(), { once: true });
      }
    });
  };

  WudoMenu.prototype.collapse = function () {
    if (!this.el.hasAttribute('data-flyout-expanded')) return;

    this.el.removeAttribute('data-flyout-expanded');
    this.openTrigger.setAttribute('aria-expanded', 'false');
    this.panel.setAttribute('aria-hidden', 'true');

    if (window.focusTrapManager && this.currentTrap) {
      window.focusTrapManager.deactivate(this.currentTrap);
      this.currentTrap = null;
    }

    setTimeout(() => {
      if (!this.el.hasAttribute('data-flyout-expanded')) {
        this.panel.style.visibility = 'hidden';
      }
    }, this.duration);
  };

  Drupal.behaviors.wudoMenu = {
    attach: function (context) {
      once('wudo-menu', '[data-menu-flyout]', context).forEach((el) => {
        new WudoMenu(el);
      });
    }
  };

})(Drupal, once);
