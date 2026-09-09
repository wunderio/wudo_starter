# Focus Management System
A robust, stack-based focus management system for Drupal themes. This system consists of a `FocusTrapManager` to handle multiple UI layers (like nested menus or modals) and a dynamic `FocusTrap` class to ensure keyboard accessibility (A11y).

## Key Features
* **Stack-Based Logic:** Handles multiple overlapping components (e.g., a Mega Menu inside a Mobile Menu) without focus conflicts.
* **Dynamic Discovery:** Recalculates focusable boundaries on every `Tab` press, making it perfect for menus with toggleable sub-sections.
* **External Element Support:** Allows including elements outside the main container (like a toggle button) into the focus rotation.
* **A11y Optimized:** Manages `aria-expanded` states, handles the `Escape` key via custom events, and prevents background scrolling.

### Used By
* **Drawer:** For trapping focus within the drawer when it's open.
* **Menu Toggle:** To manage focus within the menu and its toggle button, especially when the menu has nested items.

## FocusTrapManager (The Orchestrator)
The `FocusTrapManager` lives on the global window object and tracks all active traps in a stack.

Usage:
```javascript
// Activating a trap
const trap = window.focusTrapManager.activate(containerElement, {
  escapeCloses: true,
  additionalElements: [toggleButton]
});

// Deactivating a trap
window.focusTrapManager.deactivate(trap);
```
## FocusTrap Class (The Engine)
The `FocusTrap` class handles the actual keyboard interception.

Configuration Options

| Option               | Type          | Default | Description                                                        |
|:---------------------|:--------------|:--------|:-------------------------------------------------------------------|
| `escapeCloses`       | boolean       | true    | Whether the `Escape` key should close the trap.                    |
| `additionalElements` | HTMLElement[] | []      | Extra elements to include in the focus loop (e.g., toggle buttons).|

Custom Events
When the `Escape` key is pressed, the trap dispatches a custom event on the container:
```javascript
container.addEventListener('focusTrap:escape', () => {
  // Logic to close your component
});
```

## Implementation Examples

```javascript
const toggle = wrapper.querySelector('[data-menu-toggle]');
const menu = wrapper.querySelector('[data-menu]');
let trap = null;

// Open the menu and activate the focus trap
const open = () => {
  // Basic logic here (e.g., adding classes, preventing scroll, etc.)

  // Activate the focus trap with the menu as the container and the toggle button as an additional element
  trap = window.focusTrapManager.activate(menu, {
    additionalElements: [toggle]
  });

  // Pro-Tip: Move focus to the first focusable element in the menu after it opens
  requestAnimationFrame(() => {
    const firstLink = menu.querySelector('a, button');
    if (firstLink) firstLink.focus({ preventScroll: true });
  });

  // Call close() when the Escape key is pressed within the trap
  menu.addEventListener('focusTrap:escape', close, { once: true });
};

// Closing the menu and deactivating the focus trap
const close = () => {
  // Basic logic here (e.g., removing classes, restoring scroll, etc.)

  if (trap) {
    window.focusTrapManager.deactivate(trap);
    trap = null;
  }
};

// rest JS logic (e.g., event listeners)
toggle.addEventListener('click', () => {
  const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
  // Note: open() and close() should also update aria-expanded on the toggle
  isExpanded ? close() : open();
});
```
Pause a video when a trap is active:
```javascript
if (window.focusTrapManager.activeTrap) {
  video.pause();
}
```
