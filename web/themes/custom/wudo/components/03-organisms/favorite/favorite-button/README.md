# Favorite Button

The Favorite Button component is used to allow users to mark items as favorites. It can be integrated into various parts of the website where users can save their preferred items for easy access later.

## Requires
* `wudo:favorite-button` (itself)
* `wudo:favorite-counter`
* `wudo:favorite-drawer`
* `wudo:button`
* `wudo:icon`
* `wudo:badge`

## Usage
```twig
{{ include('wudo:favorite-button', {
  content_id: node.id,
  drawer_id: 'watchlist',
  label: node.label,
  modifier_class: 'custom-fav'
}, with_context = false) }}
```
or
```twig
{% embed 'wudo:favorite-button' with {
  content_id: node.id,
  drawer_id: 'watchlist',
  label: node.label
  } %}
  {% block favorite_button_content %}
    {{ include('wudo:button', {
      type: 'primary',
      text: 'Read later',
      icon: 'star',
      modifier_class: 'custom-fav'
    }) }}
  {% endblock %}
{% endembed %}
```

