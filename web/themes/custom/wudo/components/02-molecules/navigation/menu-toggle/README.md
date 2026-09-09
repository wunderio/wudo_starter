# Mobile menu toggler
This component represents a mobile menu toggle button, commonly used in responsive web design to show or hide the navigation menu on smaller screens.
## Required HTML Structure
```html
<div data-mobile-menu>
  <button data-menu-toggle aria-expanded="false">☰</button>
  <nav data-menu hidden> ... </nav>
</div>
```
Required Drupal libraries:
- `wudo/focus-trap`

## Attributes
- `data-mobile-menu`: Container for the mobile menu toggle component.
- `data-menu-toggle`: The button that toggles the visibility of the menu.
- `data-menu`: The navigation menu that is shown or hidden.

## The role of `data-mobile-menu`
The `data-mobile-menu` attribute is the core "anchor" of this script and serves several purposes:
* **Component Scoping:** It defines the boundary of the menu. The script treats everything inside this element as an isolated unit, allowing multiple independent menus on the same page.
* **DOM Traversal:** It establishes a parent-child relationship. The script searches for the toggle `[data-menu-toggle]` and the nav `[data-menu]` specifically within this container to avoid conflicts with other elements.
* **Focus Trap boundary:** It acts as a boundary for the focus trap functionality, ensuring that keyboard navigation is contained within the menu when it is open.

**Best Practice:** Rather than introducing extra markup, attach the data attribute to an existing container, such as the block or region wrapper, to minimize nesting.
