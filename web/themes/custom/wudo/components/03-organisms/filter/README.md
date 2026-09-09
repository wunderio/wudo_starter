# Wudo Filter Manager & Filter trigger
A decoupled UI pattern for Drupal Views consisting of three synchronized components: Toggler, Drawer, and Manager. This suite handles the complex lifecycle of AJAX-powered filters while providing a clear UX for active filter states.

## Core Components
1. `filter-toggler`: A trigger button that opens the filter panel and listens for state updates to display an active filter count (Badge).
2. `filter-manager`: A logic wrapper that analyzes the nested `<form>`, calculates active selections (ignoring defaults like "All"), and broadcasts updates via Custom Events.
3. `drawer`: A reusable sliding panel component that can be positioned on any side of the viewport, used here to contain the filter manager.

## Usage
This code can be placed in the views-view.html.twig
```twig
{% if exposed %}
  <div class="view__filters layout__sidebar">
  {# Trigger Button - can be placed anywhere in the DOM tree #}
    <div class="view__filters--header">
      {{ include('wudo:filter-toggler', {
        drawer_id: 'filter-control-center',
        badge_style: 'yellow',
        badge_position: 'inline',
        button_label: 'Filters'|t,
      }, with_context = false) }}
    </div>
    <div class="view__filters--content">
      {% embed 'wudo:drawer' with {
        id: 'filter-control-center',
        position: 'right',
        size: '400px',
        title: 'Filters'|t,
        exposed: exposed,
        modifier_class: 'drawer--filters'
      } only %}
        {% block content %}
          {% embed 'wudo:filter-manager' with {
            id: 'filter',
            exposed: exposed
          } only %}
            {% block content %}
              {{ exposed }}
            {% endblock %}
          {% endembed %}
        {% endblock %}
      {% endembed %}
    </div>
  </div>
{% endif %}
```
