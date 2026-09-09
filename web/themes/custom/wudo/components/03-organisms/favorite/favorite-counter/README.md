# Favorite Counter
The Favorite Counter component displays the number of items a user has marked as favorites. It is typically used in the website header or user profile sections to provide quick access to the user's favorite items.

## Requires
* `wudo:favorite-counter` (itself)
* `wudo:favorite-button`
* `wudo:favorite-drawer`
* `wudo:button`
* `wudo:icon`
* `wudo:badge`


## Usage
Basic usage example:
```twig
{{ include('wudo:favorite-counter-trigger', {
  drawer_id: 'my-watchlist'
}) }}
```
Advanced usage example with custom labels:
```twig
{{ include('wudo:favorite-counter-trigger', {
  drawer_id: 'my-watchlist',
  button_label: 'My Watchlist',
  badge_style: 'green'
}) }}
```

The badge should have a CSS class `js-count`.
