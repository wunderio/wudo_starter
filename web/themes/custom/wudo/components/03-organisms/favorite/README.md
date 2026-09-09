# Wudo Favorites System
A lightweight, accessible, and highly customizable favorites management system for Drupal, built using LitElement (Web Components) and Vanilla JavaScript.
## Features
* **Framework Agnostic:** Core logic lives in Web Components.
* **Decoupled Storage:** Uses localStorage with cross-tab synchronization.
* **Accessibility First:** Includes a robust Focus Trap Manager for Drawers and full keyboard support (WAI-ARIA).
* **Theming Ready:** Fully customizable via CSS Custom Properties (Variables).
* **Drupal Integrated:** Seamlessly handles translations and data passing via Twig.

## Architecture
The system consists of three main parts:

1. **Favorite Button** `wudo:favorite-button`: Adds/removes items to the favorite list.
2. **Favorite Counter** `wudo:favorite-counter`: A global badge showing the current count.
3. **Favorite Drawer** `wudo:favorite-drawer`: Displays the list of favorite items in a drawer.

## Local Storage
Data is stored in `localStorage` under the key `wudo_favs` as a JSON array:
```json
[
  { "id": "123", "label": "Article Title" },
  { "id": "456", "label": "Another Product" }
]
```
