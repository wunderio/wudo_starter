# Favorite Drawer
The Favorite Drawer component provides a slide-out panel that displays the user's favorite items. It is typically triggered by clicking on the Favorite Counter component.

## Requires
* `wudo:favorite-drawer` (itself)
* `wudo:favorite-counter`
* `wudo:favorite-button`
* `wudo:focus-trap`

## Usage
The drawer is a self-contained Web Component that manages its own state and data fetching.

```html
<wudo-favorite-drawer
  id="favorite-drawer"
  api-url="/api/favorites"
  label-title="My Saved Items"
  label-empty="Nothing saved yet."
  label-loading="Loading..."
  label-remove="Delete"
></wudo-favorite-drawer>
```
## Manual Control
You can open or close the drawer programmatically using JavaScript:

```javascript
// Open
window.dispatchEvent(new CustomEvent('drawer:open', { detail: { id: 'favorite-drawer' } }));

// Close
window.dispatchEvent(new CustomEvent('drawer:close', { detail: { id: 'favorite-drawer' } }));
```
