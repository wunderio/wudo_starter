/**
 * @file
 * Wudo Focus Management System.
 *
 * Provides a stack-based focus trapping utility to ensure accessibility
 * in complex UI components like modals, drawers, and mega-menus.
 *
 * @version 1.0.1
 * @author Wudo
 */

/**
 * Orchestrates multiple focus traps using a stack-based approach.
 * Ensures that overlapping components (e.g., a modal over a menu)
 * maintain the correct focus order.
 */
class FocusTrapManager {
  constructor() {
    /** @type {FocusTrap[]} */
    this.stack = [];
  }

  /**
   * Creates and activates a new focus trap.
   *
   * @param {HTMLElement} container - The element that should contain the focus.
   * @param {Object} options - Configuration for the trap.
   * @returns {FocusTrap} The created trap instance.
   */
  activate(container, options = {}) {
    const trap = new FocusTrap(container, options);
    this.stack.push(trap);
    trap.activate();
    return trap;
  }

  /**
   * Deactivates and removes a specific trap from the stack.
   *
   * @param {FocusTrap} trap - The trap instance to deactivate.
   */
  deactivate(trap) {
    const idx = this.stack.indexOf(trap);
    if (idx > -1) {
      trap.deactivate();
      this.stack.splice(idx, 1);
    }
  }

  /**
   * Getter to retrieve the currently active trap (top of the stack).
   *
   * @returns {FocusTrap|null} The active trap or null if the stack is empty.
   */
  get activeTrap() {
    return this.stack[this.stack.length - 1] || null;
  }
}

/**
 * Handles individual focus trapping logic within a container.
 */
class FocusTrap {
  /**
   * @param {HTMLElement} container - Container to trap focus in.
   * @param {Object} options - Options object.
   * @param {boolean} [options.escapeCloses=true] - Dispatch escape event.
   * @param {HTMLElement[]} [options.additionalElements=[]] - Extra elements for the loop.
   */
  constructor(container, { escapeCloses = true, additionalElements = [] } = {}) {
    this.container = container;
    this.additionalElements = additionalElements;
    this.active = false;
    this._previousFocus = null;
    this.escapeCloses = escapeCloses;
    this._keydownHandler = this._handleKeydown.bind(this);
    this._selectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  }

  /**
   * Dynamically finds all currently visible focusable elements.
   * Excludes elements inside [inert] subtrees.
   * @returns {HTMLElement[]}
   * @private
   */
  _getElements() {
    const containerElements = Array.from(this.container.querySelectorAll(this._selectors))
      .filter(el =>
        !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length) &&
        !el.closest('[inert]')
      );

    return [...this.additionalElements, ...containerElements];
  }

  /**
   * Activates the trap and captures the current focus.
   */
  activate() {
    if (this.active) return;
    this.active = true;
    this._previousFocus = document.activeElement;

    document.addEventListener('keydown', this._keydownHandler);

    requestAnimationFrame(() => {
      const elements = this._getElements();
      if (elements.length > 0) {
        elements[0].focus({ preventScroll: true });
      }
    });
  }

  /**
   * Deactivates the trap and restores focus to the previous element.
   */
  deactivate() {
    if (!this.active) return;
    this.active = false;
    document.removeEventListener('keydown', this._keydownHandler);

    if (this._previousFocus && document.body.contains(this._previousFocus)) {
      this._previousFocus.focus({ preventScroll: true });
    }
  }

  /**
   * Focuses the first available element in the trap.
   */
  focusFirst() {
    const elements = this._getElements();
    if (elements.length > 0) {
      elements[0].focus({ preventScroll: true });
    }
  }

  /**
   * Keydown event handler to intercept Tab and Escape keys.
   * @param {KeyboardEvent} e
   * @private
   */
  _handleKeydown(e) {
    if (e.key !== 'Tab') {
      if (e.key === 'Escape' && this.escapeCloses) {
        this.container.dispatchEvent(new CustomEvent('focusTrap:escape'));
      }
      return;
    }

    const elements = this._getElements();
    if (elements.length === 0) {
      e.preventDefault();
      return;
    }

    const first = elements[0];
    const last = elements[elements.length - 1];

    if (e.shiftKey) { // Shift + Tab
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else { // Tab
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
}

/**
 * Drupal Behavior to initialize the FocusTrapManager.
 */
(function (Drupal) {
  Drupal.behaviors.wudoFocusTrap = {
    attach(context, settings) {
      if (!window.focusTrapManager) {
        window.focusTrapManager = new FocusTrapManager();
      }
    }
  };
})(Drupal);
