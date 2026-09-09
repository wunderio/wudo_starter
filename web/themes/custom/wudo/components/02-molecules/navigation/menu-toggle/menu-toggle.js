/**
 * @file
 * Mobile menu toggler behavior using FocusTrapManager.
 *
 * Expects markup structure:
 * <div data-mobile-menu>
 *   <button data-menu-toggle aria-expanded="false">☰</button>
 *   <nav data-menu hidden> ... </nav>
 * </div>
 */

(function (Drupal, once) {
  Drupal.behaviors.mobileMenuToggler = {
    attach(context) {
      once('mobile-menu', '[data-mobile-menu]', context).forEach((wrapper) => {
        const toggle = wrapper.querySelector('[data-menu-toggle]');
        const menu = wrapper.querySelector('[data-menu]');
        let currentTrap = null;

        if (!toggle || !menu) return;

        const openMenu = () => {
          toggle.setAttribute('aria-expanded', 'true');
          menu.classList.add('is-open');

          if (window.focusTrapManager) {
            // Activate focus trap on the menu, add toggler as well
            currentTrap = window.focusTrapManager.activate(menu, {
              additionalElements: [toggle]
            });
            // Escape
            menu.addEventListener('focusTrap:escape', closeMenu, { once: true });
          }
        };

        const closeMenu = () => {
          toggle.setAttribute('aria-expanded', 'false');
          menu.classList.remove('is-open');

          if (window.focusTrapManager && currentTrap) {
            window.focusTrapManager.deactivate(currentTrap);
            currentTrap = null;
          }
        };

        toggle.addEventListener('click', (e) => {
          const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
          isExpanded ? closeMenu() : openMenu();
        });
      });
    },
  };
})(Drupal, once);
