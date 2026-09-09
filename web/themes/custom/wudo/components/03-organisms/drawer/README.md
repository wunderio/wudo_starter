# Universal Drawer & Modal

A flexible and accessible container component that functions as both off-canvas sidebars (menus, carts) and centered modal dialogs. Built as a Web Component with encapsulated state management and focus control.

## Features

- **Multi-positional** — Single structure for `left`, `right`, or `center` (modal) layouts.
- **Focus Trap** — Uses the native `inert` attribute on background content for full WCAG compliance.
- **Event-Driven** — Opens and closes via global Custom Events, so triggers can live anywhere in the DOM.
- **Built-in Portal** — Teleports an existing DOM element into the drawer on open and returns it on close, avoiding markup duplication.

## Props

| Property   | Type     | Default    | Description                                       |
|:-----------|:---------|:-----------|:--------------------------------------------------|
| `id`       | `string` | *Required* | Unique identifier used for event targeting.       |
| `position` | `enum`   | `right`    | Placement: `left`, `right`, or `center` (modal).  |
| `size`     | `string` | `400px`    | Maximum width (e.g., `100%`, `500px`).            |
| `title`    | `string` | `null`     | Accessible title for screen readers and header.   |
| `portal`   | `object` | `null`     | Portal configuration (see below).                 |

## Slots

| Slot      | Required | Description                                                                 |
|-----------|----------|-----------------------------------------------------------------------------|
| `content` | Yes      | Main drawer content (navigation, cart, form, or any interactive content).   |
| `footer`  | No       | Optional sticky footer area for actions, summaries, or confirmations.       |

---

## Portal (DOM Teleporting)

The portal feature moves an existing element from elsewhere in the page into the drawer when it opens, and returns it to its original location when it closes. This avoids duplicating markup for elements like navigation menus that need to appear in both desktop and mobile contexts.

### Portal props

| Property  | Type     | Description                                                                 |
|-----------|----------|-----------------------------------------------------------------------------|
| `source`  | `string` | CSS selector for the element to teleport into the drawer.                   |
| `wrapper` | `string` | CSS selector for the element to return the source to when the drawer closes.|
| `slot`    | `string` | ID of the container element inside the drawer's `content` that receives the source. |

### How it works

1. **On open** — The drawer queries `source` from the DOM and appends it inside the element matching `slot` (which must exist in `content`). A `wudo:portal:moved-in` event is dispatched.
2. **On close** — The source element is moved back into `wrapper`.
3. **On resize** — If the trigger element becomes hidden (e.g., viewport grows past a breakpoint), the drawer auto-closes and returns the element.

### Portal example — Mobile menu

The navigation is rendered once in the header. When the drawer opens on mobile, the menu is teleported into the drawer; when it closes (or the viewport widens), it's returned.

```twig
{# The menu lives in the header at desktop widths #}
<div class="site-header__menu">
  <div data-desktop-menu>
    {{ nav_output|raw }}
  </div>
</div>

{# The drawer teleports [data-desktop-menu] into #mobile-menu-slot on open #}
{{ include('wudo:drawer', {
  id: 'mobile-menu-drawer',
  position: 'right',
  size: '500px',
  title: 'Menu',
  content: '<div id="mobile-menu-slot"></div>',
  portal: {
    source: '[data-desktop-menu]',
    wrapper: '.site-header__menu',
    slot: 'mobile-menu-slot',
  },
}, with_context = false) }}
```

### Portal example — Cart sidebar

```twig
{{ include('wudo:drawer', {
  id: 'cart-drawer',
  position: 'right',
  size: '450px',
  title: 'Your Cart',
  content: '<div id="cart-slot"></div>',
  portal: {
    source: '#cart-contents',
    wrapper: '#cart-page',
    slot: 'cart-slot',
  },
}, with_context = false) }}
```

---

## Usage Example (Static Content)

When you don't need the portal — just pass content directly:

```twig
{{ include('wudo:drawer', {
  id: 'newsletter-modal',
  position: 'center',
  size: '500px',
  title: 'Subscribe',
  content: '<p>Sign up for our newsletter.</p>',
}, with_context = false) }}
```

## Trigger Examples

The component listens for a global `drawer:open` event, so triggers can be placed anywhere.

### HTML button
```html
<button type="button"
  onclick="document.dispatchEvent(new CustomEvent('drawer:open', { detail: { id: 'newsletter-modal' } }))">
  Open Modal
</button>
```

### Auto-open after delay
```javascript
setTimeout(() => {
  document.dispatchEvent(new CustomEvent('drawer:open', {
    detail: { id: 'newsletter-modal' }
  }));
}, 5000);
```

### Exit-intent
```javascript
document.addEventListener('mouseleave', (e) => {
  if (e.clientY < 0) {
    document.dispatchEvent(new CustomEvent('drawer:open', {
      detail: { id: 'newsletter-modal' }
    }));
  }
}, { once: true });
```

### Programmatic close
```javascript
document.dispatchEvent(new CustomEvent('drawer:close', {
  detail: { id: 'newsletter-modal' }
}));
```

## Accessibility & Focus Management

Uses the `inert` attribute on sibling elements of the drawer. When active:

- Keyboard users cannot tab into background content.
- Screen readers are restricted to the drawer.
- Focus moves to the first interactive element inside the drawer.
- `Escape` key closes the drawer and restores focus to the trigger.
